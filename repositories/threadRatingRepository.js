(function (threadRatingRepository) {
    //private fields
    var _mongoose = require('mongoose');
    var ThreadRating;
    var _threadRatingSchema = {
        sessionId : { type : String, index: true },
        stats : [{
            messageId : { type : String },
            message : { type : String },
            color : { type : String },
            creator : { type : String },
            votes : { type : [String] }
        }]
    };
    //public methods
    threadRatingRepository.seedThreadRatings = function () {
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
    threadRatingRepository.init = function () {
        ThreadRating = _mongoose.model('ThreadRating', _mongoose.Schema(_threadRatingSchema));
    };
    threadRatingRepository.voteForMessage = function (data, next) {
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
                    threadRating.stats.push({ messageId : data.messageId, message : data.message, color : data.color, creator : data.creator, votes : [data.userName] });
                }
            }
            else {
                threadRating = new ThreadRating({
                    sessionId : data.sessionId,
                    stats : [{
                        messageId : data.messageId,
                        message : data.message,
                        color : data.color,
                        creator : data.creator,
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
    threadRatingRepository.unvoteForMessage = function (data, next) {
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
                    var voteIndex = threadRating.stats[index].votes.indexOf(data.userName);
                    
                    if (voteIndex > -1) {
                        threadRating.stats[index].votes.splice(voteIndex, 1);
                    }
                }
                
                threadRating.save(function (err) {
                    if (err) {
                        console.log('error when save');
                    }
                    else {
                        next();
                    }
                });
            }
        });
    };
    threadRatingRepository.getThreadRating = function (sessionId) {
        return ThreadRating.findOne({ sessionId : sessionId });
    };

})(module.exports);
