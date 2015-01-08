(function (sessionController) {
    
    sessionController.init = function (app, io) {
        app.get('/session/create', sessionController.create);
        app.get('/session/join', sessionController.join);
    }
    
    sessionController.create = function (req, res) {
        res.render('join', {});
    };
    
    sessionController.join = function (req, res) {
        
        var queryStringModule = require('queryString');
        var urlModule = require('Url');
        var parsedQueryString = queryStringModule.parse(urlModule.parse(req.url).query);
        
        if (parsedQueryString.sessionId != null) {
            res.render('join', { sessionId : parsedQueryString.sessionId });
        }
        else {
            res.render('wrongSessionId');
        }
    };
    
})(module.exports);