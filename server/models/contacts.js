var config  = require('../config')
var sqlite3 = require('sqlite3').verbose();
var dbPath  = config.root + '/data';

var db = new sqlite3.Database(dbPath + '/workshop.db');

function create(contact, success, handleErr) {
    if(!contact.firstName || !contact.lastName) {
        success({
            success: false,
            error: "Any contact should have a first and last name."
        });

        return;
    }
    contact.isFavorite = contact.isFavorite || false;

    var values = '"' + contact.firstName + '", ';
    values += '"' + contact.lastName + '", ';
    values += (contact.email ? '"' + contact.email + '"' : null) + ', ';
    values += (contact.website ? '"' + contact.website + '"' : null) + ', ';
    values += '"' + contact.isFavorite + '"';

    db.run('INSERT INTO contacts (firstName, lastName, email, website, isFavorite) VALUES (' + values + ')', function(err, rows) {
        if(err !== null) {
            // Express handles errors via its next function.
            // It will call the next operation layer (middleware),
            // which is by default one that handles errors.
            handleErr(err);
        } else {
            success({success: true, contact: contact});
        }
    });
}

function read(success, handleErr) {
    db.all('SELECT * FROM contacts ORDER BY id', function(err, row) {
        if(err !== null) {
            // Express handles errors via its next function.
            // It will call the next operation layer (middleware),
            // which is by default one that handles errors.
            handleErr(err);
        } else {
            success(row);
        }
    });
}

function readOne(which, success, handleErr) {
    if(!which) {
        success({
            success: false,
            error: "Fetching one requires a valid contact id to be specified."
        });

        return;
    }

    db.all('SELECT * FROM contacts WHERE id=' + which + ' ORDER BY id', function(err, row) {
        if(err !== null) {
            // Express handles errors via its next function.
            // It will call the next operation layer (middleware),
            // which is by default one that handles errors.
            handleErr(err);
        } else {
            success(row);
        }
    });
}

function update(id, contact, success, handleErr) {
    if(!contact.firstName || !contact.lastName || typeof contact.email === 'undefined' || typeof contact.website === 'undefined' || typeof contact.isFavorite === 'undefined') {
        success({
            success: false,
            error: 'PUT is idempotent please provide a complete contacts object.',
            data: contact
        });

        return;
    }

    var values = 'firstName = "' + contact.firstName + '", ';
    values += 'lastName = "' + contact.lastName + '", ';
    values += 'email =' + (contact.email ? '"' + contact.email + '"' : null) + ', ';
    values += 'website = ' + (contact.website ? '"' + contact.website + '"' : null) + ', ';
    values += 'isFavorite = "' + contact.isFavorite + '"';

    var query = 'UPDATE contacts SET ' + values + ' WHERE id = ' + id;

    db.run(query, function(err) {
        if(err !== null) {
            // Express handles errors via its next function.
            // It will call the next operation layer (middleware),
            // which is by default one that handles errors.
            handleErr(err);
        } else {
            success({success: true, data: contact});
        }
    });
}

function remove(id, success, handleErr) {
    if(!id) {
        success({
            success: false,
            error: "Delete requires a valid contact id to be specified."
        });

        return;
    }

    db.run('DELETE FROM contacts WHERE id = ' + id, function(err) {
        if(err !== null) {
            // Express handles errors via its next function.
            // It will call the next operation layer (middleware),
            // which is by default one that handles errors.
            handleErr(err);
        } else {
            success({success: true});
        }
    });
}

module.exports = {
    create: create,
    read: read,
    readOne: readOne,
    update: update,
    remove: remove
}