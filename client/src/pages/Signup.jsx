import React, { useState, useContext } from "react";
import { toast } from "react-hot-toast";
import { AppContext } from "../context/AppContext";
import axios from "axios";
import { useUpload } from "../hooks/useUpload.js";
import { useNavigate } from "react-router-dom";

const Signup = () => {
  //const { SetProgress } = useContext(AppContext);
  const navigate = useNavigate();
  const [user, setUser] = useState({
    name: "",
    email: "",
    password: "",
  });
  const [image, setImage] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file.size > 1000000) {
      toast.error("Image size must be less than 1mb");
    } else {
      setImage(file);
    }
  };

  const onUploadProgress = (ProgressEvent) => {
    const porgress = Math.round(
      (ProgressEvent.loaded * 100) / ProgressEvent.total
    );
    //SetProgress(porgress);
  };

  const handleOnChange = (e) => {
    const name = e.target.name;
    const value = e.target.value;
    setUser({ ...user, [name]: value });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    try {
      if (!user.name || !user.email || !user.password) {
        return toast.error("All field are required");
      }
      if (
        user.name.trim === "" ||
        user.email.trim === "" ||
        user.password.trim === ""
      ) {
        return toast.error("All field are required");
      }
      if (
        user.name.length < 3 ||
        (!user.email.includes("@") && !user.email.includes("."))
      ) {
        return toast.error("Please Enter Valid Data");
      }
      const { public_id, url } = await useUpload({ image, onUploadProgress });

      if (!public_id || !url) {
        toast.error("Error Uploading image");
        return;
      } else {
        const res = await axios.post(
          `${import.meta.env.VITE_BACKEND_URL}/api/signup`,
          {
            name: user.name,
            email: user.email,
            password: user.password,
            profile: url,
            publicId: public_id,
          }
        );
        const data = res.data;
        if (data.success === true) {
          toast.success(data.message);
          setUser({ name: "", email: "", password: "" });
          navigate("/login");
        } else {
          toast.error(data.message);
        }
      }
    } catch (error) {
      console.log("Error in signup", error.message);
    }
  };
  return (
    <div className="flex flex-col justify-center items-center my-20">
      <h2 className="text-white text-xl md:text-3xl font-bold">
        Lets create your profile
      </h2>
      <form className="grid sm:grid-cols-2 gap-5" onSubmit={handleSignup}>
        <div className="flex flex-col gap-5 mt-5">
          <label htmlFor="name" className="text-white">
            Name
          </label>
          <input
            type="text"
            name="name"
            id="name"
            value={user.name}
            onChange={handleOnChange}
            required
            className="p-2 border border-gray-700 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col gap-5 md:mt-5">
          <label htmlFor="email" className="text-white">
            Email
          </label>
          <input
            type="email"
            name="email"
            id="email"
            value={user.email}
            onChange={handleOnChange}
            required
            className="p-2 border border-gray-700 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="password" className="text-white">
            Password
          </label>
          <input
            type="password"
            name="password"
            id="password"
            value={user.password}
            onChange={handleOnChange}
            required
            className="p-2 border border-gray-700 rounded-md outline-none"
          />
        </div>
        <div className="flex flex-col gap-5 ">
          <label htmlFor="profile" className="text-white">
            Profile Picture
          </label>
          <input
            type="file"
            name="profile"
            accept="image/*"
            id="profile"
            onChange={handleImageChange}
            required
            className="p-2 border border-gray-700 rounded-md outline-none text-white"
          />
        </div>
        <div>
          <button
            type="submit"
            className="p-2 mx-2 md:mx-0 bg-primary text-white rounded-lg"
          >
            SignUp
          </button>
        </div>
      </form>
    </div>
  );
};

export default Signup;
