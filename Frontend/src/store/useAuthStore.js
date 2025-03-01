import {create} from 'zustand';
import { axiosInstance } from '../lib/axios.js';
import toast from 'react-hot-toast';

export const useAuthStore = create((set)=>({
    authUser: null,
    isSigningUp: false,
    isLoggingIn: false,
    isUpdatingProfile:false,

    isCheckingAuth: true, // this will initially be true as we start checking 

    checkAuth: async ()=>{
        try {
            const res = await axiosInstance.get("/auth/check")

            set({authUser:res.data});
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
            toast.success("User logged out")
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
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isLoggingIn:false});
        }
    }
}))