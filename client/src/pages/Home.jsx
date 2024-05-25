import React from "react";
import { Link } from "react-router-dom";
const Home = () => {
  return (
    <div className="flex justify-center items-center text-center flex-col h-[80vh] gap-8">
      <h1 className="text-4xl md:text-8xl text-white font-concertOne ">
        Try Something Epic...
      </h1>
      <Link
        to="/signup"
        className="bg-primary font-RopaSan text-xl text-white py-2 px-3 rounded-full hover:bg-primaryLight transition-all duration-300 ease-in-out"
      >
        Create Account
      </Link>
    </div>
  );
};

export default Home;
