/**
 * ProjetController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  create: function(req, res){
    var params = {}
    if(req.param('nom'))
      params.nom= req.param('nom');
    if(req.param('description'))
      params.description= req.param('description');
    if(req.param('debut'))
      params.debut= req.param('debut');
    if(req.param('fin'))
      params.fin= req.param('fin');
    if(req.param('nbMembres'))
      params.fin= req.param('nbMembres');

    Projet.create(params).exec(function(err, resource){
      if(err){
        res.send({error : err}, 500)
      } else if(resource){
        res.send(resource, 200);
      } else {
        res.send({error : res.i18n('MESS_ERR_NOT_FOUND')},404)
      }
    })
  },


  edit: function(req, res){
    var params = {}
    if(req.param('nom'))
      params.nom= req.param('nom');
    if(req.param('description'))
      params.description= req.param('description');
    if(req.param('debut'))
      params.debut= req.param('debut');
    if(req.param('fin'))
      params.fin= req.param('fin');
    if(req.param('nbMembres'))
      params.fin= req.param('nbMembres');

    Projet.update({id : req.params.id}, params).exec(function(err, resource){
      if(err){
        res.send({error : err}, 500)
      } else if(resource[0]){
        res.send(resource[0], 200);
      } else {
        res.send({error : res.i18n('MESS_ERR_NOT_FOUND')},404)
      }
    })
  },

  get: function(req, res){
    Projet.findOne(req.params.id).exec(function(err, resource){
      if(err){
        res.send({error : err}, 500)
      } else if(resource){
        res.send(resource, 200)
      } else {
        res.send({error : res.i18n('MESS_ERR_NOT_FOUND')},404)
      }
    })
  },

  query: function(req, res){
    Projet.find().exec(function(err, resources){
      if(err){
        res.send({error : err}, 500)
      } else if(resources){
        res.send(resources, 200)
      } else {
        res.send({error : res.i18n('MESS_ERR_NOT_FOUND')},404)
      }
    })
  },

  delete: function(req, res){
    Projet.findOne(req.params.id).exec(function(err, resource){
      if(err){
        res.send({error : err}, 500)
      } else if(resource){
        resource.destroy(function(err){
          if(err){
            res.send({error : err}, 500)
          } else {
            res.send(resource, 200)
          }
        })
      } else {
        res.send({error : res.i18n('MESS_ERR_NOT_FOUND')},404)
      }
    })
  }


};
