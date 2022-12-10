// const express = require('express');
// const rateLimit = require("express-rate-limit");
// const bodyParser = require('body-parser');
// const packageInfo = require('./package.json');

// const limiter = rateLimit({
//   windowMs: 1 * 1000, // 1 second
//   max: 25 // limit each IP to 100 requests per windowMs
// });

// const app = express();
// app.use(bodyParser.json());
// app.set('trust proxy', 1);
// app.use(limiter);

// app.get('/', function (req, res) {
//   res.json({ version: packageInfo.version });
// });

// var server = app.listen(process.env.PORT, "0.0.0.0", () => {
//   const host = server.address().address;
//   const port = server.address().port;
//   console.log('Web server started at http://%s:%s', host, port);
// });

// module.exports = (bot) => {
//   app.post('/' + bot.token, (req, res) => {
//     bot.processUpdate(req.body);
//     res.sendStatus(200);
//   });
// };
