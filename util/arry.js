var _ = require('underscore');

var Arry = {
    multiply: function(arr){
        return _.reduce(arr, function(memo, num){
            return memo * num;
        });
    },

    firstRandomValue: function(arr){
        return _.chain(arr)
            .shuffle()
            .first()
            .value();
    },

    allIndexesOf: function(arr, item){
        var indexes = [];
        for(var i = 0; i < arr.length; i++){
            if(arr[i] === item){
                indexes.push(i);
            }
        }
        return indexes;
    },

    hasDuplicates: function(arr){
        var sorted_arr = arr.sort();
        var results = [];
        for (var i = 0; i < arr.length - 1; i++) {
            if (sorted_arr[i + 1] === sorted_arr[i]) {
                results.push(sorted_arr[i]);
            }
        }
        return results.length === 0;
    }
};

module.exports = Arry;