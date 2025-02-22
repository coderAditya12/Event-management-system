import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";
import userStore from "@/store/userStore";

const Login = () => {
  const setUser = userStore((state) => state.setUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
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
        "http://localhost:3000/api/login",
        formData,
        { withCredentials: true }
      );
      if (response.status === 200) {
        setUser(response.data);
        navigate("/dashboard");
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
            signing...
          </Button>
        ) : (
          <Button type="submit" className="w-full">
            Login
          </Button>
        )}
      </form>
      <div className="flex gap-4">
        <p>don't have account?</p>
        <Button variant="outline" asChild>
          <Link to="/register">Sign Up</Link>
        </Button>
      </div>
    </div>
  );
};

export default Login;
