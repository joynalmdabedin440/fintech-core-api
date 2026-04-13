
const userModel = require("../models/user.model")
const jwt = require('jsonwebtoken');
const emailService= require("../services/mail.services")


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

    await emailService.registrationEmail(user.email,user.name)


    
    
}


/** 
 * - user login controller
 * - POST/api/auth/login
 */
async function loginUserController(req, res) {
    const { email, password } = req.body
    
    const user = await userModel.findOne({ email: email }).select('+password')
    
    if (!user) {
        return res.status(401).json({
            msg: "Invalid User",
            status:"Unauthorized"
        })
        
    }
   
    
    const isValidPassword = await user.comparePassword(password)

    if (!isValidPassword) {
        return res.status(401).json({
            msg: "Password not match",
            status:"Unauthorized "
        })
    }

    const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET,{expiresIn:"3d"})
    
    res.cookie("token", token)
    
    
    res.status(200).json({
        msg: "user login successfully",
        user: {
            email: user.email,
            name:user.name
        },
        token
    })
    
    await emailService.loginAlertEmail(user.email,user.name)




    
}




module.exports={registerUserController,loginUserController}