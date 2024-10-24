const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const auctionSchema = new Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    images: [{ type: String }],
    starting_bid: { type: Number, required: true },
    current_bid: { type: Number, default: 0 },
    bid_increment: { type: Number, default: 1 },
    start_time: { type: Date, required: true },
    end_time: { type: Date, required: true },
    status: { type: String, enum: ['pending', 'active', 'completed', 'cancelled'], default: 'active'},
    seller_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    category: { type: Schema.Types.ObjectId, ref: 'Category', required: true },
    bids: [{ type: Schema.Types.ObjectId, ref: 'Bid' }],
    winner_id: { type: Schema.Types.ObjectId, ref: 'User' },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
    payment_status:{type:String, enum:['pending', 'paid', 'failed'],default:'pending'},
    payment_due: { type: Date },
    waiting_list:[{type:mongoose.Types.ObjectId,ref:'User'}]
});

const AuctionModel = mongoose.model('Auction', auctionSchema);

module.exports= AuctionModel;
