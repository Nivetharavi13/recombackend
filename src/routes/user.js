import express from "express";
import bcrypt from "bcryptjs";
import User from "../services/mongodb/models/User"
import { validationResult, body } from "express-validator";

import { signJWT, verifyJWT  } from '../utils/index'
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";


const router = express.Router();

/*
type: POST
body: firstName, lastName, email, password 
path: /user/signup
Route to sign up a new user 
bcrypt --> to hash the password 
express validator --> to validate stuffs before sending it into databsae
body --> we getit from express validator 
*/

router.post(
  "/signup",
  body("firstName").isLength({ min: 1 }),
  body("lastName").isLength({ min: 1 }),
  body("password").isLength({ min: 1 }),
  body("email").isEmail(),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        return res.json({
          data: {
            user: null,
            success: false,
          },
          message: "validation failed",
        });

      const { firstName, lastName, email, password } = req.body;

      const salt = await bcrypt.genSalt(5);
      const hashedPassword = await bcrypt.hash(password, salt);

     
      const user = new User({
        firstName,
        lastName,
        email,
        password: hashedPassword,
      });
      
      console.log(user)
      await user.save();

      res.json({
        data: {
          user,
          success: true,
        },
        message: "user signed up successfully",
      });

      console.log(user);
    } catch (error) {
      console.log(error);
      res.json({
        data: {
          user: null,
          success: false,
        },
        message: error.message,
      });
    }
  }
);

/*
type: POST
body: email password
path: /user/login
Route to login a exsisting user  
*/

router.post(
  "/login",
  body("password").isLength({ min: 1 }),
  body("email").isEmail(),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        return res.json({
          data: {
            user: null,
            success: false,
          },
          message: "validation failed",
        });

      const { email, password } = req.body;
      //to check whether the user exsist in database or not
      const user = await User.findOne({ email });

      if (!user)
        return res.json({
          data: {
            token: null,
            success: false,
          },
          message: "user doesnt exsist",
        });
      // compare the password thing
      const isVerified = await bcrypt.compare(password, user.password);

      if (!isVerified)
        return res.json({
          data: {
            token: null,
            success: false,
          },
          message: "invalid password",
        });

      // verified user creates the jwt token

      const token = signJWT(
        {
          id: user._id,
          email: user.email,
          role: user.role,
        })
      console.log(token)
      await user.save();

      res.json({
        data: {
          token,
          success: true,
        },
        message: "user logged in successfully",
      });

      console.log(user);
    } catch (error) {
      console.log(error);
      res.json({
        data: {
          token: null,
          success: false,
        },
        message: error.message,
      });
    }
  }
);

/*
type : GET
path : /user/all
body : none
query: none
description: Route to get all users
*/

router.get(
  "/all",
  isAuthenticated,
  isAdmin,
  // !TODO make sure that only the admin can access this route
  async (req, res) => {
    try {
     
      const users = await User.find({ }).select("firstName lastName email orders addresses");

      return res.json({
        data: {
          users,
        },
        success: true,
        message: "Users fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          users: [],
        },
        success: false,
        message: error.message,
      });
    }
  }
);


router.get(
  "/profile/me",
  isAuthenticated,
  // !TODO make sure that only the admin can access this route
  async (req, res) => {
    try {
      const token = req.headers["authorization"].split(' ')[1];
      const { id } = verifyJWT(token)
   //   console.log(data)
     //we got the id from token 
     // console.log(token)
     
      const user = await User.findOne({_id:id})
     
   

      return res.json({
        data: {
          user,
        },
        success: true,
        message: "User profile fetched successfully",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          user: null,
        },
        success: false,
        message: error.message,
      });
    }
  }
);




module.exports = router;
