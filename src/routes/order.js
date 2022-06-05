import express from "express";
import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { Address } from "../services/mongodb/models/Address";
import { User } from "../services/mongodb/models/User";
import { Order } from "../services/mongodb/models/Order";
import { isAdmin } from "../services/middlewares/isAdmin";
const router = express.Router();

/*
type: POST
body: address, user, products, total, status
path: /order/add
Route to add an address
*/

router.post(
  "/create",
  isAuthenticated,
  body("total").isNumber(),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        return res.json({
          data: {
            order : null,
            success: false,
          },
          message: "validation failed",
        });

      const user = req.user;
      console.log(user)
      const { address, products, total, status } = req.body;
      const order = new Order({ address, products, total, status, user });

      await order.save();

      //address is saved and modify it inside the user doc
      //find the user and then pass the feild which needs to be updated
      //get the previous arry and push it to(append the new array) previous arry and then bring everything together

      //addtoset adds an entity to a set. it add the address to the new address id to my address arrray
      //set means it cannpot be duplicates
      console.log(User)
      await User.findOneAndUpdate(
        { _id: user },
        {
          $addToSet: { orders: order._id },
        }
      );

      return res.json({
        data: {
          order,
          success: true,
        },
        message: "Order created",
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


/*
type: GET
body: none
path: /order/all
Route to fetch a category 
*/

router.get(
    "/all",
   isAuthenticated,
   isAdmin,
    async (req, res) => {
      try {
      
     
    const orders = await Order.find({})
    
    return  res.json({
        data: {
            orders,
          success: true,
        },
        message: "Orders created",
      });

      } catch (error) {
        console.log(error);
      return  res.json({
          data: {
           orders: [],
            success: false,
          },
          message: error.message,
        });
      }
    }
  );


  
/*
type: GET
body: none
path: /order/all
Route to users order 
*/
//route that returns users ordwers
router.get(
    "/me",
   isAuthenticated,
    async (req, res) => {
      try {
      
     const user = req.user
    const orders = await Order.find({_id:user})
    
    return  res.json({
        data: {
            orders,
          success: true,
        },
        message: "All Orders fetched",
      });

      } catch (error) {
        console.log(error);
      return  res.json({
          data: {
           orders: [],
            success: false,
          },
          message: error.message,
        });
      }
    }
  );

//edit and delete route for category and product --> pending 

export default router;
