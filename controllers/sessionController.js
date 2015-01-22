(function (sessionController) {
    // module references
    var urlModule = require('url');
    
    // public methods
    sessionController.init = function (app, io) {
        app.get('/session/create', sessionController.create);
        app.get('/session/join', sessionController.join);
    }
    
    sessionController.create = function (req, res) {

        var parsedQueryString = urlModule.parse(req.url, true).query;        

        var shortIdModule = require('shortid');
        res.render('join', {sessionId : shortIdModule.generate(), userName : parsedQueryString.userName, year: new Date().getFullYear()});
    };
    
    sessionController.join = function (req, res) {
        
        var parsedQueryString = urlModule.parse(req.url, true).query;
        
        if (parsedQueryString.sessionId) {
            
            if (!parsedQueryString.userName) {
                res.render('enterYourName', { url : req.url });
            }
            else {
                res.render('join', { sessionId : parsedQueryString.sessionId, userName : parsedQueryString.userName , year: new Date().getFullYear()});
            }
        }
        else {
            res.render('wrongSessionId');
        }
    };
    
})(module.exports);