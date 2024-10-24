    const mongoose = require('mongoose');


    const UserSchema=new mongoose.Schema({
        fullname: { 
            type: mongoose.Schema.Types.String, 
            required: true,  
        },
        email: { 
            type: mongoose.Schema.Types.String, 
            required: true, 
            unique: true 
        },
        password: { 
            type: mongoose.Schema.Types.String, 
            required: true 
        },
        profile_picture: { 
            type: mongoose.Schema.Types.String 
        },
        created_at: { 
            type: mongoose.Schema.Types.Date, 
            default: Date.now 
        },
        payment_methods: [{
            card_number: {
                type: mongoose.Schema.Types.String,
                default: "0"
            },
            card_expiry: {
                type: mongoose.Schema.Types.String,
                default: "0"
            },
            card_cvc: {
                type: mongoose.Schema.Types.String,
                default: "0"
            }
        }],
        watchlist: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Auction' 
        }],
        bidding_history: [{ 
            type: mongoose.Schema.Types.ObjectId, 
            ref: 'Bid' 
        }],
        role: { 
            type: mongoose.Schema.Types.String, 
            enum: ['buyer', 'seller', 'admin'], 
            default: 'buyer' 
        }
    });


    const UserModel=mongoose.model('User',UserSchema);

    module.exports = UserModel;