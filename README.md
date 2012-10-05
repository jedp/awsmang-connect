#awsmang-connect 

Middleware for reporting usage stats for awsbox apps.

Work in progress. Please jump in!

##Usage

1. In your server, `awsmang = require('awsmang')`
2. In your app config, `app.use(awsmang)`
3. `GET /wsapi/awsbox_status` on your app

Returns a json structure that includes `os.cpus()` output.

##To do

- report awsbox errors from logs




