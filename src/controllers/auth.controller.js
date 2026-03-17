
const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken');

/** 
 * - user register controller
 * - POST/api/auth/register
 */
async function registerUserController(req,res) {
    
    const { email, name, password } = req.body 

    const isUserAlreadyExist = await userModel.findOne({ email: email })
    
    if (isUserAlreadyExist) {
        return res.status(422).json({
            msg: "User Already Exist",
            status:"Failed"
        })
    }

    const user = await userModel.create({
        email,name, password
    })

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "3d" })
    
    res.cookie("token", token)
    
    res.status(201).json({
        msg: "User Register Successfully",
        status: "Success",
        user: {
            userId: user._id,
            email: user.email,
            name: user.name 
        },
        token
    })


    
    
}


module.exports={registerUserController}