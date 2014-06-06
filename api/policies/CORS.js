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

  /*if(req.get('origin')=="http://192.168.2.192:3000"  || req.get('origin')=="http://192.168.2.192:3000/" || req.get('origin')=="http://192.168.2.146:3000/"|| req.get('origin')=="http://192.168.2.146:3000" || req.get('origin')=="http://localhost:3000" || req.get('origin')=="http://localhost:3000/"){
    res.header('Access-Control-Allow-Credentials', 'true')
    res.header('Access-Control-Allow-Origin', req.get('origin'))
  }*/

  //TOUTE LE MONDE EST AUTORISE
  res.header('Access-Control-Allow-Credentials', 'true');
  res.header('Access-Control-Allow-Origin', req.get('origin'));

 return next();
};
