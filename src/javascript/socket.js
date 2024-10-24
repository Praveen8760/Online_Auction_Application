// const Auction = require('../../schema/auction_schema');

const Auction = require('../../schema/auction_schema');
const Bid = require('../../schema/bid_schema');

const mongoose = require('mongoose');


module.exports = (io) => {
    io.on('connection', (socket) => {
        console.log('User connected');

        socket.on('placeBid', async ({ auctionId, userId, bidAmount }) => {
            try {
                console.log
                
                // Convert userId to ObjectId
                const userObjectId =new  mongoose.Types.ObjectId(userId);

                const auction = await Auction.findById(auctionId);
                if (!auction) {
                    return socket.emit('error', 'Auction not found');
                }

                if (auction.status !== 'active') {
                    return socket.emit('error', 'Auction is not active');
                }

                if (bidAmount <= auction.current_bid) {
                    return socket.emit('error', 'Bid must be higher than the current bid');
                }

                // Create a new Bid document
                const newBid = new Bid({
                    auction_id: auctionId,
                    user_id: userObjectId, // Use ObjectId here
                    amount: bidAmount
                });
                await newBid.save();

                // Update auction with new bid
                auction.current_bid = bidAmount;
                auction.bids.push(newBid._id); // Add Bid reference
                await auction.save();

                // Emit updated bid details to all clients
                io.emit('bidUpdated', {
                    auctionId,
                    bidAmount,
                    bidId: newBid._id,
                    userId
                });
            } catch (err) {
                console.error('Error handling bid:', err);
                socket.emit('error', 'Error handling bid');
            }
        });

        socket.on('disconnect', () => {
            console.log('User disconnected');
        });
    });
};
