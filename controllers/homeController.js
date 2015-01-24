(function (homeController) {
    // public methods
    homeController.init = function (app, io) {
        app.get('/', homeController.index);
        app.get('/about', homeController.about);
        app.get('/contact', homeController.contact);
    }
    
    homeController.index = function (req, res) {
        res.render('index', { title: 'Click And Talk', year: new Date().getFullYear() });
    };
    
    homeController.about = function (req, res) {
        res.render('about', { title: 'Click And Talk', year: new Date().getFullYear(), message: 'This is an open source application which allows free online video chat via webRTC and web sockets.' });
    };
    
    homeController.contact = function (req, res) {
        res.render('contact', { title: 'Click And Talk', year: new Date().getFullYear(), message: 'Please, contact me if you need any help!' });
    };
})(module.exports);