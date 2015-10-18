var express    = require('express');
var app        = express();
var bodyParser = require('body-parser');
var glob       = require('glob');
var config     = require('./config.js')

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
    extended: true
}));

app.use(express.static(config.root + '/../public'));

var controllers = glob.sync(config.root + '/controllers/*.js');
controllers.forEach(function (controller) {
    require(controller).init(app);
});

app.listen(config.port, function () {
    console.log('Angular server listening on port: ' + config.port, config.root);
});