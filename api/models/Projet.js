/**
 * Projet.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
      nom : 'string',
      description : 'string',
      debut: 'date',
      fin : 'date',
      nbMembres : 'integer',
      xp : {  model : 'XP'},
      competences : { collection : 'Competence',
                      via : 'projets' },

      createCompetence: function(params, cb){
        var self=this;
        Competence.create(params).exec(function(err, comp){
          if(err){
            cb(err)
          } else {
            self.competences.add(comp.id);
            self.save(function(err,proj){
              cb(err, self);
            })
          }
        })
      }
	}

};
