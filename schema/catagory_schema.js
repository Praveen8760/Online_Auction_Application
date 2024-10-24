const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true, 
        trim: true 
    },
    description: { 
        type: String, 
        trim: true 
    },
    created_at: { 
        type: Date, 
        default: Date.now 
    },
    updated_at: { 
        type: Date, 
        default: Date.now 
    }
});

// Middleware to update the `updated_at` field on each save
categorySchema.pre('save', function(next) {
    this.updated_at = Date.now();
    next();
});

const Category = mongoose.model('Category', categorySchema);

module.exports = Category;
