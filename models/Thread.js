var mongoose = require('mongoose');
var threadScheme = mongoose.Schema({
    sessionId : { type : [String], index: true},
    messages : [{
        userName : { type : [String] },
        message : { type : [String] }, 
        time : { type : [Date] }, 
        color : { type : [String] }
    }]
});
var threadModel = mongoose.model('Thread', threadScheme);

exports.seedThreads = function () {
    threadModel.find({}).exec(function (error, collection) {
        if (collection.length === 0) {
            threadModel.create({
                sessionId : '1234123', 
                messages : [{
                    userName : 'user1' ,
                    message : 'message1', 
                    time : new Date(), 
                    color : 'green'
                }]
            });
        }
    });
};


