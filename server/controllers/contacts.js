var express   = require('express');
var router    = express.Router();
var apiRouter = require('./api.js').router;
var Contacts  = require('../models/contacts.js');

express.Router({mergeParams: true});

console.info('Contacts Controller Invoked');

function init () {
    apiRouter.use('/contacts', router);
};

function handleSuccess(row, res) {
    res.json(row);
}

function handleError(err, res, next) {
    res.json({error: err});
    next(err);
}

function doIt(what, req, res, next) {
    var params = []
    if (req.params.contactId) {
        params.push(req.params.contactId);
    }

    if (req.body && Object.keys(req.body).length) {
        params.push(req.body);
    }

    params.push(function (row) {
        handleSuccess(row, res)
    });

    params.push(function (err) {
        handleError(err, res, next)
    });

    if (Contacts[what]) {
        Contacts[what].apply(this, params);
    } else {
        console.error('No such method on the model: ', what);
    }
}


router.get('/', function (req, res, next) {
    doIt('read', req, res, next);
});

router.post('/', function(req, res, next) {
    doIt('create', req, res, next);
});

router.get('/:contactId', function (req, res, next) {
    doIt('readOne', req, res, next);
});

router.delete('/:contactId', function (req, res, next) {
    doIt('remove', req, res, next);
});

router.put('/:contactId', function (req, res, next) {
    doIt('update', req, res, next);
});

module.exports = {
    init: init,
    router: router
}