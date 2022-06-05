import express from "express";
import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Address } from "../services/mongodb/models/Address";
import { User } from "../services/mongodb/models/User";

const router = express.Router();

/*
type: POST
body: name descripion 
path: /address/add
Route to add an address
*/

router.post(
  "/add",
  isAuthenticated,
  body("housenumber").isLength({ min: 1 }),
  body("fulladdress").isLength({ min: 1 }),
  body("landmark").isLength({ min: 1 }),
  body("pincode").isPostalCode("IN"), 
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        return res.json({
          data: {
            address: null,
            success: false,
          },
          message: "validation failed",
        });

      const user = req.user;
      console.log(user)
      const { housenumber, fulladdress, landmark, pincode } = req.body;
      const address = new Address({ housenumber, fulladdress, landmark, user, pincode });

      await address.save();

      //address is saved and modify it inside the user doc
      //find the user and then pass the feild which needs to be updated
      //get the previous arry and push it to(append the new array) previous arry and then bring everything together

      //addtoset adds an entity to a set. it add the address to the new address id to my address arrray
      //set means it cannpot be duplicates
      console.log(User)
      await User.findOneAndUpdate(
        { _id: user },
        {
          $addToSet: { addresses: address._id },
        }
      );

      return res.json({
        data: {
          address,
          success: true,
        },
        message: "Address added",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          category: null,
          success: false,
        },
        message: error.message,
      });
    }
  }
);

export default router;
