
var app = require('./index.js');
var msg = require("../config/locales/en.json");
var request = require('supertest');
var assert = require('assert');
var should = require('should');
var _ = require("underscore");

/*

 Remplacer :  - 'XP' par le nom du modèle
 - 'attr1' par les attributs à tester
 - '/xp' par la route de la ressource
 - '/xp/' par la route de la resource

 */


function checkResponse(res){
  assert(res.statusCode==200);
  res.body.should.have.property("nom");
  res.body.should.have.property("description");
  res.body.should.have.property("lieu");
  res.body.should.have.property("debut");
  res.body.should.have.property("fin");
  res.body.should.have.property("type");
}

function isEqual(a,b){
  console.log(JSON.parse(JSON.stringify(a)));
  console.log(JSON.parse(JSON.stringify(b)));
  return (_.isEqual(JSON.parse(JSON.stringify(a)),JSON.parse(JSON.stringify(b))));
}

describe('XP Controller', function() {

  var d = new Date(2014,2,10);
  var d2 = new Date(2014,7,10);

  var d3 = new Date(2014,11,20);
  var d4 = new Date(2014,11,23);

  var resource = {
    nom: 'Stage de fin d\'études',
    lieu: 'Infotel',
    description: 'Réalisation d\'une applicaiton multiplateformes',
    debut: d.toISOString(),
    fin: d2.toISOString(),
    type: 'formation'
  };

  var modificatedXP = {
    nom: 'Stage de fin d\'études | modifié',
    lieu: 'Infotel | modifié',
    description: 'Réalisation d\'une applicaiton multiplateformes | modifié',
    debut: d3.toISOString(),
    fin: d4.toISOString(),
    type: 'pro'
  };

  var invalidXP = {
    nom: 'Stage de fin d\'études | modifié',
    lieu: 'Infotel | modifié',
    description: 'Réalisation d\'une applicaiton multiplateformes | modifié',
    debut: d3.toISOString(),
    fin: d4.toISOString(),
    type: 'proaezaz'
  };

  var project = {
    nom: 'projet1',
    description: 'Réalisation d\'une applicaiton multiplateformes',
    debut: d3.toISOString(),
    fin: d4.toISOString(),
    nbMembres: 3
    }


  describe('create()', function () {
    before(function (done) {
      done();
    });

    it('should create a new XP', function (done) {
      // use the sails global object app or pass in the one from the setup

      request(app.ws.server)
        .post('/xp')
        .send(resource)
        .end(function (err, res) {
          checkResponse(res);
          XP.findOne(res.body.id).exec(function(err, resource){
            delete resource.createdAt;
            delete resource.updatedAt;
            //NOTE: SI il y a des collections sur le modèle les supprimées de la resource ici car elles ne figureront pas dans la reponse
            delete resource.id;
            assert( isEqual(resource, resource));
            done();
          })
        });
    });

     it('should return E_VALIDATION error', function(done){
     request(app.ws.server)
     .post('/xp')
     .send(invalidXP)
     .end(function (err, res) {
         console.log(res.body)
     assert(res.statusCode==500)
     assert(res.body.error.error=='E_VALIDATION')
       done()
     });
     });

    after(function (done) {
      XP.destroy().exec(function (err,resource) {
        done()
      })

    });
  })

  describe('query()', function(){
    before(function(done){
      XP.create(resource).exec(function(err, resource){
        XP.create(modificatedXP).exec(function(err, resource){
          done()
        })
      });
    });

    it('should retrieve every resources', function(done){
      request(app.ws.server)
        .get('/xp')
        .end(function (err, res) {
          assert(res.statusCode==200);

          for(var i=0; i<res.body.length; i++){
            //NOTE: Checker que toutes les propriétés soient présentes
            res.body[i].should.have.property('nom')
            res.body[i].should.have.property('debut')
            res.body[i].should.have.property('description')
            res.body[i].should.have.property('fin')
            res.body[i].should.have.property('lieu')
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
          assert(isEqual(res2, modificatedXP));
          done()
        });
    })

    it('should retrieve an empty array', function(done){
      XP.destroy().exec(function(err, resources){
        request(app.ws.server)
          .get('/xp')
          .end(function (err, res) {
            res.body.should.be.ok;
            assert(res.body.length==0);
            done()
          })
      })
    })

    after(function(done){
      XP.destroy().exec(function (err, resource) {
        done();
      })
    })
  });

  describe('get()', function(done){
    var id;

    before(function(done){
      XP.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    })

    after(function(done){
      XP.destroy().exec(function(err, resources){
        done();
      })
    })

    it('should retrieve a resource', function(done){
      request(app.ws.server)
        .get('/xp/' + id)
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
        .get('/xp/123')
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
      XP.create(resource).exec(function(err, resource){
        id = resource.id;
        done();
      })
    });

    after(function(done){
      XP.destroy().exec(function(err, resources){
        done();
      })
    });

    it('should edit a resource properly', function(done){
      request(app.ws.server)
        .put('/xp/' + id)
        .send(modificatedXP)
        .end(function (err, res) {
          checkResponse(res);
          //  console.log(_.isEqual(JSON.stringify(resp), JSON.stringify(modificatedXP)));
          XP.findOne(id).exec(function(err, resource){
            //NOTE: Supprimer les collections du modèle
            delete resource.updatedAt;
            delete resource.createdAt;
            delete resource.id;

            delete modificatedXP.updatedAt;
            delete modificatedXP.createdAt;
            assert(isEqual(resource, modificatedXP));

            done();
          })
        })
    });

    it('should return not found error', function(done){
      request(app.ws.server)
        .put('/xp/zea' )
        .send({nom: "modifié"})
        .end(function (err, res) {
          assert(res.statusCode==404);
          assert(res.body.error==msg.MESS_ERR_NOT_FOUND);
          done()
        })
    })

    it('should return unmodificated resource', function(done){
      request(app.ws.server)
        .put('/xp/'+ id )
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
      XP.create(resource).exec(function(err, resource){
        id = resource.id;
        done()
      })
    })

    after(function(done){
      XP.destroy().exec(function(err, resource){
        done()
      })
    })

    it('should delete a resource', function(done){
      request(app.ws.server)
        .delete('/xp/'+ id )
        .end(function (err, res) {
          console.log(res.body)
          // checkResponse(res);
          XP.findOne(id).exec(function(err, resource){
            assert(resource==undefined)
            done()
          })
        })
    })
  })

  describe('addProject()', function(){
    var id;

    before(function(done){
      XP.create(resource).exec(function(err, resource){
        id = resource.id;
        done()
      })
    });

    after(function(done){
      XP.destroy().exec(function(err, resource){
        done()
      })
    });

    it('should add a project', function(done){
      request(app.ws.server)
        .post('/xp/'+ id + '/projets' )
        .send(project)
        .end(function (err, res) {
          console.log(res.body);
          // checkResponse(res);
          Projet.findOne({xp : id}).exec(function(err, resource){
            assert(resource.xp==id);
            delete resource.createdAt;
            delete resource.updatedAt;
            isEqual(resource, project);
            done()
          })
        })
    })
  })


})