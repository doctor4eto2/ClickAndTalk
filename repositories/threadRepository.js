(function (threadRepository) {

    //private fields
    var _mongoose = require('mongoose');
    var Thread;
    var _threadSchema = {
        sessionId : { type : String, index: true },
        messages : [{
            messageId : { type : String },
            userName : { type : String },
            message : { type : String }, 
            time : { type : Date }, 
            color : { type : String }
        }]
    };
    //public methods
    threadRepository.seedThreads = function () {
        Thread.find({}).exec(function (error, collection) {
            if (collection.length === 0) {
                Thread.create({
                    sessionId : '1234123', 
                    messages : [{
                        messageId : '132123',
                        userName : 'user1' ,
                        message : 'message1', 
                        time : new Date(), 
                        color : 'green'
                    }]
                });
            }
        });
    };
    threadRepository.init = function () {
        Thread = _mongoose.model('Thread', _mongoose.Schema(_threadSchema));
    };
    threadRepository.saveThread = function (data, next) {
        Thread.findOne({ sessionId : data.sessionId }, function (error, thread) {
            if (error) {
                console.log(error);
                return;
            }
            
            if (thread) {
                thread.messages.push({
                    messageId : data.messageId,
                    userName : data.userName,
                    message : data.message, 
                    time : data.time, 
                    color : data.color
                });
            }
            else {
                thread = new Thread({
                    sessionId : data.sessionId,
                    messages : [{
                        messageId : data.messageId,
                        userName : data.userName,
                        message : data.message, 
                        time : data.time, 
                        color : data.color
                    }]
                });
            }
            thread.save(function (err) {
                if (err) {
                    console.log('error when save');
                }
                else {
                    next();
                }
            });
        });
    };
    threadRepository.getChatHistory = function (sessionId) {
        return Thread.findOne({ sessionId : sessionId });
    };
})(module.exports);
