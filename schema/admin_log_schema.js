
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const adminLogSchema = new Schema({
    admin_id: { 
        type: Schema.Types.ObjectId, 
        ref: 'User', 
        required: true 
    },
    action: { 
        type: String, 
        required: true 
    },
    target_id: { 
        type: Schema.Types.ObjectId 
    }, 
    timestamp: { 
        type: Date, 
        default: Date.now 
    }
});

module.exports = mongoose.model('AdminLog', adminLogSchema);
