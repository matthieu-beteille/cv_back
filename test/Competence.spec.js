/**
 * Created by matthieu on 4/28/14.
 */

/**
 * Created by matthieu on 24/04/14.
 */

var app = require('./index.js');
var msg = require("../config/locales/en.json");
var request = require('supertest');
var assert = require('assert');
var should = require('should');
var _ = require("underscore");

/*

 Remplacer :  - 'Competence' par le nom du modèle
 - 'attr1' par les attributs à tester
 - '/competence' par la route de la ressource
 - '/competence/' par la route de la resource

 */


function checkResponse(res){
  assert(res.statusCode==200);
  res.body.should.have.property('nom')
  res.body.should.have.property('niveau')
  res.body.should.have.property('type')
}

function isEqual(a,b){
  console.log(JSON.parse(JSON.stringify(a)))
  console.log(JSON.parse(JSON.stringify(b)))
  return (_.isEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b))));
}

describe('Competence Controller', function() {


  var resource = {
    nom: 'anglais',
    niveau: 20,
    type: 'langue'
  };

  var modificatedCompetence = {
    nom: 'javascript',
    niveau: 80,
    type: 'informatique'
  };

  describe('create()', function () {
    before(function (done) {
      done();
    });

    it('should create a new Competence', function (done) {
      // use the sails global object app or pass in the one from the setup

      request(app.ws.server)
        .post('/competence')
        .send(resource)
        .end(function (err, res) {
          checkResponse(res);
          Competence.findOne(res.body.id).exec(function(err, resource){
            delete resource.createdAt;
            delete resource.updatedAt;
            //NOTE: SI il y a des collections sur le modèle les supprimées de la resource ici car elles ne figureront pas dans la reponse
            delete resource.id;
            assert( isEqual(resource, resource));
            done();
          })
        });
    });

    /* Si validation sur certains  customiser a la main

     it('should return E_VALIDATION error', function(done){
     request(app.ws.server)
     .post('/competence')
     .end(function (err, res) {
     assert(res.statusCode==res.body.status)
     assert(res.body.error=='E_VALIDATION')
     done()
     });
     });*/

    after(function (done) {
      Competence.destroy().exec(function (err,resource) {
        done()
      })

    });
  })

  describe('query()', function(){
    before(function(done){
      Competence.create(resource).exec(function(err, resource){
        Competence.create(modificatedCompetence).exec(function(err, resource){
          done()
        })
      });
    });

    it('should retrieve every resources', function(done){
      request(app.ws.server)
        .get('/competence')
        .end(function (err, res) {
          assert(res.statusCode==200);

          for(var i=0; i<res.body.length; i++){
            //NOTE: Checker que toutes les propriétés soient présentes
            res.body[i].should.have.property('nom')
            res.body[i].should.have.property('niveau')
            res.body[i].should.have.property('type')
          }

          assert(res.body.length==2);

          var res1 = res.body[0];
          //NOTE: Supprimer les collections du modèle
          delete res1.id
          assert(isEqual(res1,resource));

          //NOTE: Supprimer les collections du modèle
          var res2 = res.body[1]
          delete res2.id
          assert(isEqual(res2, modificatedCompetence));
          done()
        });
    })

    it('should retrieve an empty array', function(done){
      Competence.destroy().exec(function(err, resources){
        request(app.ws.server)
          .get('/competence')
          .end(function (err, res) {
            res.body.should.be.ok
            assert(res.body.length==0)
            done()
          })
      })
    })

    after(function(done){
      Competence.destroy().exec(function (err, resource) {
        done();
      })
    })
  });

  describe('get()', function(done){
    var id;

    before(function(done){
      Competence.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    })

    after(function(done){
      Competence.destroy().exec(function(err, resources){
        done();
      })
    })

    it('should retrieve a resource', function(done){
      request(app.ws.server)
        .get('/competence/' + id)
        .end(function (err, res) {
          checkResponse(res);
          var resp = res.body
          //NOTE: Supprimer les collections du modèle
          delete resp.id;

          assert(isEqual(resp,resource));
          done()
        })
    })

    it('should return not found error', function(done){
      request(app.ws.server)
        .get('/competence/123')
        .end(function (err, res) {
          assert(res.statusCode==404)
          res.error.should.be.ok
          assert(res.body.error==msg.MESS_ERR_NOT_FOUND)
          done();
        })
    })
  })

  describe('edit()', function(){
    var id;

    before(function(done){
      Competence.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    });

    after(function(done){
      Competence.destroy().exec(function(err, resources){
        done();
      })
    });

    it('should edit a resource properly', function(done){
      request(app.ws.server)
        .put('/competence/' + id)
        .send(modificatedCompetence)
        .end(function (err, res) {
          checkResponse(res);
          //  console.log(_.isEqual(JSON.stringify(resp), JSON.stringify(modificatedCompetence)));
          Competence.findOne(id).exec(function(err, resource){
            //NOTE: Supprimer les collections du modèle
            delete resource.updatedAt;
            delete resource.createdAt;
            delete resource.id;

            delete modificatedCompetence.updatedAt;
            delete modificatedCompetence.createdAt;
            assert(isEqual(resource, modificatedCompetence));

            done();
          })
        })
    })

    it('should return not found error', function(done){
      request(app.ws.server)
        .put('/competence/zea' )
        .send({nom: "modifié"})
        .end(function (err, res) {
          assert(res.statusCode==404);
          assert(res.body.error==msg.MESS_ERR_NOT_FOUND);
          done()
        })
    })

    it('should return unmodificated resource', function(done){
      request(app.ws.server)
        .put('/competence/'+ id )
        .end(function (err, res) {
          assert(res.statusCode==200);
          checkResponse(res);
          done()
        })
    })
  });

  describe('delete()', function(){
    var id;

    before(function(done){
      Competence.create({attr1: 'test'}).exec(function(err, resource){
        id = resource.id;
        done()
      })
    })

    after(function(done){
      Competence.destroy().exec(function(err, resource){
        done()
      })
    })

    it('should delete a resource', function(done){
      request(app.ws.server)
        .delete('/competence/'+ id )
        .end(function (err, res) {
          console.log(res.body)
          // checkResponse(res);
          Competence.findOne(id).exec(function(err, resource){
            assert(resource==undefined)
            done()
          })
        })
    })
  })


})
