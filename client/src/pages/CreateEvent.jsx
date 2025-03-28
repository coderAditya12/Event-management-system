import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { Clock, Upload, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {categories,months} from "../data/eventsData"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import userStore from "@/store/userStore.js";
import axios from "axios";

const CreateEvent = () => {
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    date: "",
    time: "",
    month: "",
    category: "",
    hostedBy: user ? user.email : "",
    location: "",
    imageUrl: "",
  });
  const [selectedFile, setSelectedFile] = useState(null);
  const [fileName, setFileName] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);


  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleCategoryChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      category: value,
    }));
  };

  const handleMonthChange = (value) => {
    setFormData((prev) => ({
      ...prev,
      month: value,
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true);
    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "easy_fest");
      data.append("cloud_name", "dpvfwzmid");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dpvfwzmid/image/upload",
        data
      );
      console.log(response.data.secure_url);
      setFormData((prev) => ({
        ...prev,
        imageUrl: response.data.secure_url,
      }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFileName("");
    setFormData((prev) => ({
      ...prev,
      imageUrl: "",
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(!user){
      navigate('/login');
      return;
    }
    setIsSubmitting(true);

    try {
      const response = await axios.post(
        "/api/create",
        { ...formData, hostedBy: user?.email || formData.hostedBy },
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log(response.data);
        // Optionally navigate to events page
        // navigate("/events");
      }
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
          <h1 className="text-3xl font-bold mb-8 text-center text-gray-800">
            Create New Event
          </h1>

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Event Title */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Title
              </label>
              <Input
                name="title"
                placeholder="e.g., Tech Conference 2024"
                value={formData.title}
                onChange={handleChange}
                className="focus-visible:ring-purple-500"
                required
              />
            </div>

            {/* Event Description */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Description
              </label>
              <Textarea
                name="description"
                placeholder="Provide a detailed description of the event."
                value={formData.description}
                onChange={handleChange}
                className="min-h-32 resize-y focus-visible:ring-purple-500"
                required
              />
            </div>

            {/* Date */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Date
              </label>
              <Input
                type="number"
                name="date"
                placeholder="Enter a date (1-31)"
                value={formData.date}
                onChange={handleChange}
                min="1"
                max="31"
                className="focus-visible:ring-purple-500"
                required
              />
            </div>

            {/* Month Dropdown */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Month
              </label>
              <Select onValueChange={handleMonthChange} value={formData.month}>
                <SelectTrigger className="focus:ring-purple-500">
                  <SelectValue placeholder="Select a month" />
                </SelectTrigger>
                <SelectContent>
                  {months.map((month) => (
                    <SelectItem key={month} value={month}>
                      {month}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Time */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Time
              </label>
              <div className="relative">
                <Clock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="pl-10 focus-visible:ring-purple-500"
                  required
                />
              </div>
            </div>

            {/* Category */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Category
              </label>
              <Select
                onValueChange={handleCategoryChange}
                value={formData.category}
              >
                <SelectTrigger className="focus:ring-purple-500">
                  <SelectValue placeholder="Select a category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            {/* Hosted By */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Hosted By
              </label>
              <Input
                name="hostedBy"
                value={user ? user.email : formData.hostedBy}
                onChange={handleChange}
                className="focus-visible:ring-purple-500"
                required
              />
            </div>

            {/* Location */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Location
              </label>
              <Input
                name="location"
                placeholder="e.g., 123 Main St, City, State"
                value={formData.location}
                onChange={handleChange}
                className="focus-visible:ring-purple-500"
                required
              />
            </div>

            {/* Image Upload */}
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Event Image
              </label>
              {!selectedFile ? (
                <>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="imageUpload"
                  />
                  <label
                    htmlFor="imageUpload"
                    className="w-full p-2 border rounded cursor-pointer bg-gray-100 hover:bg-gray-200 block text-center"
                  >
                    Choose Image
                  </label>
                </>
              ) : (
                <div className="space-y-2">
                  <p className="text-sm text-gray-600">
                    Selected file: {fileName}
                  </p>
                  <div className="flex gap-2">
                    <Button
                      type="button"
                      onClick={handleImageUpload}
                      disabled={isUploading}
                      className="bg-green-600 hover:bg-green-700"
                    >
                      Upload Image
                    </Button>
                    <Button
                      type="button"
                      onClick={handleRemoveImage}
                      className="bg-red-600 hover:bg-red-700"
                    >
                      Remove
                    </Button>
                  </div>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <Button
              type="submit"
              disabled={isUploading || isSubmitting}
              className="w-full bg-purple-600 hover:bg-purple-700 text-white py-3"
            >
              {isSubmitting ? "Creating Event..." : "Create Event"}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateEvent;
