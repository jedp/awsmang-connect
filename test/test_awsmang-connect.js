const
vows = require('vows'),
assert = require('assert'),
spawn = require('child_process').spawn,
http = require('http'),
express = require('express'),
awsmang = require('../lib/awsmang-connect');

// vars will be modified when app is created
var
app = undefined,
port = 0;

function getUrl(path, callback) {
  var buf = "";
  http.get({host: 'localhost', port: port, path: path}, function(res) {
    res.on('data', function(chunk) {
      buf += chunk;
    });
    res.on('end', function() {
      return callback(null, {code: res.statusCode, text: buf.toString()});
    });
  }).on('error', function(err) {
    return callback(err);
  });
}

function startApp(callback) {
  app = express.createServer();
  app.configure(function() {
    app.use(app.router);
    app.use(express.errorHandler());
    app.use(awsmang);
  });

  // make sure basic routing still works
  app.get('/ye/flask', function(req, res) {
    res.writeHead(200);
    return res.end("ok");
  });

  // bind to an available port
  app.listen(0, function() {
    port = app.address().port;
    callback(null, port);
  });
}

/*
 * Test that we can
 * - start an express server
 * - using awsmang middleware
 * - route requests as usual
 * - get /wsapi/awsbox_status
 */

vows.describe("awsmang-connect middleware")

.addBatch({
  "The server": {
    topic: function() {
      startApp(this.callback);
    },

    "starts": function(err, port) {
      assert(err === null);
      assert(port > 0);
    }
  }
})

.addBatch({
  "You can get": {
    "application routes. ": {
      topic: function() {
        getUrl('/ye/flask', this.callback);
      },

      "You can get ye flask": function(err, result) {
        assert(err === null);
        assert(result.code === 200);
      }
    },

    "/wsapi/awsbox_status, which returns:": {
      topic: function() {
        getUrl('/wsapi/awsbox_status', this.callback);
      },

      "status 200": function(err, result) {
        assert(err === null);
        assert(result.code === 200);
      },

      "cpu usage": function(err, result) {
        var usage = JSON.parse(result.text);
        assert(usage.length > 0);
        assert(usage[0].times.user > 0);
      }
    }
  }
})

.export(module);