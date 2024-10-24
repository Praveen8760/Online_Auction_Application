const express=require('express');
const route=express.Router();
const compare_password=require('../src/javascript/compare_password')
const passport=require('passport')

const isLoggedIn=require("./main_route")

const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const { upload } = require('../src/javascript/image_cloud');

const UserModel = require('../schema/user_schema');
const AuctionModel =require('../schema/auction_schema');
const CategoryModel=require('../schema/catagory_schema');


route.get('/login',(request,response)=>{
    if(request.session.role == "admin"){
        return response.redirect('dashboard')
    }
    response.render('admin/admin_login')
})


route.post('/login',async(request,response)=>{
    const { email, password } = request.body;
    try {
        const user = await UserModel.findOne({ email });

        if (!user || user.role !== 'admin') {
            request.flash('error_msg', 'Invalid credentials or not an admin');
            return response.redirect('login');
            // return response.status(401).json({ message: 'Invalid credentials or not an admin' });
        }
        const isMatch =  await bcrypt.compare(password, user.password);
        if (!isMatch) {
            request.flash('error_msg', 'Invalid credentials');
            return response.redirect('login');
            // return response.status(401).json({ message: 'Invalid credentials' });
        }

        // Save user ID in session
        request.session.name=user.fullname;
        request.session.userId = user._id;
        request.session.email=user.email;
        request.session.role = user.role;

        request.flash('success_msg', 'Login successful');
        response.redirect('dashboard');
        // response.status(200).json({ message: 'Login successful' });
    } 
    catch (error) {
        request.flash('error_msg', 'Something went wrong. Please try again.');
        response.redirect('login');
        // response.status(500).json({ error: error.message });
    }
});


route.post('/logout',(request,response)=>{
    request.logout(err => {
        if (err) {
            return response.status(500).json({ message: 'Logout failed' });
        }
        return response.redirect('login')
    });
})


route.get('/dashboard',async(request,response)=>{
    if(request.session.role != "admin"){
        return response.redirect('login')
    }
    else{
        const data={
            userCount:(await UserModel.find({})).length,
            activeAuction:(await AuctionModel.find({status:'active'})).length,
            pendingRequest:(await AuctionModel.find({status:'pending'})).length
        }
        const table_val=(await AuctionModel.find({}).sort({status:1}).lean());
        
        table_val.forEach(element => {
            let startDate=new Date(element.start_time);
            const formattedStartDate = `${startDate.getFullYear()}-${(startDate.getMonth() + 1).toString().padStart(2, '0')}-${startDate.getDate().toString().padStart(2, '0')}`;
            element.start_time=formattedStartDate
        });    
        console.log(request.session);
        
        return response.render('admin/dashboard',{dashboard_data:data,tableData:table_val,admin_info:request.session})
    }
})


route.get('/product',(request,response)=>{
    return response.render('admin/add_product')
})


route.post('/product',upload.array('image',5),async(request,response)=>{
    try {
        const {body} = request;
        
        console.log(body);

        // Get the seller ID from the session
        const seller_id = request.session.userId;  
        if (!seller_id) {
            console.log("seller ID");
            return response.status(401).send('You must be logged in to create an auction');
        }

        // Validate and process the category
        const category = await CategoryModel.findOneAndUpdate(
            { name: body.category },
            { name: body.category, updated_at: Date.now() },
            { new: true, upsert: true, setDefaultsOnInsert: true }
        );

        // Check for valid start and end times
        const startTimeParsed = new Date(body.startTime);
        const endTimeParsed = new Date(body.endTime);
        if (isNaN(startTimeParsed.getTime()) || isNaN(endTimeParsed.getTime())) {
            console.log("Time Issue");
            return response.status(400).send('Invalid start time or end time');
        }

        // Process the uploaded images from Cloudinary
        const imageUrls = request.files.map(file => file.path);
        if (imageUrls.length > 5) {
            console.log("Image");
            return response.status(400).send('You can upload a maximum of 5 images');
        }

        // Create the auction
        const newAuction=new AuctionModel({
            title:body.auctionName,
            description:body.description,
            images:imageUrls,
            starting_bid:body.startingBid,
            bid_increment:body.bidIncrement,
            start_time:startTimeParsed,
            end_time:endTimeParsed,
            seller_id:seller_id,
            category:category._id
        })
        console.log("Auction end");
        await newAuction.save();
        response.redirect('dashboard');
    } 
    catch (error) {
        console.error(error);
        response.status(500).send('Error creating auction');
    }   
});



route.get('/productRequest',async(request,response)=>{
    const pendingProducts = await AuctionModel.find({ status: 'pending' });
    response.render('admin/productRequest', { pendingProducts });
})

route.post('/productRequest/accept/:productId', async (request, response) => {
    try {
        const auctionId = request.params.productId;
        // Find the auction by ID and update its approval status
        const auction = await AuctionModel.findByIdAndUpdate(auctionId, { status:'active' }, { new: true });

        if (!auction) {
            return response.redirect('/admin/productRequest');
        }

        response.redirect('/admin/productRequest');
    } catch (error) {
        console.error(error);
        response.redirect('/admin/productRequest');
    }
});

route.post('/productRequest/reject/:productId', async (request, response) => {
    try {
        const auctionId = request.params.productId;
        // Find the auction by ID and update its approval status
        const auction = await AuctionModel.findByIdAndUpdate(auctionId, { status:'cancelled' }, { new: true });

        if (!auction) {
            return response.redirect('/admin/productRequest');
        }

        response.redirect('/admin/productRequest');
    } catch (error) {
        console.error(error);
        response.redirect('/admin/productRequest');
    }
});






route.get('/test',(req,res)=>{
    return res.send('test')
})


module.exports=route;