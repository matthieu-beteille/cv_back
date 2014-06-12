/**
 * Competence.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {
    nom : 'string',
    niveau : 'integer',
    type: {      type : 'string',
      in: ['langue', 'informatique']
    },
    projets : { collection: 'Projet',
                via : 'competences'}
	}

};
