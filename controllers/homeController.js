(function (homeController) {
    
    homeController.init = function (app, io) {
        app.get('/', homeController.index);
        app.get('/about', homeController.about);
        app.get('/contact', homeController.contact);
    }
    
    homeController.index = function (req, res) {
        res.render('index', { title: 'Click And Talk', year: new Date().getFullYear() });
    };
    
    homeController.about = function (req, res) {
        res.render('about', { title: 'Click And Talk', year: new Date().getFullYear(), message: '"Click and Talk" is application which allows free online video chat.' });
    };
    
    homeController.contact = function (req, res) {
        res.render('contact', { title: 'Click And Talk', year: new Date().getFullYear(), message: 'Please, contact me if you need help!' });
    };
})(module.exports);