import React, { useState } from 'react'
import { useAuthStore } from '../store/useAuthStore';

import { Camera, Mail, User } from "lucide-react";

const ProfilePage = () => {
  const {authUser, isUpdatingProfile, updateProfile} = useAuthStore();
  const [selectedImage, setSelectedImage] = useState(null)

  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if(!file) return;

    const reader = new FileReader();

    reader.readAsDataURL(file);

    reader.onload = async () => {
      const base64Image = reader.result;
      setSelectedImage(base64Image);
      await updateProfile({profilePic: base64Image});
    }
  }

  return (
    <div className="min-h-screen w-full pb-10 pt-16 px-4 overflow-y-auto">
      <div className="max-w-2xl mx-auto">
        <div className="bg-base-300 rounded-xl p-4 md:p-6 space-y-6">
          <div className="text-center">
            <h1 className="text-xl md:text-2xl font-semibold">Profile</h1>
            <p className="mt-2 text-sm">Your profile information</p>
          </div>

          {/* avatar upload section */}
          <div className="flex flex-col items-center gap-4">
            <div className="relative">
              <img
                src={selectedImage || authUser.profilePic || "/avatar.png"}
                alt="Profile"
                className="w-24 h-24 md:w-32 md:h-32 rounded-full object-cover border-4"
              />
              <label
                htmlFor="avatar-upload"
                className={`
                  absolute bottom-0 right-0 
                  bg-base-content hover:scale-105
                  p-2 rounded-full cursor-pointer 
                  transition-all duration-200
                  ${isUpdatingProfile ? "animate-pulse pointer-events-none" : ""}
                `}
              >
                <Camera className="w-4 h-4 md:w-5 md:h-5 text-base-200" />
                <input
                  type="file"
                  id="avatar-upload"
                  className="hidden"
                  accept="image/*"
                  onChange={handleImageUpload}
                  disabled={isUpdatingProfile}
                />
              </label>
            </div>
            <p className="text-xs md:text-sm text-zinc-400">
              {isUpdatingProfile ? "Uploading..." : "Click the camera icon to update your photo"}
            </p>
          </div>

          <div className="space-y-4 md:space-y-6">
            <div className="space-y-1">
              <div className="text-xs md:text-sm text-zinc-400 flex items-center gap-2">
                <User className="w-4 h-4" />
                Full Name
              </div>
              <p className="px-3 py-2 md:px-4 md:py-2.5 bg-base-200 rounded-lg border overflow-hidden text-ellipsis">{authUser?.fullName}</p>
            </div>

            <div className="space-y-1">
              <div className="text-xs md:text-sm text-zinc-400 flex items-center gap-2">
                <Mail className="w-4 h-4" />
                Email Address
              </div>
              <p className="px-3 py-2 md:px-4 md:py-2.5 bg-base-200 rounded-lg border overflow-hidden text-ellipsis">{authUser?.email}</p>
            </div>
          </div>

          <div className="bg-base-300 rounded-xl">
            <h2 className="text-base md:text-lg font-medium mb-2 md:mb-4">Account Information</h2>
            <div className="space-y-2 text-xs md:text-sm">
              <div className="flex items-center justify-between py-2 border-b border-zinc-700">
                <span>Member Since</span>
                <span>{authUser.createdAt?.split("T")[0]}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span>Account Status</span>
                <span className="text-green-500">Active</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;