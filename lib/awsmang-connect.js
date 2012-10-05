/*
 * awsmang-connect - middleware for exposing awsbox system stats.
 */

var os = require('os');

module.exports = function awsmangConnect(req, res, next) {
  if (req.url === '/wsapi/awsbox_status') {
    // collect cpu usage and add sum up the total number of ticks
    // used by each cpu so the client can make more sense of the
    // numbers.
    var cpus = os.cpus();
    var i, j, total;
    var keys;

    for (i=0; i<cpus.length; i++) {
      total = 0;
      keys = Object.keys(cpus[i].times);
      for (j=0; j<keys.length; j++) {
        total += cpus[i].times[keys[j]];
      }
      cpus[i].total_time = total;
    }

    res.writeHead(200, {'content-type': 'application/json'});
    return res.end(JSON.stringify(cpus));
  }
  next();
};