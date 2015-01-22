(function (dataRepository) {
    //private fields
    var mongoose = require('mongoose');
    var Thread;
    var ThreadRating;
    var threadSchema = mongoose.Schema({
        sessionId : { type : String, index: true },
        messages : [{
            messageId : { type : String},
            userName : { type : String },
            message : { type : String }, 
            time : { type : Date }, 
            color : { type : String }
        }]
    });
    var threadRatingSchema = mongoose.Schema({
        sessionId : { type : String, index: true },
        stats : [{
            messageId : { type : String },
            message : { type : String },
            color : { type : String },
            votes : { type : [String] }
        }]
    });
    
    //private methods  
    var seedThreads = function () {
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
    var seedThreadRatings = function () {
        ThreadRating.find({}).exec(function (error, collection) {
            if (collection.length === 0) {
                ThreadRating.create({
                    sessionId : '1234123', 
                    stats : [{
                        messageId : 'message1' ,
                        message : 'test_message',
                        votes : ['user1', 'user2']
                    }]
                });
            }
        });
    };
    //public methods
    dataRepository.init = function () {
        mongoose.connect('mongodb://test:test@ds031561.mongolab.com:31561/clickandtalk');
        var con = mongoose.connection;
        con.once('open', function () {
            seedThreads();
            seedThreadRatings();
        });
        Thread = mongoose.model('Thread', threadSchema);
        ThreadRating = mongoose.model('ThreadRating', threadRatingSchema);
    };
    dataRepository.saveThread = function (data) {
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
            });
        });
    };
    dataRepository.voteForMessage = function (data, next) {
        ThreadRating.findOne({ sessionId : data.sessionId }, function (error, threadRating) {
            if (error) {
                console.log(error);
                return;
            }
            
            if (threadRating) {
                var exists = false;
                var index = 0;// the index of the required message, valid only if exists = true
                
                for (; index < threadRating.stats.length; index++) {
                    if (threadRating.stats[index].messageId == data.messageId) {
                        exists = true;
                        break;
                    }
                }

                if (exists) {
                    threadRating.stats[index].votes.push(data.userName);
                }
                else {
                    threadRating.stats.push({messageId : data.messageId, message : data.message, color : data.color,votes : [data.userName] });
                }
            }
            else {
                threadRating = new ThreadRating({
                    sessionId : data.sessionId,
                    stats : [{
                        messageId : data.messageId,
                        message : data.message,
                        color : data.color,
                        votes : [data.userName]
                    }]
                });
            }
            threadRating.save(function (err) {
                if (err) {
                    console.log('error when save');
                }
                else {
                    next();
                }
            });
        });
    };
    dataRepository.getThreadRating = function (sessionId) {
        return ThreadRating.findOne({ sessionId : sessionId });
    };
    dataRepository.getChatHistory = function (sessionId) {
        return Thread.findOne({ sessionId : sessionId });
    };

})(module.exports);
