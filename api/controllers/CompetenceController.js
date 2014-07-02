/**
 * CompetenceController.js
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {
  create: function(req, res){
    var params = {};
    if(req.param('nom'))
      params.nom= req.param('nom');
    if(req.param('niveau'))
      params.niveau= req.param('niveau');
    if(req.param('type'))
      params.type= req.param('type');

    Competence.create(params).exec(function(err, resource){
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
    if(req.param('niveau'))
      params.niveau= req.param('niveau');
    if(req.param('type'))
      params.type= req.param('type');

    Competence.update({id : req.params.id}, params).exec(function(err, resource){
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
    Competence.findOne(req.params.id).exec(function(err, resource){
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
    Competence.find().exec(function(err, resources){
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
    Competence.findOne(req.params.id).exec(function(err, resource){
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
