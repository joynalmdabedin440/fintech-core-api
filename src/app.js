const express = require("express")
const cookieParser = require("cookie-parser")



const app = express()
app.use(express.json())
app.use(cookieParser())

/**  
 *require router 
 */
const authRoute = require("../src/routes/auth.routes")
const accountsRoute = require("../src/routes/account.route")
const transactionRoute=require("../src/routes/transaction.route")

/**
 * use router
 */
app.use("/api/auth", authRoute)
app.use('/api/accounts', accountsRoute)
app.use("/api/transaction",transactionRoute)


module.exports = app