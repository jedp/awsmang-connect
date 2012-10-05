#awsmang-connect: middleware for reporting usage stats for awsbox apps

Work in progress. Please jump in!

Middleware to expose the url `/wsapi/awsbox_status`, which reports:
- cpu usage

##Usage

1. In your server, `awsmang = require('awsmang')`
2. In your app config, `app.use(awsmang)`
3. `GET /wsapi/awsbox_status` on your app

##To do

- report awsbox errors from logs




