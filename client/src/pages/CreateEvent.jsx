import userStore from "@/store/userStore";
import axios from "axios";
import React, { useState } from "react";

const CreateEvent = () => {
  const user =  userStore(state=>state.user);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    month: "",
    time: "",
    date: "",
    category: "",
    hostedBy: "",
    location: "",
  });

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

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value,hostedBy:user?user.email:formData.hostedBy });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log("submit");
    try {
      const response = await axios.post(
        "http://localhost:3000/api/create",
        formData,
        { withCredentials: true }
      );
      if (response.status === 201) {
        console.log(response.data);
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-6">Create New Event</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
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

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded hover:bg-blue-700 transition duration-200"
        >
          Create Event
        </button>
      </form>
    </div>
  );
};

export default CreateEvent;
