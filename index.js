require('dotenv').config()
require('./database')()
var bot = require('./bot')
require(bot)
