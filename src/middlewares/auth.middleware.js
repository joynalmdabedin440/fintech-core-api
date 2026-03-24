const jwt = require("jsonwebtoken")
const userModel = require("../models/user.model")

async function authMiddleWare(req, res, next) {
    
    const token = req.cookies.token 

    if (!token) {
        return res.status(401).json({
            msg:"Unauthorized user"
        })
    }

    try {
        const decoded = await jwt.verify(token,process.env.JWT_SECRET)
        const user = await userModel.findOne({
            id:decoded.id
        },)

        req.user = user
        
        return next()
    } catch (error) {
        return res.status(401).json({
            msg:"Invalid user token"
        })
    }


    
}

module.exports={authMiddleWare}