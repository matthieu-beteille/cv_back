/**
 * XP.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
    nom : 'string',
    description : 'string',
    lieu : 'string',
    debut: 'date',
    fin : 'date',
    type : {
      type : 'string',
      in: ['formation', 'pro']
    }, // 'formation' ou 'pro'
    projets : {collection: 'Projet',
               via : 'xp'},

    createProject: function(params, cb){
      var self=this;
      params.xp = this.id
      Projet.create(params).exec(function(err, projet){
        if(err){
          cb(err)
        } else {
          self.projets.add(projet.id);
          self.save(function(err,xp){
            cb(err, self);
          })
        }
      })
    }
  }

};
