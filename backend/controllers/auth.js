import User from '../models/userModel.js'
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

export const signUp = async (req, res)=>{
    try {
        const {name, email, password} = req.body

        if(!email || !name || !password){
            return res.status(400).json({
                message: "Enter all the fields",
                success: false
            })
        }

        const existMail = await User.findOne({email});
        if(existMail){
            return res.status(400).json({
                message: "Email Already exists",
                success: false
            })
        }

        if(password.length < 6){
            return res.status(400).json({
                message: "Password must be atleast 6 characters",
                success: false
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await User.create({
            name,
            password: hashedPassword,
            email
        })

        const token = await jwt.sign({id: user._id}, process.env.JWT_SECRET, {expiresIn: '7d'})

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7*24*60*60*1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(201).json({
            user,
            token,
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(200).json({
            message: error,
            success: false
        })
    }
}


export const Login = async (req, res) => {
    try {
        const { email, password } = req.body

        if (!email || !password) {
            return res.status(400).json({
                message: "Enter all the fields",
                success: false
            })
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({
                message: "User does not exist",
                success: false
            })
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if(!isMatch){
            return res.status(400).json({
                message: "Invalid Credentials",
                success: false
            })
        }

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' })

        res.cookie("token", token, {
            httpOnly: true,
            maxAge: 7 * 24 * 60 * 60 * 1000,
            sameSite: "strict",
            secure: false
        })

        return res.status(200).json({
            message: "SuccessFully loggedin",
            success: true
        })

    } catch (error) {
        console.log(error);
        return res.status(200).json({
            message: error.message,
            success: false
        })
    }
}

export const logout = async (req, res) =>{
    try {
        res.clearCookie("token")
        return res.status(200).json({
            message: "Logged out successfully",
            success: true
        })
    } catch (error) {
        console.log(error)
        return res.status(400).json({
            message: error,
            success: false
        })
    }
}