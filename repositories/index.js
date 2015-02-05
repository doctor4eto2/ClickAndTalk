(function (repositories) {
    var threadRepository = require('./threadRepository');
    var threadRatingRepository = require('./threadRatingRepository');
    repositories.threadRepository = threadRepository;
    repositories.threadRatingRepository = threadRatingRepository;
    repositories.init = function () {
        var mongoose = require('mongoose');
        mongoose.connect('mongodb://test:test@ds031561.mongolab.com:31561/clickandtalk');
        var con = mongoose.connection;
        con.once('open', function () {
            threadRepository.seedThreads();
            threadRatingRepository.seedThreadRatings();
        });
        threadRepository.init();
        threadRatingRepository.init();
    };
})(module.exports);
