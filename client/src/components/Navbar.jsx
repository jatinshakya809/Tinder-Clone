import React, { useContext, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AppContext } from "../context/AppContext";
import { toast } from "react-hot-toast";
import axios from "axios";

const Navbar = () => {
  const { user, setUser } = useContext(AppContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    toast.success("LogOut Successfully");
    navigate("/");
    setUser(null);
  };

  const checkAuth = async () => {
    const res = await axios.get(
      `${import.meta.env.VITE_BACKEND_URL}/api/checkAuth`,
      {
        headers: { Authorization: `Bearer ${localStorage.getItem("token")}` },
      }
    );
    const data = await res.data;

    if (data.success === true) {
      setUser(data.data);
    }
  };

  useEffect(() => {
    checkAuth();
  }, []);

  return (
    <div className="bg-primary flex flex-col justify-between items-center px-5 py-3 md:flex-row">
      <div className="flex gap-3">
        <img
          src={user?.profile}
          alt={user?.name}
          width={40}
          height={30}
          className={`rounded-full shadow-inner ${
            user?.profile ? "block" : "hidden"
          }`}
        />
        <Link to={"/"} className="text-3xl font-concertOne text-white">
          CodeDate
        </Link>
      </div>
      {!user?.name ? (
        <ul className="flex font-RopaSan text-2xl gap-3 text-white">
          <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
            About
          </li>
          <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
            Download
          </li>
          <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
            Privacy
          </li>
        </ul>
      ) : (
        <ul className="flex font-RopaSan text-2xl gap-3 text-white">
          <Link
            to={"/profile"}
            className="hover:underline cursor-pointer transition-all duration-300 ease-in-out"
          >
            New
          </Link>
          <Link
            to={"/profile/chats"}
            className="hover:underline cursor-pointer transition-all duration-300 ease-in-out"
          >
            Chat
          </Link>
          <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
            Friends
          </li>
        </ul>
      )}
      {/* <ul className="flex font-RopaSan text-2xl gap-3 text-white">
        <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
          About
        </li>
        <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
          Download
        </li>
        <li className="hover:underline cursor-pointer transition-all duration-300 ease-in-out">
          Privacy
        </li>
      </ul> */}
      {!user?.name ? (
        <Link
          to={"/login"}
          className="px-5 py-1 font-RopaSan bg-white text-2xl rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
        >
          Login
        </Link>
      ) : (
        <button
          onClick={handleLogout}
          className="px-5 py-1 font-RopaSan bg-white text-2xl rounded-full text-black hover:bg-black hover:text-white transition-all duration-300 ease-in-out"
        >
          Logout
        </button>
      )}
    </div>
  );
};

export default Navbar;
