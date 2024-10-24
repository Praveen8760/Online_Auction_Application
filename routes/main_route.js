
const express=require('express')
const UserModel=require('../schema/user_schema');
const Auction=require('../schema/auction_schema');
const Bid =require('../schema/bid_schema');
const bcrypt=require('bcrypt')
const mongoose=require('mongoose')
const { upload } = require('../src/javascript/image_cloud');

const AuctionModel =require('../schema/auction_schema');
const CategoryModel=require('../schema/catagory_schema');
const send_wailtingList_email = require('../src/javascript/waitlist_Email.js');
const winnerMail=require('../src/javascript/winnerEmail.js');
const paymentEmail=require('../src/javascript/paymentEmail.js');
const {addHours}=require('date-fns')
const razorpay=require('razorpay')
const crypto=require('crypto')

const route=express.Router();


function isLoggedIn(request,response,next){
    if(request.isAuthenticated()){
        next();
    }else{
        response.redirect('/login')
    }
}


const Razorpay=new razorpay({
    key_id:'rzp_test_lUSTLw9h4ehK3T',
    key_secret:'OS3zsOd39Kph1nehGCaeidMG'
})




route.get('/home',isLoggedIn, async (request, response) => {
    try {
        const current_time=new Date();

        // current Auction data
        const auctions = await Auction.find({ status: 'active' ,start_time:{$lte:current_time},end_time:{$gt:current_time}});
        const user=await UserModel.findOne({email:request.session.passport.user})

        // getting upcoming auction data
        const upcomingAuctions=await Auction.find({start_time:{$gt:current_time},status:'active'});
        if (!user) {
            throw new Error('User not found');
        }

        request.session.passport._id=user._id
        response.render('home', {user, auctions , upcomingAuctions , userId: user._id });
    } 
    catch (error) {
        console.error('Error fetching auctions:', error);
        response.status(500).send('Error fetching auctions');
    }
})


// waiting List for Upcoming Auction

route.post('/join-waiting-list/:auctionId', isLoggedIn, async (req, res) => {
    const auctionId = req.params.auctionId;
    const userId = req.session.passport._id; // Ensure you have user ID from session

    try {
        // Find the auction by ID
        const auction = await Auction.findById(auctionId);
        const user=await UserModel.findOne({email:req.session.passport.user})
        if (!auction) {
            return res.status(404).send('Auction not found');
        }

        // Check if the user is already on the waiting list
        if (auction.waiting_list.includes(userId)) {
            return res.status(400).send('You are already on the waiting list.');
        }

        // Add the user to the waiting list
        auction.waiting_list.push(userId);
        await auction.save();

        send_wailtingList_email(user,auction);

        res.status(200).send('Successfully joined the waiting list.');
    } catch (error) {
        console.error('Error joining waiting list:', error);
        res.status(500).send('Error joining waiting list. Please try again later.');
    }
});


// profile routes

route.get('/profile',async(request,response)=>{
    const user=await UserModel.findOne({email:request.session.passport.user})
    
    return response.render('user/profile',{user})
})


route.post('/profile',async(request,response)=>{
    try {
        const { fullname, email, current_password, new_password, confirm_new_password, payment_method, } = request.body;
        
        
        // Find the user by their email
        const user = await UserModel.findOne({ email });

        if (!user) {
            response.redirect('profile');
        }

        // Check if current password matches


        // Update fields if provided
        if (new_password && new_password === confirm_new_password) {
            user.password = await bcrypt.hash(new_password, 10); // Hash the new password
        }

        user.fullname = fullname || user.fullname;
        user.email = email || user.email;

        // Update payment method
        if (payment_method) {
            user.payment_methods = [{
                card_number: payment_method.card_number,
                card_expiry: payment_method.card_expiry,
                card_cvc: payment_method.card_cvc,
            }];
        }

        // Save the updated user
        await user.save();

        // Redirect or send a success response
        response.redirect('profile');
    } catch (error) {
        console.error(error);
        response.redirect('profile');
    }
})


// add Auction routes
route.get('/addProduct',async(request,response)=>{
    const user=await UserModel.findOne({email:request.session.passport.user})
    response.render('user/add_product',{user})
})

route.post('/addProduct',upload.array('image',5),async(request,response)=>{
    try {
        const {body} = request;
        
        console.log(body);

        // Get the seller ID from the session
        const seller_id = request.session.passport._id;  
        console.log(seller_id);
        
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
            status:'pending',
            category:category._id
        })
        console.log("Auction end");
        await newAuction.save();
        request.io.emit('newProduct', { productName: newAuction.title, productId: newAuction._id });
        response.redirect('home');
    } 
    catch (error) {
        console.error(error);
        response.status(500).send('Error creating auction');
    }   
});





route.get('/orders', async (req, res) => {
    try {
        const userId = req.session.passport._id;
        
        
        const user=await UserModel.findOne({email:req.session.passport.user})
        // Find auctions where the user is the winner and payment is pending
        const wonAuctions = await Auction.find({ winner_id: userId, status: 'completed' });


        res.render('user/order', { auctions: wonAuctions , user });
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).send('Server Error');
    }
});



async function checkAuctions() {
    const now = new Date();
    try {
        console.log('Checking for auctions to close at:', now); // Log current time
        
        const allAuctions = await Auction.find({ status: 'active' ,end_time :{$lte : now}});
        
        if (allAuctions.length === 0) {
            console.log('No expired auctions found.');
        }

        for (const auction of allAuctions) {
            console.log(`Auction ${auction._id} (${auction.title}) has ended.`);

            // Find the highest bid for the auction
            const highestBid = await Bid.findOne({ auction_id: auction._id }).sort({ amount: -1 });

            if (highestBid) {
                // Mark the auction as completed
                auction.status = 'completed';
                
                // Fetch the winning user's email
                const winnerUser = await UserModel.findById(highestBid.user_id);
                
                auction.winner_id=winnerUser._id;
                auction.payment_due = addHours(new Date(), 48);
                await auction.save();
                if (winnerUser) {
                    // Send email to the winner
                    winnerMail(winnerUser,auction);
                } else {
                    console.log(`No winner found for auction ${auction._id}`);
                }
            } else {
                console.log(`No bids found for auction ${auction._id}`);
            }
        }
    } catch (error) {
        console.error('Error checking auctions:', error);
    }
}


// payment
route.get('/pay/:auctionId', async (req, res) => {
    try {
        const auctionId = req.params.auctionId;
        console.log(auctionId);
        
        const auction = await Auction.findById(auctionId);

        if (!auction) {
            return res.status(404).send('Auction not found');
        }

        // Create Razorpay order if payment is pending
        if (auction.payment_status === 'pending') {
            const options = {
                amount: auction.current_bid * 100, // Amount in paise
                currency: 'INR',
                receipt: `receipt_${auctionId}`,
            };

            const order = await Razorpay.orders.create(options);
            res.render('user/payment', { auction, order });
        } else {
            res.send('Payment already completed.');
        }
    } catch (error) {
        console.error('Error creating payment link:', error);
        res.status(500).send('Server Error');
    }
});
route.post('/payment/success', async (req, res) => {
    const { order_id, payment_id, signature } = req.body;
    const auctionId = req.body.auctionId;

    // Verify signature
    const expectedSignature = crypto.createHmac('sha256', 'OS3zsOd39Kph1nehGCaeidMG')
        .update(order_id + '|' + payment_id)
        .digest('hex');

    if (signature === expectedSignature) {
        const auction = await Auction.findById(auctionId);
        const user=await UserModel.findById(auction.winner_id);
        if (auction) {
            auction.payment_status = 'paid';
            await auction.save();
            paymentEmail(user,auction)
            res.redirect('/orders'); // Redirect to orders page on success
        }
    } else {
        res.status(400).send('Payment verification failed');
    }
});

route.post('/payment/failure', async (req, res) => {
    const auctionId = req.body.auctionId;
    const auction = await Auction.findById(auctionId);

    if (auction) {
        auction.payment_status = 'failed';
        await auction.save();
        res.redirect('/orders');
    }
});


async function checkPaymentDue() {
    const now = new Date();
    try {
        const overdueAuctions = await Auction.find({
            payment_status: 'pending',
            payment_due: { $lte: now }
        });

        for (const auction of overdueAuctions) {
            auction.status = 'active'; // Reset auction status
            auction.current_bid = 0; // Reset to starting bid
            auction.winner_id = null; // Remove the winner
            auction.payment_status = 'pending'; // Reset payment status
            auction.payment_due = null; // Remove payment due date
            await auction.save();
            console.log(`Auction ${auction._id} reset due to overdue payment.`);
        }
    } catch (error) {
        console.error('Error checking payment due:', error);
    }
}











// Add this route in your Express app
route.get('/logout', (request, response) => {
    request.logout((err) => {
        if (err) {
            console.error('Logout error:', err);
            return res.status(500).send('Server error');
        }

        // Destroy the session
        request.session.destroy((err) => {
            if (err) {
                console.error('Session destruction error:', err);
                return response.status(500).send('Server error');
            }

            
            request.redirect('/login'); 
        });
    });
});



setInterval(checkAuctions,60*1000);
setInterval(checkPaymentDue, 60 * 60 * 1000); // Check every hour


module.exports = route