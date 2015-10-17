var app        = require('express')();
var bodyParser = require('body-parser');
var glob       = require('glob');
var config     = require('./config.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));
var extra = '';
if (glob.sync(config.root + '/server').length) {
    extra = '/server';
}
var controllers = glob.sync(config.root + extra + '/controllers/*.js');
controllers.forEach(function (controller) {
    controller = controller.replace(extra, '');
    require(controller).init(app);
});

app.listen(config.port, function () {
    console.log('Angular server listening on port: ' + config.port);
});