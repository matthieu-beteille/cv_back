/**
 * isCORS
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 *
 */
/**
 * Handle CORS if coming from http://192.168.2.192:3000 add Headers
 */
module.exports = function (req, res, next) {
  if(req.param('token')=='test'){
   return next();
  } else {
    res.send('UNALLOWED : niahahah')
  };
};
