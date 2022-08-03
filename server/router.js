let express = require('express')
let router = express.Router()
let refresh1_no_solution = require('./API/refresh1_no_solution')
let refresh3_solution = require('./API/refresh3_solution')
// let refresh2_no_solution = require('./API/refresh2_no_solution')
let refresh4_solution = require('./API/refresh4_solution')

router.get('/refresh1_no_solution', refresh1_no_solution.get)
router.get('/refresh3_solution', refresh3_solution.get)
// router.get('/refresh2_no_solution', refresh2_no_solution.get)
router.get('/refresh4_solution', refresh4_solution.get)


module.exports = router
