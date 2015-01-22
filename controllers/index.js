(function (controllers) {
    // module references
    var homeController = require("./homeController");
    var sessionController = require("./sessionController");
    
    // public methods
    controllers.init = function (app, io) {
        homeController.init(app, io);
        sessionController.init(app, io);
    }

})(module.exports);