
const mongoose=require('mongoose');

const bidSchema = new mongoose.Schema({
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
        type: mongoose.Schema.Types.BigInt, 
        required: true 
    },
    timestamp: { 
        type: mongoose.Schema.Types.Date, 
        default: Date.now 
    },
    status: { 
        type: mongoose.Schema.Types.String, 
        enum: ['active', 'outbid', 'winning', 'canceled'], 
        default: 'active' 
    }
});

const BidModel = mongoose.model('Bid', bidSchema);

module.exports=BidModel;
