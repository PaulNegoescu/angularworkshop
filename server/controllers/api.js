var express = require('express');
var router = express.Router();

console.info('API Controller Invoked');

function init (app) {
    app.use('/api/v1', router);
};

router.get('/', function (req, res) {
    res.json({message: 'Welcome to the angular workshop API!'});
});

module.exports = {
    init: init,
    router: router
}