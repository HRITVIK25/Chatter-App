import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';
import { io } from "socket.io-client";

<<<<<<< HEAD
const BASE_URL = import.meta.env.MODE === "development" ? "http://localhost:5001" : "/";
=======
const BASE_URL = "http://localhost:5001";
>>>>>>> d01ffeaf15323214f19a85442de89a743a222bff

export const useAuthStore = create((set,get)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile:false,
    onlineUsers: [],
    socket: null,

    isCheckingAuth: true, // this will initially be true as we start checking 

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")
            set({authUser:res.data});

            get().connectSocket(); // whenever we refresh
        } catch (error) {
            console.log("Error in checkAuth function: ",error)
            set({authUser:null});
        } finally {
            set({isCheckingAuth:false});
        }
    },

    signup: async (data)=>{
        set({isSigningUp:true}); // this will change the styling when the form is subitted to give a loading effect and also button will be diasbled
        try {
            const res = await axiosInstance.post('/auth/signup',data);
            set({authUser:res.data});
            toast.success("Account created Successfully");

            get().connectSocket(); // on signup connect to socket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally{
            set({isSigningUp:false})
        }
    },

    logout: async ()=>{
        try {
            await axiosInstance.post("/auth/logout");
            set({authUser:null});
            toast.success("User logged out");

            get().disconectSocket();
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    login: async (data) => {
        set({isLoggingIn:true});
        try {
            const res = await axiosInstance.post("/auth/login",data);
            set({authUser:res.data});
            toast.success("Welcome Back!");

            get().connectSocket() // on login connect to socket
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn:false});
        }
    },

    updateProfile: async (data) =>{
        set({isUpdatingProfile:true})
        try {
            const res = await axiosInstance.put("/auth/update-profile",data);
            set({authUser:res.data}); // set authUser with newly updated data containing new profile pic
            toast.success("Profile picture added successfully");
        }  catch (error) {
            toast.error(error.response.data.message || "Image size is too large");
        } finally {
            set({isUpdatingProfile:false});
        }
    },

    connectSocket: ()=>{
        const {authUser} = get()
        if(!authUser || get().socket?.connected) return; // if user not authorised or user already connected then return

        const socket = io(BASE_URL,{
            query:{
                userId: authUser._id, // this is is passed to backend const userId = socket.handshake.query.userId;
            }
        });
        socket.connect();

        set({ socket: socket });

        socket.on("getOnlineUsers", (userIds)=>{
            set({onlineUsers: userIds})
        })
    },

    disconectSocket: ()=>{
        if(get().socket?.connected) get().socket.disconnect();
        // if we are connected then onyly try to disconnect
        set({ socket: null });
    },
}))