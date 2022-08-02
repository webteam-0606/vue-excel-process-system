let express = require('express')
let router = express.Router()
let refresh1 = require('./API/refresh1')

router.get('/refresh1', refresh1.get)

module.exports = router
