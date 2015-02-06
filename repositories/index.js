(function (repositories) {
    
    // private fields
    var _threadRepository = require('./threadRepository');
    var _threadRatingRepository = require('./threadRatingRepository');
    
    // public fields
    repositories.threadRepository = _threadRepository;
    repositories.threadRatingRepository = _threadRatingRepository;
    
    // public methods
    repositories.init = function () {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://test:test@ds031561.mongolab.com:31561/clickandtalk');
        var con = mongoose.connection;
        con.once('open', function () {
            _threadRepository.seedThreads();
            _threadRatingRepository.seedThreadRatings();
        });

        _threadRepository.init();
        _threadRatingRepository.init();
    };
})(module.exports);
