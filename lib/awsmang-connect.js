/*
 * awsmang-connect - middleware for exposing awsbox system stats.
 */

var os = require('os');

module.exports = function awsmangConnect(req, res, next) {
  if (req.url === '/wsapi/awsbox_status') {
    res.writeHead(200, {'content-type': 'application/json'});
    return res.end(JSON.stringify(os.cpus()));
  }
  next();
};