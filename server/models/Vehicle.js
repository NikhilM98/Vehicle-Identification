var mongoose = require('mongoose');

var UserSchema = new mongoose.Schema({
    number: {
        type: String,
        required: true,
        unique: true,
        uppercase: true
    },
    updated_date: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Vehicle', UserSchema);
