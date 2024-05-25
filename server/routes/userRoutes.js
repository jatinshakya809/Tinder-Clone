import express from "express";
import { Login, Signup, checkAuth } from "../controllers/userController.js";
import { verifyToken } from "../middleware/verifyToken.js";
import {
  addToDis,
  addToFav,
  getFromFav,
  getUser,
} from "../controllers/userContro.js";

const userRouter = express.Router();

userRouter.post("/signup", Signup);

userRouter.post("/login", Login);

userRouter.get("/checkAuth", verifyToken, checkAuth);

userRouter.get("/getUser", getUser);

userRouter.put("/addToFav/:id", verifyToken, addToFav);

userRouter.put("/addToDis/:id", verifyToken, addToDis);

userRouter.get("/getFromFav", verifyToken, getFromFav);

export default userRouter;
