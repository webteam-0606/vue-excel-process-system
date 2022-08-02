let express = require('express')
let router = express.Router()
let refresh1_no_solution = require('./API/refresh1_no_solution')
let refresh2_solution = require('./API/refresh2_solution')

router.get('/refresh1_no_solution', refresh1_no_solution.get)
router.get('/refresh2_solution', refresh2_solution.get)


module.exports = router
