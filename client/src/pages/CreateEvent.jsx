import userStore from "@/store/userStore";
import axios from "axios";
import React, { useState } from "react";
import { Form } from "react-router-dom";

const CreateEvent = () => {
  const user = userStore((state) => state.user);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: "",
    time: "",
    date: "",
    category: "",
    hostedBy: "",
    location: "",
    imageUrl: "", // Added for storing the uploaded image URL
  });
  const [selectedFile, setSelectedFile] = useState(null); // Stores the selected file
  const [fileName, setFileName] = useState(""); // Stores the file name for display
  const [isUploading, setIsUploading] = useState(false); // Tracks upload status

  // Months and categories arrays
  const months = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const categories = [
    "Tech",
    "Business",
    "Entertainment",
    "Education",
    "Sports",
    "Health",
    "Arts",
    "Social",
    "Other",
  ];

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
      hostedBy: user ? user.email : formData.hostedBy,
    });
  };

  // Handle image file selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setFileName(file.name);
    }
  };

  // Handle image upload
  const handleImageUpload = async () => {
    if (!selectedFile) return;

    setIsUploading(true); // Disable buttons during upload
    try {
      const data = new FormData();
      data.append("file", selectedFile);
      data.append("upload_preset", "easy_fest"); // Replace with your own preset name
      data.append("cloud_name", " dpvfwzmid");
      // Simulate Cloudinary upload (replace with actual implementation)
      const url = await axios.post(
        "https://api.cloudinary.com/v1_1/dpvfwzmid/image/upload",data
      );
      // Update form data with the image URL
      setFormData((prev) => ({ ...prev, imageUrl: url }));
    } catch (error) {
      console.error("Image upload failed:", error);
    } finally {
      setIsUploading(false); // Re-enable buttons after upload
    }
  };

  // Handle image removal
  const handleRemoveImage = () => {
    setSelectedFile(null);
    setFileName("");
    setFormData((prev) => ({ ...prev, imageUrl: "" }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:3000/api/create",
        { ...formData, hostedBy: user?.email || formData.hostedBy },
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log(response.data);
        // Reset form or redirect here
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Title */}
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

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full p-2 border rounded"
            rows="4"
            required
          />
        </div>

        {/* Month and Date */}
        <div className="grid grid-cols-2 gap-4">
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

        {/* Time and Category */}
        <div className="grid grid-cols-2 gap-4">
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
            <label className="block text-sm font-medium mb-1">Category</label>
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

        {/* Hosted By */}
        <div>
          <label className="block text-sm font-medium mb-1">Hosted By</label>
          <input
            type="text"
            name="hostedBy"
            value={user ? user.email : formData.hostedBy}
            onChange={handleChange}
            className="w-full p-2 border rounded"
          />
        </div>

        {/* Location */}
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

        {/* Image Upload Section */}
        <div>
          <label className="block text-sm font-medium mb-1">Event Image</label>
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
              <p className="text-sm text-gray-600">Selected file: {fileName}</p>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={handleImageUpload}
                  disabled={isUploading}
                  className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Upload Image
                </button>
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
                >
                  Remove
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isUploading}
          className={`w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200 ${
            isUploading ? "opacity-50 cursor-not-allowed" : ""
          }`}
        >
          {isUploading ? "Uploading Image..." : "Create Event"}
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
// import userStore from "@/store/userStore";
// import axios from "axios";
// import React, { useState } from "react";

// const CreateEvent = () => {
//   const user =  userStore(state=>state.user);
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [fileName, setFileName] = useState("");
//   const [isUploading, setIsUploading] = useState(false);
//   const [formData, setFormData] = useState({
//     title: "",
//     description: "",
//     month: "",
//     time: "",
//     date: "",
//     category: "",
//     hostedBy: "",
//     location: "",
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
//   const handleImageChange = (e) => {
//     const file = e.target.files[0];
//     if (file) {
//       setSelectedFile(file);
//       setFileName(file.name);
//     }
//   };
//   const handleImageUpload = async () => {
//     if (!selectedFile) return;

//     setIsUploading(true);
//     try {
//       // Add your Cloudinary upload implementation here
//       // const imageUrl = await cloudinaryUploadFunction(selectedFile);

//       // Simulated upload with timeout
//       const simulatedUrl = await new Promise((resolve) =>
//         setTimeout(
//           () => resolve("https://res.cloudinary.com/example/image.jpg"),
//           1500
//         )
//       );

//       setFormData((prev) => ({ ...prev, imageUrl: simulatedUrl }));
//     } catch (error) {
//       console.error("Image upload failed:", error);
//     } finally {
//       setIsUploading(false);
//     }
//   };
//    const handleRemoveImage = () => {
//      setSelectedFile(null);
//      setFileName("");
//      setFormData((prev) => ({ ...prev, imageUrl: "" }));
//    };

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value,hostedBy:user?user.email:formData.hostedBy });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     console.log("submit");
//     try {
//       const response = await axios.post(
//         "http://localhost:3000/api/create",
//         formData,
//         { withCredentials: true }
//       );
//       if (response.status === 201) {
//         console.log(response.data);
//       }
//     } catch (error) {
//       console.error(error);
//     }
//   };

//   return (
//     <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
//       <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label className="block text-sm font-medium mb-1">Title</label>
//           <input
//             type="text"
//             name="title"
//             value={formData.title}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Description</label>
//           <textarea
//             name="description"
//             value={formData.description}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             rows="4"
//             required
//           />
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Month</label>
//             <select
//               name="month"
//               value={formData.month}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Select Month</option>
//               {months.map((month) => (
//                 <option key={month} value={month}>
//                   {month}
//                 </option>
//               ))}
//             </select>
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Date</label>
//             <input
//               type="number"
//               name="date"
//               value={formData.date}
//               onChange={handleChange}
//               min="1"
//               max="31"
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>
//         </div>

//         <div className="grid grid-cols-2 gap-4">
//           <div>
//             <label className="block text-sm font-medium mb-1">Time</label>
//             <input
//               type="time"
//               name="time"
//               value={formData.time}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             />
//           </div>

//           <div>
//             <label className="block text-sm font-medium mb-1">Category</label>
//             <select
//               name="category"
//               value={formData.category}
//               onChange={handleChange}
//               className="w-full p-2 border rounded"
//               required
//             >
//               <option value="">Select Category</option>
//               {categories.map((category) => (
//                 <option key={category} value={category}>
//                   {category}
//                 </option>
//               ))}
//             </select>
//           </div>
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Hosted By</label>
//           <input
//             type="text"
//             name="hostedBy"
//             value={user ? user.email : formData.hostedBy}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//           />
//         </div>

//         <div>
//           <label className="block text-sm font-medium mb-1">Location</label>
//           <input
//             type="text"
//             name="location"
//             value={formData.location}
//             onChange={handleChange}
//             className="w-full p-2 border rounded"
//             required
//           />
//         </div>

//         <button
//           type="submit"
//           className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
//         >
//           Create Event
//         </button>
//       </form>
//     </div>
//   );
// };

// export default CreateEvent;
