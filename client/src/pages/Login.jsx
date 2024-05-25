import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import axios from "axios";
import { AppContext } from "../context/AppContext";

const Login = () => {
  const navigate = useNavigate();
  const { setProgress, setUser } = useContext(AppContext);
  const handleLogin = async (e) => {
    e.preventDefault();
    setProgress(0);
    const email = e.target.email.value;
    const password = e.target.password.value;
    if (!email || !password) {
      toast.error("fill all details");
    }
    if (!email.includes("@") || !email.includes(".")) {
      toast.error("Invalid Email");
    }
    try {
      const res = await axios.post(
        `${import.meta.env.VITE_BACKEND_URL}/api/login`,
        {
          email,
          password,
        }
      );
      const data = await res.data;
      setUser(data.user);
      localStorage.setItem("token", data.token);
      setProgress(100);
      toast.success(data.message);
      e.target.reset();
      navigate("/profile");
    } catch (error) {
      toast.error(data?.message || "Something went wrong");
    }
  };
  return (
    <div className="flex flex-col justify-center items-center my-32">
      <h4 className="text-white font-bold text-3xl ">Login</h4>
      <form onSubmit={handleLogin}>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            type="email"
            className="p-2 border border-gray-700 rounded"
            required
            name="email"
            id="email"
          />
        </div>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            type="password"
            className="p-2 border border-gray-700 rounded"
            required
            name="password"
            id="password"
          />
        </div>
        <div className="flex gap-8 justify-between items-center mt-5">
          <button
            type="submit"
            className="p-2 bg-primary text-white rounded-md"
          >
            Login
          </button>
          <h1 className="text-white">
            Dont have an Account.{" "}
            <Link to={"/signup"} className="text-primary underline text-sm">
              Signup
            </Link>
          </h1>
        </div>
      </form>
    </div>
  );
};

export default Login;
