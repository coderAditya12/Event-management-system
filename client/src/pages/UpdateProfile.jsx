import React, { useState, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Upload, X, Camera } from "lucide-react";
import userStore from "@/store/userStore";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const UpdateProfilePage = () => {
  // Get current user from store
  const { user, setUser } = userStore();

  // State management
  const [fullName, setFullName] = useState(user.fullName || "");
  const [email, setEmail] = useState(user.email || "");
  const [password, setPassword] = useState("");
  const [image, setImage] = useState(user.image || null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [error, setError] = useState(null);

  const imageInputRef = useRef(null);
  const navigate = useNavigate();

  // Cloudinary image upload handler
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      setIsImageUploading(true);

      // Create FormData for Cloudinary upload
      const formData = new FormData();
      formData.append("file", file);
      formData.append("upload_preset", "easy_fest");
      formData.append("cloud_name", "dpvfwzmid");

      // Upload to Cloudinary
      const cloudinaryResponse = await axios.post(
        "https://api.cloudinary.com/v1_1/dpvfwzmid/image/upload",
        formData
      );

      // Set the uploaded image URL
      if (cloudinaryResponse.status === 200) {
        setImage(cloudinaryResponse.data.secure_url);
        setError(null);
      }
    } catch (err) {
      console.error("Cloudinary upload error:", err);
      setError("Failed to upload image. Please try again.");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImage(null);
    if (imageInputRef.current) {
      imageInputRef.current.value = "";
    }
  };

  // Update profile handler
  const handleUpdateProfile = async () => {
    try {
      const response = await axios.put(
        `/api/${user._id}/updateProfile`,
        {
          fullName,
          email,
          password,
          image,
        },
        { withCredentials: true }
      );

      // Redirect to profile page or show success message
      if (response.status === 200) {
        setUser(response.data);
        navigate("/profile");
      }
    } catch (err) {
      setError("Failed to update profile. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-white p-6 flex justify-center items-center">
      <Card className="w-full max-w-md bg-purple-50">
        <CardHeader>
          <CardTitle className="text-2xl text-purple-800 text-center">
            Update Profile
          </CardTitle>
        </CardHeader>
        <CardContent>
          {/* Profile Image Upload */}
          <div className="mb-6 flex justify-center">
            <div className="relative">
              {image ? (
                <div className="relative">
                  <img
                    src={image}
                    alt="Profile"
                    className="w-32 h-32 rounded-full object-cover border-4 border-purple-500"
                  />
                  <button
                    onClick={handleRemoveImage}
                    className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1"
                  >
                    <X size={16} />
                  </button>
                </div>
              ) : (
                <div className="w-32 h-32 bg-purple-100 rounded-full flex items-center justify-center">
                  <Camera className="text-purple-500" size={32} />
                </div>
              )}
              <input
                type="file"
                ref={imageInputRef}
                onChange={handleImageUpload}
                accept="image/jpeg,image/png,image/gif"
                className="hidden"
              />
              <Button
                variant="outline"
                onClick={() => imageInputRef.current?.click()}
                disabled={isImageUploading}
                className="mt-2 w-full bg-purple-50 text-purple-800 hover:bg-purple-100"
              >
                {isImageUploading ? "Uploading..." : "Upload Image"}
              </Button>
            </div>
          </div>

          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-300 text-red-800 p-3 rounded-lg mb-4">
              {error}
            </div>
          )}

          {/* Profile Details Form */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Enter your full name"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="mt-2"
              />
            </div>

            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Enter new password (optional)"
                className="mt-2"
              />
            </div>

            {/* Update Button */}
            <Button
              onClick={handleUpdateProfile}
              
              className="w-full mt-4 bg-purple-500 text-white hover:bg-purple-600 disabled:bg-purple-300"
            >
              Update Profile
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default UpdateProfilePage;
