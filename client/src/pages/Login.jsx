import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Eye, EyeOff, Mail, Lock, ArrowRight, AlertCircle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import axios from "axios";
import userStore from "@/store/userStore.js";

const Login = () => {
  const setUser = userStore((state) => state.setUser);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [errors, setErrors] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setErrors(null);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      setErrors(null);
      const response = await axios.post("/api/login", formData, {
        withCredentials: true,
      });
      if (response.status === 200) {
        setUser(response.data);
        navigate("/events");
      }
      setLoading(false);
    } catch (error) {
      setErrors(error?.response?.data?.message);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-50">
      <div className="container mx-auto px-4 py-12">
        <Card className="max-w-md mx-auto border-0 shadow-lg overflow-hidden">
          <div className="absolute h-1.5 w-full bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 top-0 left-0"></div>
          <CardHeader className="space-y-1 pt-8">
            <CardTitle className="text-2xl font-bold text-center bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-blue-500">
              Welcome Back
            </CardTitle>
            <CardDescription className="text-center text-gray-500">
              Login to access your account
            </CardDescription>
          </CardHeader>
          <CardContent>
            {errors && (
              <Alert variant="destructive" className="mb-4">
                <AlertCircle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{errors}</AlertDescription>
              </Alert>
            )}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label
                  htmlFor="email"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Mail className="h-4 w-4 text-gray-400" />
                  Email Address
                </label>
                <div className="relative">
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    placeholder="your.email@example.com"
                    className="pl-3 transition-all focus:border-purple-500 focus:ring-purple-500"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label
                  htmlFor="password"
                  className="text-sm font-medium text-gray-700 flex items-center gap-2"
                >
                  <Lock className="h-4 w-4 text-gray-400" />
                  Password
                </label>
                <div className="relative">
                  <Input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    className="pl-3 pr-10 transition-all focus:border-purple-500 focus:ring-purple-500"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <button
                    type="button"
                    className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    onClick={togglePasswordVisibility}
                  >
                    {showPassword ? (
                      <EyeOff className="h-4 w-4" />
                    ) : (
                      <Eye className="h-4 w-4" />
                    )}
                  </button>
                </div>
              </div>

              {loading ? (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2 rounded-md transition-all duration-300 flex items-center justify-center group"
                  disabled
                >
                  Signing...
                </Button>
              ) : (
                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-purple-600 to-blue-500 hover:from-purple-700 hover:to-blue-600 text-white font-medium py-2 rounded-md transition-all duration-300 flex items-center justify-center group"
                >
                  Log in
                  <ArrowRight className="ml-2 h-4 w-4 group-hover:translate-x-1 transition-transform" />
                </Button>
              )}
            </form>
          </CardContent>
          <CardFooter className="flex justify-center pb-8">
            <p className="text-center text-sm text-gray-600">
              Don't have an account?{" "}
              <Link
                to="/register"
                className="text-purple-600 hover:text-purple-800 font-medium"
              >
                Sign up
              </Link>
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  );
};

export default Login;
// import React, { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import axios from "axios";
// import { Link, useNavigate } from "react-router-dom";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { AlertCircle } from "lucide-react";
// import userStore from "@/store/userStore.js";

// const Login = () => {
//   const setUser = userStore((state) => state.setUser);
//   const navigate = useNavigate();
//   const [formData, setFormData] = useState({
//     email: "",
//     password: "",
//   });
//   const [errors, setErrors] = useState(null);
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     const { name, value } = e.target;
//     setFormData({ ...formData, [name]: value });
//     setErrors(null);
//   };
//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     try {
//       setLoading(true);
//       setErrors(null);
//       const response = await axios.post("/api/login", formData, {
//         withCredentials: true,
//       });
//       if (response.status === 200) {
//         setUser(response.data);
//         navigate("/events");
//       }
//       setLoading(false);
//     } catch (error) {
//       setErrors(error?.response?.data?.message);
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="max-w-md mx-auto p-6">
//       {errors && (
//         <Alert variant="destructive">
//           <AlertCircle className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{errors}</AlertDescription>
//         </Alert>
//       )}
//       <form onSubmit={handleSubmit} className="space-y-4">
//         <div>
//           <label htmlFor="email" className="block mb-2 text-sm font-medium">
//             Email
//           </label>
//           <Input
//             id="email"
//             name="email"
//             type="email"
//             value={formData.email}
//             onChange={handleChange}
//             placeholder="Enter your email"
//             required
//           />
//         </div>

//         <div>
//           <label htmlFor="password" className="block mb-2 text-sm font-medium">
//             Password
//           </label>
//           <Input
//             id="password"
//             name="password"
//             type="password"
//             value={formData.password}
//             onChange={handleChange}
//             placeholder="Enter your password"
//             required
//           />
//         </div>

//         {loading ? (
//           <Button type="submit" className="w-full">
//             signing...
//           </Button>
//         ) : (
//           <Button type="submit" className="w-full">
//             Login
//           </Button>
//         )}
//       </form>
//       <div className="flex gap-4">
//         <p>don't have account?</p>
//         <Button variant="outline" asChild>
//           <Link to="/register">Sign Up</Link>
//         </Button>
//       </div>
//     </div>
//   );
// };

// export default Login;
