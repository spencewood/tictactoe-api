var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
    email: {
        type: String,
        trim: true
    },
    token: {
        type: String
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

module.exports = UserSchema;