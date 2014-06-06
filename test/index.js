// Require app factory
var Sails = require('sails/lib/app');
var MongoClient = require('mongodb').MongoClient;

// Instantiate the Sails app instance we'll be using
// (note that we don't use `new`, just call it like a function)
var app = Sails();

module.exports = app;

before(function(done) {

    MongoClient.connect("mongodb://localhost:27017/sails-test", function(err, db) {
        if(!err) {
            db.dropDatabase(function(err, don){
                db.close();
                //done()
                app.lift({
                    log: {
                        level: 'error'
                    },
                    adapters: {
                        default: 'test'
                    }

                }, done);
            });
        }
    });
    // Lift Sails and store the app reference

});


// After Function
after(function(done) {
    app.lower(done);

});


/*var assert = require('assert');
var request = require('supertest');


/*describe('Compte creation', function() {

    it ('should create a compte', function(done) {
        // All apples
        Compte.create({username:"qsAAaAaaa", password:"aqsqsq", role:"organisateur"},function(err,cpt){
            if (err)
                return done(err);

            assert.notEqual(cpt, undefined);
            done();
        });

    });
});*/

/*describe('evebt creatiozzn', function() {
    it("Should be able to create a event", function (done) {
        Evenement.create({nom: "Marsezzille"}, function (err, user) {
            if (err)
                return done(err);

            assert.notEqual(user, undefined);
            done();
        });
    });
});

describe('Compte creation', function() {

    it ('should create a compte', function() {
 // All apples
     Compte.findOne({username:"aaa"}, function(err, compte) {
         console.log(compte)
        //assert(compte, 'There must be something!');
     });
    });
 });*/
