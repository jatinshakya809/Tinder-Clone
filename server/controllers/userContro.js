import { User } from "../db/models/userModel.js";

export const getUser = async (req, res) => {
  try {
    const users = await User.find({});
    if (!users) {
      return res.status(401).json({
        success: false,
        message: "Users not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Success",
      data: users,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const addToFav = async (req, res) => {
  try {
    const myId = req.id;
    const { id } = req.params;
    let user = await User.findByIdAndUpdate(
      { _id: myId },
      {
        $push: {
          favourites: id,
        },
      }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Added to Favourite",
      user,
    });
  } catch (error) {
    console.log("Error in AddToFav", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const addToDis = async (req, res) => {
  try {
    const myId = req.id;
    const { id } = req.params;
    let user = await User.findByIdAndUpdate(
      { _id: myId },
      {
        $push: {
          disliked: id,
        },
      }
    );
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "Added to Dislike",
      user,
    });
  } catch (error) {
    console.log("Error in AddToDis", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};

export const getFromFav = async (req, res) => {
  try {
    const myId = req.id;
    let user = await User.findById({ _id: myId }).populate({
      path: "favourites",
      select: "name email profile _id ",
    });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User Not Found",
      });
    }
    return res.status(200).json({
      success: true,
      message: "User Found",
      data: user.favourites,
    });
  } catch (error) {
    console.log("Error in getFromFav", error);
    return res.status(500).json({
      success: false,
      message: error.message || "Internal Server Error",
    });
  }
};
