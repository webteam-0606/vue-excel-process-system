let express = require('express')
let router = express.Router()

let refresh1_no_solution = require('./API/refresh1_no_solution')
let refresh3_solution = require('./API/refresh3_solution')
let refresh4_solution = require('./API/refresh4_solution')
let refresh_no_solution = require('./API/refresh_no_solution')
let sheet1 = require('./API/sheet1')
let sheet2 = require('./API/sheet2')
let sheet3 = require('./API/sheet3')

router.get('/refresh1_no_solution', refresh1_no_solution.get)
router.get('/refresh3_solution', refresh3_solution.get)
router.get('/refresh4_solution', refresh4_solution.get)
router.get('/refresh_no_solution', refresh_no_solution.get)
router.get('/sheet1', sheet1.get)
router.get('/sheet2', sheet2.get)
router.get('/sheet3', sheet3.get)

module.exports = router
