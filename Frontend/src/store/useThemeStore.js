import { create } from "zustand";

export const useThemeStore = create((set)=>({
    theme: localStorage.getItem("chat-theme") || "coffee",
    setTheme: (theme) => {
        localStorage.setItem("chat-theme",theme);
        set({theme});
    },
}));

// theme set whatever stored in localStorage or else coffee 
// whenever user updates theme set it in localstorage and set theme as selected