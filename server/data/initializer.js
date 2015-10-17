var sqlite3 = require('sqlite3').verbose();
var db      = new sqlite3.Database('./server/data/workshop.db');
var fs      = require('fs');
var obj     = JSON.parse(fs.readFileSync('./server/data/contacts.json', 'utf8'));

function check(tableName) {
    db.get('SELECT name FROM sqlite_master WHERE type="table" AND name="contacts"',
        function (err, rows) {
            if (err !== null) {
                console.warn(err);
            } else if (rows === undefined) {
                db.run('CREATE TABLE "contacts" ' +
                    '("id" INTEGER PRIMARY KEY AUTOINCREMENT, ' +
                    '"firstName" VARCHAR(255), ' +
                    '"lastName" VARCHAR(255), ' +
                    '"email" VARCHAR(255), ' +
                    '"website" VARCHAR(255), ' +
                    '"isFavorite" BOOLEAN)', function (err) {
                        if (err !== null) {
                            console.warn(err);
                        } else {
                            console.log('SQL Table "contacts" initialized.');
                            populate();
                        }
                    });
            } else {
                console.log('SQL Table "contacts" already initialized.');
            }
        });
}

function populate() {
    for (var i = 0; i < obj.length; i++) {
        obj[i].firstName = '"' + obj[i].firstName + '"';
        obj[i].lastName  = '"' + obj[i].lastName + '"';
        obj[i].email     = obj[i].email !== null ? '"' + obj[i].email + '"' : obj[i].email;
        obj[i].website   = obj[i].website !== null ? '"' + obj[i].website + '"' : obj[i].website;

        db.run(
            'INSERT INTO contacts ' +
                '(firstName, lastName, email, website, isFavorite) ' +
                'VALUES' +
                '(' + obj[i].firstName + ', ' + obj[i].lastName + ', ' + obj[i].email + ', ' + obj[i].website + ', "' + obj[i].isFavorite + '")'
        ), function(err) {
            if (err !== null) {
                console.warn(err, obj[i]);
            } else {
                console.log('Row inserted into table "contacts".', obj[i]);
            }
        };
    }
}

check();