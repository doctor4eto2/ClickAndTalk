(function (dataRepository) {
    //private fields
    var mongoose = require('mongoose');
    var Thread;
    var threadSchema = mongoose.Schema({
        sessionId : { type : String, index: true },
        messages : [{
            userName : { type : String },
            message : { type : String }, 
            time : { type : Date }, 
            color : { type : String }
        }]
    });
    
    //private methods  
    var seedThreads = function () {
            Thread.find({}).exec(function (error, collection) {
            if (collection.length === 0) {
                Thread.create({
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
    //public methods
    dataRepository.init = function () {
        mongoose.connect('mongodb://doctora:pa77word@ds031561.mongolab.com:31561/clickandtalk');
        var con = mongoose.connection;
        con.once('open', function () {
            seedThreads();
        });
        Thread = mongoose.model('Thread', threadSchema);
    };
    dataRepository.saveThread = function (data) {
        Thread.findOne({ sessionId : data.sessionId }, function (error, thread) {
            if (error) {
                console.log(error);
                return;
            }

            if (thread) {
                thread.messages.push({
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
    dataRepository.getChatHistory = function (sessionId) {
        return Thread.findOne({ sessionId : sessionId });
    };

})(module.exports);
