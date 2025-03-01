import User from '../models/user.model.js'
import bcrypt from 'bcryptjs'
import { generateToken } from '../lib/utils.js'
import cloudinary from '../lib/cloudinary.js'

export const signup = async (req,res) => {
    const {fullName,email,password} = req.body
    try {

        if(!(fullName || email || password)){
            return res.status(400).json({message: "All fields are required."})
        }

        if (password.length < 6) {
            return res.status(400).json({message: "Password must be atleast 6 characters."})
        }

        const userExist = await User.findOne({email});

        if(userExist){
            return res.status(400).json({message: "User already exist Please Login!"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashedPassword = await bcrypt.hash(password,salt)
        const newUser = new User({
            fullName,
            email,
            password: hashedPassword,
        });

        if(newUser){
            // here error may come 
            generateToken(newUser._id,res);
            await newUser.save();
            res.status(201).json({
                _id: newUser._id,
                fullName: newUser.fullName,
                email: newUser.email,
                profilePic: newUser.profilePic || "",
        });
        } else{
            return res.status(400).json({message: "Invalid User"})
        }
    } catch (error) {
        console.log("User signup error: ",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const login = async(req,res) => {
    const {email,password} = req.body;
    try {
        if(!(email || password)){
            return res.status(401).json({message: "Please provide all fields"});
        }

        const user = await User.findOne({email});

        if(!user){
            return res.status(400).json({message: "Invalid credentials"});
        }
        const isPasswordCorrect = await bcrypt.compare(password, user.password);

        if(!isPasswordCorrect){
            return res.status(400).json({message: "Invalid credentials"});
        }

        generateToken(user._id,res);

        res.status(200).json({
            _id: user._id,
            fullName: user.fullName,
            email: user.email,
            profilePic: user.profilePic || "",
        });

    } catch (error) {
        console.log("User Login Error",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const logout = async (req,res) => {
    try {
        res.cookie("jwt","",{mxAge:0});
        res.status(200).json({message: "Logged out Successfully"})
    } catch (error) {
        console.log("User Logout Error",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }
};

export const updateProfile = async (req,res) => {
    try {
        const {profilePic} = req.body;
        const userId = req.user._id;

        if(!profilePic){
            return res.status(400).json({message: "Profile pic not provided"});
        }

        const uploadResponse = await cloudinary.uploader.upload(profilePic);

        const updatedUser = await User.findByIdAndUpdate(userId,{
            profilePic: uploadResponse.secure_url
        },{new:true});

        res.status(200),json({updatedUser})
    } catch (error) {
        console.log("User update Error",error.message);
        res.status(500).json({message: "Internal Server Error"});
    }

};

export const checkAuth = async (req,res) =>{   // just to authenticate user
    try {
        res.status(200).json(req.user);
    } catch (error) {
        console.log("Error in checkAuth controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};