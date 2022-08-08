let express = require('express')
let router = express.Router()

let refresh1_no_solution = require('./API/refresh1_no_solution')
let refresh3_solution = require('./API/refresh3_solution')
let refresh4_solution = require('./API/refresh4_solution')

let refresh_no_solution = require('./API/refresh_no_solution')
let brilliance1 = require('./API/brilliance1')
let refresh2 = require('./API/refresh2')
let sheet3 = require('./API/sheet3')

router.get('/refresh1_no_solution', refresh1_no_solution.get)
router.get('/refresh3_solution', refresh3_solution.get)
router.get('/refresh4_solution', refresh4_solution.get)

router.get('/refresh_no_solution', refresh_no_solution.get)
router.get('/brilliance1', brilliance1.get)
router.get('/refresh2', refresh2.get)
router.get('/sheet3', sheet3.get)

module.exports = router
