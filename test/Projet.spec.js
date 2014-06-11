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

 Remplacer :  - 'Projet' par le nom du modèle
 - 'attr1' par les attributs à tester
 - '/projet' par la route de la ressource
 - '/projet/' par la route de la resource

 */


function checkResponse(res){
  assert(res.statusCode==200);
  res.body.should.have.property('nom')
  res.body.should.have.property('description')
  res.body.should.have.property('debut')
  res.body.should.have.property('fin')
  res.body.should.have.property('nbMembres')
}

function isEqual(a,b){
  console.log(JSON.parse(JSON.stringify(a)))
  console.log(JSON.parse(JSON.stringify(b)))
  return (_.isEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b))));
}

describe('Projet Controller', function() {

  var d = new Date(2014,11,20);
  var d2 = new Date(2014,11,23);

  var d3 = new Date(2014,10,22);
  var d4 = new Date(2014,11,25);

  var resource = {
    nom: 'test',
    description: 'test',
    debut: d.toISOString(),
    fin : d2.toISOString(),
    nbMembres: 4
  };

  var modificatedProjet = {
    nom: 'test2',
    description: 'test2',
    debut: d3.toISOString(),
    fin : d4.toISOString(),
    nbMembres: 6
  };

  var competence = {
    nom: 'anglais',
    niveau: 20,
    type: 'langue'
  };

  describe('create()', function () {
    before(function (done) {
      done();
    });

    it('should create a new Projet', function (done) {
      // use the sails global object app or pass in the one from the setup

      request(app.ws.server)
        .post('/projet')
        .send(resource)
        .end(function (err, res) {
          checkResponse(res);
          Projet.findOne(res.body.id).exec(function(err, resource){
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
     .post('/projet')
     .end(function (err, res) {
     assert(res.statusCode==res.body.status)
     assert(res.body.error=='E_VALIDATION')
     done()
     });
     });*/

    after(function (done) {
      Projet.destroy().exec(function (err,resource) {
        done()
      })

    });
  })

  describe('query()', function(){
    before(function(done){
      Projet.create(resource).exec(function(err, resource){
        Projet.create(modificatedProjet).exec(function(err, resource){
          done()
        })
      });
    });

    it('should retrieve every resources', function(done){
      request(app.ws.server)
        .get('/projet')
        .end(function (err, res) {
          assert(res.statusCode==200);

          for(var i=0; i<res.body.length; i++){
            //NOTE: Checker que toutes les propriétés soient présentes
            res.body[i].should.have.property('nom')
            res.body[i].should.have.property('description')
            res.body[i].should.have.property('debut')
            res.body[i].should.have.property('fin')
            res.body[i].should.have.property('nbMembres')
          }

          assert(res.body.length==2);

          var res1 = res.body[0];
          //NOTE: Supprimer les collections du modèle
          delete res1.id
          delete res1.competences
          assert(isEqual(res1,resource));

          //NOTE: Supprimer les collections du modèle
          var res2 = res.body[1]
          delete res2.id
          delete res2.competences
          assert(isEqual(res2, modificatedProjet));
          done()
        });
    })

    it('should retrieve an empty array', function(done){
      Projet.destroy().exec(function(err, resources){
        request(app.ws.server)
          .get('/projet')
          .end(function (err, res) {
            res.body.should.be.ok
            assert(res.body.length==0)
            done()
          })
      })
    })

    after(function(done){
      Projet.destroy().exec(function (err, resource) {
        done();
      })
    })
  });

  describe('get()', function(done){
    var id;

    before(function(done){
      Projet.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    })

    after(function(done){
      Projet.destroy().exec(function(err, resources){
        done();
      })
    })

    it('should retrieve a resource', function(done){
      request(app.ws.server)
        .get('/projet/' + id)
        .end(function (err, res) {
          checkResponse(res);
          var resp = res.body
          //NOTE: Supprimer les collections du modèle
          delete resp.id;
          delete resp.competences
          assert(isEqual(resp,resource));
          done()
        })
    })

    it('should return not found error', function(done){
      request(app.ws.server)
        .get('/projet/123')
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
      Projet.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    });

    after(function(done){
      Projet.destroy().exec(function(err, resources){
        done();
      })
    });

    it('should edit a resource properly', function(done){
      request(app.ws.server)
        .put('/projet/' + id)
        .send(modificatedProjet)
        .end(function (err, res) {
          checkResponse(res);
          //  console.log(_.isEqual(JSON.stringify(resp), JSON.stringify(modificatedProjet)));
          Projet.findOne(id).exec(function(err, resource){
            //NOTE: Supprimer les collections du modèle
            delete resource.updatedAt;
            delete resource.createdAt;
            delete resource.id;

            delete modificatedProjet.updatedAt;
            delete modificatedProjet.createdAt;
            assert(isEqual(resource, modificatedProjet));

            done();
          })
        })
    })

    it('should return not found error', function(done){
      request(app.ws.server)
        .put('/projet/zea' )
        .send({nom: "modifié"})
        .end(function (err, res) {
          assert(res.statusCode==404);
          assert(res.body.error==msg.MESS_ERR_NOT_FOUND);
          done()
        })
    })

    it('should return unmodificated resource', function(done){
      request(app.ws.server)
        .put('/projet/'+ id )
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
      Projet.create(resource).exec(function(err, resource){
        id = resource.id;
        done()
      })
    })

    after(function(done){
      Projet.destroy().exec(function(err, resource){
        done()
      })
    })

    it('should delete a resource', function(done){
      request(app.ws.server)
        .delete('/projet/'+ id )
        .end(function (err, res) {
          console.log(res.body)
          // checkResponse(res);
          Projet.findOne(id).exec(function(err, resource){
            assert(resource==undefined)
            done()
          })
        })
    })
  })


  describe('addCompetence()', function(){
    var id;

    before(function(done){
      Projet.create(resource).exec(function(err, resource){
        id = resource.id;
        done()
      })
    });

    after(function(done){
      Projet.destroy().exec(function(err, resource){
        Competence.destroy().exec(function(err, resource){
          done()
        })
      })
    });

    it('should add a competence', function(done){
      request(app.ws.server)
        .post('/projet/'+ id + '/competences')
        .send(competence)
        .end(function (err, res) {
          Projet.findOne(id).populate('competences').exec(function(err, resource){
            console.log(resource.competences)
            assert(resource.competences.length==1);
            delete resource.competences[0].createdAt;
            delete resource.competences[0].updatedAt;
            isEqual(resource.competences[0], competence);
            done()
          });
        })
    })
  })

  describe('removeCompetence()', function(){
    var id;

    before(function(done){
      Projet.create(resource).exec(function(err, resource){
        id = resource.id;
        done()
      })
    });

    after(function(done){
      Projet.destroy().exec(function(err, resource){
        Competence.destroy().exec(function(err, resource){
          done()
        })
      })
    });

    it('should remove a competence', function(done){
      request(app.ws.server)
        .post('/projet/'+ id + '/competences')
        .send(competence)
        .end(function (err, res) {
          Projet.findOne(id).populate('competences').exec(function(err, resource){
            assert(resource.competences.length==1);
            var comp_id = resource.competences[0].id
            request(app.ws.server)
              .delete('/projet/'+ id + '/competences/' + comp_id)
              .end(function (err, res) {
                Projet.findOne(id).populate('competences').exec(function(err, resource){
                  console.log(resource.competences)
                  assert(resource.competences.length==0);
                  done()
                });
              })
          });
        })
    })
  })



})
