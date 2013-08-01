var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var BoardSchema = new Schema({
    turn: {
        type: Number,
        default: 0,        
        min: 0,
        max: 9
    },
    spots: {
        type: [Number],
        default: [2, 2, 2, 2, 2, 2, 2, 2, 2]
    },
    players: {
        type: [Number],
        default: []
    },
    isComplete: {
        type: Boolean,
        default: false
    }
});

module.exports = BoardSchema;