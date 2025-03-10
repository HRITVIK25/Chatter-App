import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from '../lib/cloudinary.js'
import { getRecieverSocketId } from "../lib/socket.js";
import {io} from "../lib/socket.js"

export const getUserForSidebar = async (req, res) => {
    try {
        const loggedInUSerId = req.user._id;
        const filteredUsers = await User.find({
            _id: { $ne: loggedInUSerId }, // tells mongoose to find every user except current user
        }).select("-password"); 
        res.status(200).json(filteredUsers);
    } catch (error) {
        console.log("Error in getUserForSidebar controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const getMessages = async (req, res) => {
    try {
        const { id: userToChatId } = req.params; // Extract the user ID from request parameters
        const myId = req.user._id; // Get the logged-in user's ID

        const messages = await Message.find({ 
            $or: [
                { senderId: myId, receiverId: userToChatId }, // Case 1: I sent the message
                { senderId: userToChatId, receiverId: myId }  // Case 2: I received the message
            ]
        });

        res.status(200).json(messages); // Return the chat messages
    } catch (error) {
        console.log("Error in getMessages controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

export const sendMessage = async (req, res) => {
    try {
        const { text, image } = req.body; // Extract text and image from request body
        const { id: receiverId } = req.params; // Get receiver's user ID from URL params
        const senderId = req.user._id; // Get logged-in user's ID

        // Upload image to Cloudinary if provided
        let imageUrl; 
        if (image) {
            const uploadResponse = await cloudinary.uploader.upload(image); // Upload image
            imageUrl = uploadResponse.secure_url; // Get the image URL
        };

        // Create a new message document
        const newMessage = new Message({
            senderId,
            receiverId, 
            text,
            image: imageUrl,
        });

        await newMessage.save();

        const receiverSocketId = getRecieverSocketId(receiverId)
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage",newMessage);
        };

        res.status(201).json(newMessage); // Return the new message data

    } catch (error) {
        console.log("Error in sendMessage controller", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
