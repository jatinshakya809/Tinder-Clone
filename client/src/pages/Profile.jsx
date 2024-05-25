import React, { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { IoHeartSharp, IoClose } from "react-icons/io5";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";

const Profile = () => {
  const { user } = useContext(AppContext);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [users, setUsers] = useState([]);
  const location = useLocation();

  const getUser = async () => {
    try {
      const res = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/getUser`
      );
      const data = res.data.data;
      if (user) {
        const filteredUser = data.filter(
          (u) =>
            user?._id !== u._id &&
            !user?.disliked?.includes(u._id) &&
            !user?.favourites?.includes(u._id)
        );
        setUsers(filteredUser);
      }
    } catch (error) {
      console.error("Error fetching users:", error);
    }
  };

  const nextProfile = () => {
    currentIndex < users?.length - 1 && setCurrentIndex(currentIndex + 1);
  };

  const addToFav = async (id) => {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/addToFav/` + id,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if (data.success === true) {
      toast.success(data.message);
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };
  const addToDis = async (id) => {
    const res = await axios.put(
      `${import.meta.env.VITE_BACKEND_URL}/api/addToDis/` + id,
      null,
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );
    const data = await res.data;
    if (data.success === true) {
      nextProfile();
    } else {
      toast.error(data.message);
    }
  };

  // useEffect(() => {
  //   getUser();
  // }, []);

  useEffect(() => {
    if (user) {
      getUser();
    }
  }, [user, location]);

  return (
    <div className="flex justify-center items-center my-16 md:my-20">
      <div className="rounded-lg shadow-primaryLight shadow-sm w-[85vw] h-[50vh] md:w-[30vw] md:h-[70vh] overflow-hidden relative">
        <img
          src={
            users[currentIndex]?.profile ||
            "https://i0.wp.com/digitalhealthskills.com/wp-content/uploads/2022/11/3da39-no-user-image-icon-27.png?fit=500%2C500&ssl=1"
          }
          alt={user[currentIndex]?.profile}
          className="rounded-lg object-cover w-full h-full transition-all duration-300 ease-in-out transform hover:scale-105 cursor-pointer"
        />
        <div className="absolute  bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black to-transparent">
          <h1 className="text-white text-xl font-semibold">
            {users[currentIndex]?.name || "For more user share with friend"}
          </h1>
          <p className="text-white text-sm">{users[currentIndex]?.email}</p>
          <div className="flex justify-between items-center mt-2">
            <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-red-500 p-2 transition-all duration-300 ease-in-out cursor-pointer hover:text-white">
              <IoClose
                onClick={() => {
                  addToDis(users[currentIndex]?._id);
                }}
                className="text-red-500 hover:text-white text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer"
              />
            </div>
            <div className="bg-gray-800 rounded-full overflow-hidden hover:bg-blue-500 p-2 transition-all duration-300 ease-in-out cursor-pointer hover:text-white">
              <IoHeartSharp
                onClick={() => {
                  addToFav(users[currentIndex]?._id);
                }}
                className="text-blue-500 hover:text-white text-3xl hover:scale-125 transition-all duration-300 ease-in-out cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
