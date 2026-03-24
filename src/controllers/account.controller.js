const accountModel = require("../models/account.model")

async function createAccountController(req,res) {
    
    const account = await accountModel.create({
        user: req.user.id
    })

    res.status(201).json({
        msg: "Accounts Create successfully",
        account: account,
        status:"success"
        
    })
}

module.exports = { createAccountController }