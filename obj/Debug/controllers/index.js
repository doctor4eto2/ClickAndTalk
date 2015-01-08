(function (controllers) {
    
    var homeController = require("./homeController");
    var sessionController = require("./sessionController");
    
    
    controllers.init = function (app, io) {
        homeController.init(app, io);
        sessionController.init(app, io);
    }

})(module.exports);