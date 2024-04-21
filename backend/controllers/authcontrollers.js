import bcrypt from 'bcryptjs'
import UserModel from "../model/Usermodel.js";
import crypto from 'crypto'
let cookiesexpiretime=7
export const register = async (req, res, next) => {
    try {
        const { username, email, password, avatar } = req.body;
        await bcrypt.hash(password, 10)

        // Create a new user in the database
        const user = await UserModel.create({ username, email, password:hash, avatar });

        // Generate JWT token for the user
        const token = user.getJwtToken();

        //settings cookies
        const option={
            expires:new Date(
            Date.now()+cookiesexpiretime*24*60*60*1000),
            httpOnly:true

        }

        // Send response with user data and token
        res.status(200).cookie('token',token,option).json({
            success: true,
            message: "User registration successful",
            user,
            token
        });
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({
            success: false,
            message: "Server Error"
        });
    }
};


//login controller
export const  loginuser=async(req,res)=>{
    const {email,password}=req.body
    if(!email||!password){
        return res.status(400).json("please enter email and password")
    }
    const user = await UserModel.findOne({email}).select('+password')
    if(!user){
        return res.status(400).json({
            success:false,
            message:"user invalid email or password"
        })
    }

    if(!user){
    await bcrypt.compare(password,user.password)
        return res.status(400).json({
            success:false,
            message:"user invalid email or password"
        })
    }
    res.status(200).json({
        success: true,
        message: "User login  successful",
        user,
       
     
    })

}

//getallusers

export const getallusers=async(req,res,next)=>{


    const user = await UserModel.find()
    if(!user){
      return   res.status(401).json({
            success:false,
            message:"no users found"
        })
    }

    res.status(200).json({
        success: true,
        message: "all users in database",
        user,
    })

}


export const logout = (req, res, next) => {
    res.cookie("token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    }).status(200).json({
      success:true,
      message:'logout'
    })
  };
//forget password 
export const forgetpassword =async (req,res,next)=>{
const user = await UserModel.findOne({email:req.body.email})
if(!user){
    return res.status(401).json({
        success:true,
        message:"user not found"
    })
}
const resetToken=user.getResetToken()
await user.save({validateBeforeSave:false})
const resetUrl = `${req.protocal}://localhost:8000/api/v1/password/reset/${resetToken}`
const message = `your password reset url is as follows\n ${resetUrl}\n if you have not request this email then ignore it`

try {
    sentemail({
        email:user.email,
        subject:'appliaction password recovery',
        text:message
    })
    res.status(200).json({
        success:true,
        message:`email sent to ${user.email}`
    })
} catch (error) {
    user.resetpasswordtoken=undefined;
    user.resetpasswordtokenexpired=undefined
    await user.save({validateBeforeSave:false})

    return next(error.message)
}
}
