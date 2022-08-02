let express = require('express')
let router = express.Router()
let refresh1_no_solution = require('./API/refresh1_no_solution')

router.get('/refresh1_no_solution', refresh1_no_solution.get)

module.exports = router
