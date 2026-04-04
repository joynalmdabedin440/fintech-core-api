const transactionModel = require("../models/transaction.model")

async function transactionController(req,res) {
    const { fromAccount, toAccount, status, amount, idempotencyKey } = req.body
    

    try {
        const transaction = await transactionModel.createTransaction(fromAccount, toAccount, amount, idempotencyKey)

        
       

      
        


    } catch (error) {
        
        res.status(500).json({ error: error.message })
    }
}