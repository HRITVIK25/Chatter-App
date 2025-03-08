import {create} from "zustand"
import toast from "react-hot-toast"
import { axiosInstance } from "../lib/axios";
import { useAuthStore } from "./useAuthStore.js"

export const useChatStore = create ((set,get)=>({
    messages: [],
    users: [], // all the users
    selectedUser: null,  // whose chat is open
    isUsersLoading:false,
    isMessagesLoading:false,


    getUsers: async () => {
        set({isUsersLoading:true})
        try {
            const res = await axiosInstance.get("/message/users");
            set({users: res.data})
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isUsersLoading:false})
        }
    },

    getMessages: async (userId) => {
        set({isMessagesLoading:true})
        try {
            const res = await axiosInstance.get(`/message/${userId}`)
            set({messages: res.data});
        } catch (error) {
            toast.error(error.response.data.message);
        } finally {
            set({isMessagesLoading:false})
        }
    },

    setselectedUser: (selectedUser) => set({selectedUser}),


    sendMessage: async (messageData) => {
        const {selectedUser, messages} = get();
        try {
            const res = await axiosInstance.post(`/message/send/${selectedUser._id}`,messageData)
            set({messages:[...messages,res.data]})  // to display the new message at the end we use spread operator to spread all the old messages and append the new message at the end
        } catch (error) {
            toast.error(error.response.data.message);
        }
    },

    subscribeToMessages: () => {
        const {selectedUser} = get(); 
        //works only when a user is selected
        if(!selectedUser) return;
        
        const socket = useAuthStore.getState().socket;
        
        socket.on("newMessage",(newMessage)=>{
            const isMessageSentFromSelectedUser = newMessage.senderId === selectedUser._id
            if(!isMessageSentFromSelectedUser) return;
            set({
                messages: [...get().messages, newMessage],
            });
        })
    },

    unsubscribeFromMessages: () => {
        const socket = useAuthStore.getState().socket;
        socket.off("newMessage");
    },


}));