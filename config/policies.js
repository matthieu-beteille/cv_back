module.exports.policies = {
  '*' : 'CORS',

  CompetenceController:{
    "create" : ['isAuthorized', 'CORS'],
    "edit" : ['isAuthorized', 'CORS'],
    "delete": ['isAuthorized', 'CORS']
  },

  ProjetController:{
    "create" : ['isAuthorized', 'CORS'],
    "edit" : ['isAuthorized', 'CORS'],
    "delete": ['isAuthorized', 'CORS'],
    "addCompetence" : ['isAuthorized', 'CORS'],
    "removeCompetence" : ['isAuthorized', 'CORS']
  },

  XPController:{
    "create" : ['isAuthorized', 'CORS'],
    "edit" : ['isAuthorized', 'CORS'],
    "delete": ['isAuthorized', 'CORS'],
    "addProject" : ['isAuthorized', 'CORS']
  }

  /*'*': ['isAuthorized', 'CORS'],


  UserController: {
    "create": 'CORS'
    },

  AuthController: {
    '*': 'CORS'
  },

  EvenementController: {
    'addParticipant': 'CORS'
  },

  ObservateurController: {
    'addObservateur': 'CORS',
    'addParticipant' : 'CORS',
    'getObservateur' : 'CORS'
  },

  CompteController: {
    '*': 'CORS'
  }*/

}
