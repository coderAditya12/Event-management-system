import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const Signup = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    fullName: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(null);
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors(null);
      const response = await axios.post(
        "http://localhost:3000/api/signup",
        formData
      );
      if (response.status === 201) {
        navigate("/login");
      }
      setLoading(false);
    } catch (error) {
      setErrors(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6">
      {errors && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertTitle>Error</AlertTitle>
          <AlertDescription>{errors}</AlertDescription>
        </Alert>
      )}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block mb-2 text-sm font-medium">
            Email
          </label>
          <Input
            id="email"
            name="email"
            type="email"
            value={formData.email}
            onChange={handleChange}
            placeholder="Enter your email"
            required
          />
        </div>

        <div>
          <label htmlFor="fullName" className="block mb-2 text-sm font-medium">
            Full Name
          </label>
          <Input
            id="fullName"
            name="fullName"
            type="text"
            value={formData.fullName}
            onChange={handleChange}
            placeholder="Enter your full name"
            required
          />
        </div>

        <div>
          <label htmlFor="password" className="block mb-2 text-sm font-medium">
            Password
          </label>
          <Input
            id="password"
            name="password"
            type="password"
            value={formData.password}
            onChange={handleChange}
            placeholder="Enter your password"
            required
          />
        </div>

        {loading ? (
          <Button type="submit" className="w-full">
            Registering...
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Register
          </Button>
        )}
      </form>
      <div className="flex gap-4">
        <p>already have an account?</p>
        <Button variant="outline" asChild>
          <Link to="/login">login</Link>
        </Button>
      </div>
    </div>
  );
};

export default Signup;
