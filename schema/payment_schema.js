const mongoose=require('mongoose');


const paymentSchema = new Schema({
    auction_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'Auction', 
        required: true 
    },
    user_id: { 
        type: mongoose.Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    amount: { 
        type: mongoose.Schema.Types.Number, 
        required: true },
    payment_method: {
        card_number: mongoose.Schema.Types.String,
        card_expiry: mongoose.Schema.Types.String,
        card_cvc: mongoose.Schema.Types.String,
    },
    status: { 
        type: mongoose.Schema.Types.String, 
        enum: ['pending', 'completed', 'failed'], 
        default: 'pending' 
    },
    timestamp: { 
        type: mongoose.Schema.Types.Date, 
        default: Date.now 
    },
    receipt_url: { 
        type: mongoose.Schema.Types.String 
    }
});

module.exports = mongoose.model('Payment', paymentSchema);
