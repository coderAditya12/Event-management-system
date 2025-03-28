import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Loader2, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import userStore from "@/store/userStore.js";
import axios from "axios";
import { io } from "socket.io-client";
import { toast } from "sonner";
import { categories, months } from "../data/eventsData";

const UpdateEvent = () => {
  const { eventId } = useParams();
  const user = userStore((state) => state.user);
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isNotifying, setIsNotifying] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [socket, setSocket] = useState(null);
  const [isImageUploading, setIsImageUploading] = useState(false);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: "",
    time: "",
    date: "",
    category: "",
    hostedBy: "",
    location: "",
    image: "",
    updateMessage: "",
  });

  // Initialize socket connection
  useEffect(() => {
    const newSocket = io("/", {
      path: "/socket.io",
      withCredentials: true,
    });
    setSocket(newSocket);
    return () => newSocket.disconnect();
  }, []);

  // Fetch event data
  useEffect(() => {
    const fetchEvent = async () => {
      try {
        const response = await axios.get(`/api/getevent/${eventId}`, {
          withCredentials: true,
        });
        if (response.status === 200) {
          setFormData({
            ...response.data,
            updateMessage: "", // Initialize update message as empty
          });
          setImagePreview(response.data.image); // Set image preview from fetched data
        }
      } catch (error) {
        console.error("Error fetching event:", error);
        toast.error("Failed to load event data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchEvent();
  }, [eventId]);

  // Handle form field changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Send notification to attendees
  const sendNotification = async (message) => {
    setIsNotifying(true);
    try {
      // Validate message length
      if (message.trim().length > 500) {
        throw new Error("Message too long (max 500 characters)");
      }

      await axios.post(
        `/api/${eventId}/notify`,
        {
          title: "Event Update!",
          body: message,
        },
        {
          withCredentials: true,
        }
      );

      toast.success("Notified attendees!");
      setFormData((prev) => ({ ...prev, updateMessage: "" })); // Clear message after sending
    } catch (error) {
      console.error("Error sending notification:", error);
      toast.error("Failed to send notifications");
      throw error; // Propagate error to handleSubmit
    } finally {
      setIsNotifying(false);
    }
  };

  // Image upload handler
  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result); // Set preview for new image
      };
      reader.readAsDataURL(file);
    }
  };

  // Remove uploaded image
  const handleRemoveImage = () => {
    setImageFile(null);
    setImagePreview(null);
    setFormData((prev) => ({ ...prev, image: "" })); // Clear image URL in form data
  };

  // Handle image upload to Cloudinary
  const handleImageUpload = async () => {
    if (!imageFile) return;

    setIsImageUploading(true);
    try {
      const data = new FormData();
      data.append("file", imageFile);
      data.append("upload_preset", "easy_fest");
      data.append("cloud_name", "dpvfwzmid");

      const response = await axios.post(
        "https://api.cloudinary.com/v1_1/dpvfwzmid/image/upload",
        data
      );

      if (response.status === 200) {
        const imageUrl = response.data.secure_url; // Get the new URL
        setFormData((prev) => ({ ...prev, image: imageUrl })); // Update form data
        setImagePreview(imageUrl); // Update preview
        setImageFile(null); // Clear the file after upload
        toast.success("Image uploaded successfully!");
        return imageUrl; // Return the new URL for immediate use
      }
    } catch (error) {
      console.error("Error uploading image:", error);
      toast.error("Failed to upload image");
    } finally {
      setIsImageUploading(false);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // Validate update message
      if (formData.updateMessage.trim().length > 500) {
        return toast.error("Message too long (max 500 characters)");
      }

      let imageUrl = formData.image;

      // Upload new image first if exists
      if (imageFile) {
        imageUrl = await handleImageUpload(); // Wait for the new URL
      }

      // Create updated data with new image URL
      const updatedData = {
        ...formData,
        image: imageUrl, // Use the latest image URL
      };

      // Update event first
      const response = await axios.put(`/api/${eventId}/update`, updatedData, {
        withCredentials: true,
        headers: { "Content-Type": "application/json" },
      });

      if (response.status === 200) {
        console.log("Event updated successfully:", response.data);
        toast.success("Event updated successfully!");

        // Send notifications only after successful update
        if (formData.updateMessage.trim()) {
          await sendNotification(formData.updateMessage);
        }

        // Emit update notification through socket
        if (socket && formData.updateMessage.trim()) {
          socket.emit("eventUpdated", {
            eventId,
            message: formData.updateMessage,
            updatedBy: user ? user.email : formData.hostedBy,
          });
        }

        navigate(`/event/${eventId}`);
      }
    } catch (error) {
      console.error("Error updating event:", error);
      toast.error("Failed to update event");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="container mx-auto px-4 py-12 flex justify-center">
          <div className="flex flex-col items-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
            <p>Loading event data...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
          <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold text-gray-900">Update Event</h1>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Title Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Description Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="4"
                required
              />
            </div>

            {/* Image Upload */}
            <div className="space-y-2">
              <label className="block text-sm font-medium mb-1">
                Event Image
              </label>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all">
                {imagePreview ? (
                  <div className="space-y-4">
                    <div className="relative w-full h-48 overflow-hidden rounded-md">
                      <img
                        src={imagePreview}
                        alt="Event preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div className="flex justify-end">
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleRemoveImage}
                      >
                        Change Image
                      </Button>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-6">
                    <Upload className="h-10 w-10 text-gray-400 mb-2" />
                    <p className="text-sm text-gray-500 mb-2">
                      Drag and drop an image here or click to upload
                    </p>
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={handleImageChange}
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() =>
                        document.getElementById("image-upload")?.click()
                      }
                    >
                      <Upload className="h-4 w-4 mr-2" /> Select Image
                    </Button>
                  </div>
                )}
              </div>
            </div>

            {/* Month and Date Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Month</label>
                <select
                  name="month"
                  value={formData.month}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Month</option>
                  {months.map((month) => (
                    <option key={month} value={month}>
                      {month}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">Date</label>
                <input
                  type="number"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  min="1"
                  max="31"
                  className="w-full p-2 border rounded"
                  required
                />
              </div>
            </div>

            {/* Time and Category Fields */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium mb-1">Time</label>
                <input
                  type="time"
                  name="time"
                  value={formData.time}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-1">
                  Category
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            {/* Hosted By (Read-Only) */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Hosted By
              </label>
              <input
                type="text"
                name="hostedBy"
                value={user ? user.email : formData.hostedBy}
                onChange={handleChange}
                className="w-full p-2 border rounded bg-gray-100"
                readOnly
              />
            </div>

            {/* Location Field */}
            <div>
              <label className="block text-sm font-medium mb-1">Location</label>
              <input
                type="text"
                name="location"
                value={formData.location}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                required
              />
            </div>

            {/* Update Message Field */}
            <div>
              <label className="block text-sm font-medium mb-1">
                Update Message{" "}
                <span className="text-gray-500 text-xs">
                  (required - Notify attendees about this update)
                </span>
              </label>
              <textarea
                name="updateMessage"
                value={formData.updateMessage}
                onChange={handleChange}
                className="w-full p-2 border rounded"
                rows="2"
                placeholder="Describe what's changing in this update..."
                required
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/event/${eventId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting || isImageUploading || isNotifying}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : isNotifying ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Notifying...
                  </>
                ) : (
                  "Update Event"
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default UpdateEvent;

// import React, { useState, useEffect } from "react";
// import { useParams, useNavigate } from "react-router-dom";
// import { Loader2, Upload } from "lucide-react";
// import { Button } from "@/components/ui/button";
// import userStore from "@/store/userStore";
// import axios from "axios";
// import { io } from "socket.io-client";
// import { toast } from "sonner";

// const UpdateEvent = () => {
//   const { eventId } = useParams();
//   const user = userStore((state) => state.user);
//   const navigate = useNavigate();
//   const [isLoading, setIsLoading] = useState(true);
//   const [isSubmitting, setIsSubmitting] = useState(false);
//   const [imageFile, setImageFile] = useState(null);
//   const [imagePreview, setImagePreview] = useState(null);
//   const [socket, setSocket] = useState(null);
//   const [isImageUploading, setIsImageUploading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     month: "",
//     time: "",
//     date: "",
//     category: "",
//     hostedBy: "",
//     location: "",
//     image: "",
//     updateMessage: "",
//   });

//   const months = [
//     "January",
//     "February",
//     "March",
//     "April",
//     "May",
//     "June",
//     "July",
//     "August",
//     "September",
//     "October",
//     "November",
//     "December",
//   ];

//   const categories = [
//     "Tech",
//     "Business",
//     "Entertainment",
//     "Education",
//     "Sports",
//     "Health",
//     "Arts",
//     "Social",
//     "Other",
//   ];

//   // Initialize socket connection
//   useEffect(() => {
//     const newSocket = io("http://localhost:3000");
//     setSocket(newSocket);
//     return () => newSocket.disconnect();
//   }, []);

//   // Fetch event data
//   useEffect(() => {
//     const fetchEvent = async () => {
//       try {
//         const response = await axios.get(
//           `http://localhost:3000/api/getevent/${eventId}`,
//           { withCredentials: true }
//         );
//         if (response.status === 200) {
//           setFormData({
//             ...response.data,
//             updateMessage: "", // Initialize update message as empty
//           });
//           setImagePreview(response.data.image); // Set image preview from fetched data
//         }
//       } catch (error) {
//         console.error("Error fetching event:", error);
//         toast.error("Failed to load event data");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     fetchEvent();
//   }, [eventId]);

//   // Handle form field changes
//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//   };
//   const sendNotification =async(message)=>{
//     try {
//       await axios.post(`http://localhost:3000/api/${eventId}/notify`, {
//         title: "Event Update!",
//         body: message,
//       });
//       setFormData(...formData,{updateMessage:""});
//       return;
//     } catch (error) {
//       console.error("Error sending notification:", error);
//     }
//   }

//   // Image upload handler
//   const handleImageChange = (e) => {
//     const file = e.target.files?.[0];
//     if (file) {
//       setImageFile(file);
//       const reader = new FileReader();
//       reader.onloadend = () => {
//         setImagePreview(reader.result); // Set preview for new image
//       };
//       reader.readAsDataURL(file);
//     }
//   };

//   // Remove uploaded image
//   const handleRemoveImage = () => {
//     setImageFile(null);
//     setImagePreview(null);
//     setFormData((prev) => ({ ...prev, image: "" })); // Clear image URL in form data
//   };

//   // Handle image upload to Cloudinary
//   const handleImageUpload = async () => {
//     if (!imageFile) return;

//     setIsImageUploading(true);
//     try {
//       const data = new FormData();
//       data.append("file", imageFile); // Append the selected file
//       data.append("upload_preset", "easy_fest");
//       data.append("cloud_name", "dpvfwzmid");

//       const response = await axios.post(
//         "https://api.cloudinary.com/v1_1/dpvfwzmid/image/upload",
//         data
//       );

//       if (response.status === 200) {
//         const imageUrl = response.data.secure_url; // Get the new URL
//         setFormData((prev) => ({ ...prev, image: imageUrl })); // Update form data
//         setImagePreview(imageUrl); // Update preview
//         setImageFile(null); // Clear the file after upload
//         toast.success("Image uploaded successfully!");
//         return imageUrl; // Return the new URL for immediate use
//       }
//     } catch (error) {
//       console.error("Error uploading image:", error);
//       toast.error("Failed to upload image");
//     } finally {
//       setIsImageUploading(false);
//     }
//   };

//   // Handle form submission
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setIsSubmitting(true);

//     try {
//       let imageUrl = formData.image;

//       // Upload new image first if exists
//       if (imageFile) {
//         imageUrl = await handleImageUpload(); // Wait for the new URL
//       }

//       // Create updated data with new image URL
//       const updatedData = {
//         ...formData,
//         image: imageUrl, // Use the latest image URL
//       };
//       if(formData.updateMessage){
//         await sendNotification(formData.updateMessage);
//       }

//       const response = await axios.put(
//         `http://localhost:3000/api/${eventId}/update`,
//         updatedData,
//         {
//           withCredentials: true,
//           headers: { "Content-Type": "application/json" },
//         }
//       );

//       if (response.status === 200) {
//         console.log("Event updated successfully:", response.data);
//         toast.success("Event updated successfully!");

//         // Emit update notification through socket if there's an update message
//         if (socket && formData.updateMessage.trim()) {
//           socket.emit("eventUpdated", {
//             eventId,
//             message: formData.updateMessage,
//             updatedBy: user ? user.email : formData.hostedBy,
//           });
//         }

//         navigate(`/event/${eventId}`);
//       }
//     } catch (error) {
//       console.error("Error updating event:", error);
//       toast.error("Failed to update event");
//     } finally {
//       setIsSubmitting(false);
//     }
//   };

//   if (isLoading) {
//     return (
//       <div className="min-h-screen bg-gray-50">
//         <div className="container mx-auto px-4 py-12 flex justify-center">
//           <div className="flex flex-col items-center">
//             <Loader2 className="h-8 w-8 animate-spin text-primary mb-4" />
//             <p>Loading event data...</p>
//           </div>
//         </div>
//       </div>
//     );
//   }

//   return (
//     <div className="min-h-screen bg-gray-50">
//       <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
//         <div className="max-w-3xl mx-auto bg-white p-6 md:p-8 rounded-lg shadow-md">
//           <div className="flex items-center justify-between mb-6">
//             <h1 className="text-3xl font-bold text-gray-900">Update Event</h1>
//           </div>

//           <form onSubmit={handleSubmit} className="space-y-6">
//             {/* Title Field */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Title</label>
//               <input
//                 type="text"
//                 name="title"
//                 value={formData.title}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             {/* Description Field */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Description
//               </label>
//               <textarea
//                 name="description"
//                 value={formData.description}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 rows="4"
//                 required
//               />
//             </div>

//             {/* Image Upload */}
//             <div className="space-y-2">
//               <label className="block text-sm font-medium mb-1">
//                 Event Image
//               </label>
//               <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 transition-all">
//                 {imagePreview ? (
//                   <div className="space-y-4">
//                     <div className="relative w-full h-48 overflow-hidden rounded-md">
//                       <img
//                         src={imagePreview}
//                         alt="Event preview"
//                         className="w-full h-full object-cover"
//                       />
//                     </div>
//                     <div className="flex justify-end">
//                       <Button
//                         type="button"
//                         variant="outline"
//                         onClick={handleRemoveImage}
//                       >
//                         Change Image
//                       </Button>
//                     </div>
//                   </div>
//                 ) : (
//                   <div className="flex flex-col items-center justify-center py-6">
//                     <Upload className="h-10 w-10 text-gray-400 mb-2" />
//                     <p className="text-sm text-gray-500 mb-2">
//                       Drag and drop an image here or click to upload
//                     </p>
//                     <input
//                       type="file"
//                       id="image-upload"
//                       className="hidden"
//                       accept="image/*"
//                       onChange={handleImageChange}
//                     />
//                     <Button
//                       type="button"
//                       variant="outline"
//                       onClick={() =>
//                         document.getElementById("image-upload")?.click()
//                       }
//                     >
//                       <Upload className="h-4 w-4 mr-2" /> Select Image
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </div>

//             {/* Month and Date Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Month</label>
//                 <select
//                   name="month"
//                   value={formData.month}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 >
//                   <option value="">Select Month</option>
//                   {months.map((month) => (
//                     <option key={month} value={month}>
//                       {month}
//                     </option>
//                   ))}
//                 </select>
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">Date</label>
//                 <input
//                   type="number"
//                   name="date"
//                   value={formData.date}
//                   onChange={handleChange}
//                   min="1"
//                   max="31"
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>
//             </div>

//             {/* Time and Category Fields */}
//             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
//               <div>
//                 <label className="block text-sm font-medium mb-1">Time</label>
//                 <input
//                   type="time"
//                   name="time"
//                   value={formData.time}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 />
//               </div>

//               <div>
//                 <label className="block text-sm font-medium mb-1">
//                   Category
//                 </label>
//                 <select
//                   name="category"
//                   value={formData.category}
//                   onChange={handleChange}
//                   className="w-full p-2 border rounded"
//                   required
//                 >
//                   <option value="">Select Category</option>
//                   {categories.map((category) => (
//                     <option key={category} value={category}>
//                       {category}
//                     </option>
//                   ))}
//                 </select>
//               </div>
//             </div>

//             {/* Hosted By (Read-Only) */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Hosted By
//               </label>
//               <input
//                 type="text"
//                 name="hostedBy"
//                 value={user ? user.email : formData.hostedBy}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded bg-gray-100"
//                 readOnly
//               />
//             </div>

//             {/* Location Field */}
//             <div>
//               <label className="block text-sm font-medium mb-1">Location</label>
//               <input
//                 type="text"
//                 name="location"
//                 value={formData.location}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 required
//               />
//             </div>

//             {/* Update Message Field */}
//             <div>
//               <label className="block text-sm font-medium mb-1">
//                 Update Message{" "}
//                 <span className="text-gray-500 text-xs">
//                   (required - Notify attendees about this update)
//                 </span>
//               </label>
//               <textarea
//                 name="updateMessage"
//                 value={formData.updateMessage}
//                 onChange={handleChange}
//                 className="w-full p-2 border rounded"
//                 rows="2"
//                 placeholder="Describe what's changing in this update..."
//                 required
//               />
//             </div>

//             {/* Form Actions */}
//             <div className="flex justify-end space-x-4 pt-4">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={() => navigate(`/event/${eventId}`)}
//               >
//                 Cancel
//               </Button>
//               <Button type="submit" disabled={isSubmitting || isImageUploading}>
//                 {isSubmitting ? (
//                   <>
//                     <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//                     Updating...
//                   </>
//                 ) : (
//                   "Update Event"
//                 )}
//               </Button>
//             </div>
//           </form>
//         </div>
//       </div>
//     </div>
//   );
// };

// export default UpdateEvent;
