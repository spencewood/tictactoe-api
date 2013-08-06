var mongoose = require('mongoose');
var mongooseTypes = require('mongoose-types');
mongooseTypes.loadTypes(mongoose, 'email');
var Schema = mongoose.Schema;
var uuid = require('node-uuid');
var findOrCreate = require('mongoose-findorcreate');

var UserSchema = new Schema({
    email: {
        type: mongoose.SchemaTypes.Email,
        trim: true
    },
    token: {
        type: String,
        unique: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
});

UserSchema.pre('save', function(next){
    this.token = uuid.v4();
    next();
});

UserSchema.plugin(findOrCreate);

module.exports = UserSchema;