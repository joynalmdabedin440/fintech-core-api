const express = require("express")
const cookieParser = require("cookie-parser")



const app = express()
app.use(express.json())
app.use(cookieParser())

/**  
 *require router 
 */
const authRouter = require("../src/routes/auth.routes")
const accountsRouter = require("../src/routes/account.route")

/**
 * use router
 */
app.use("/api/auth", authRouter)
app.use('/api/accounts', accountsRouter)


module.exports = app