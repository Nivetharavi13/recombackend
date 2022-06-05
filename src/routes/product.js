import express from "express";
import { body, validationResult } from "express-validator";
import { isAuthenticated } from "../services/middlewares/isAuthenticated";
import { isAdmin } from "../services/middlewares/isAdmin";
import { Product } from "../services/mongodb/models/Product";
const router = express.Router();

/*
type: POST
body: {name,description,stickerPrice,markedPrice,category,image,stock,color,compatibleWith
path: /product/add
Route to add a category 
*/

router.post(
  "/add",
  isAuthenticated,
  isAdmin,
  body("name").isLength({ min: 1 }),
  body("description").isLength({ min: 5 }),
  body("stickerPrice").isNumeric(),
  body("markedPrice").isNumeric(),
  body("image").isLength({ min: 5 }),
  body("stock").isNumeric(),
  body("color").isLength({ min: 1 }),
  async (req, res) => {
    try {
      const { errors } = validationResult(req);
      console.log(errors);
      if (errors.length > 0)
        return res.json({
          data: {
            Product: null,
            success: false,
          },
          message: "validation failed",
        });

  
      const {  name,
        description,
        stickerPrice,
        markedPrice,
        image,
        stock,
        color,
        category,
        compatibleWith } = req.body;
    
      const product = new Product({ name,
        description,
        stickerPrice,
        markedPrice,
        image,
        stock,
        color,
        category,
        compatibleWith });

      await product.save();
      return res.json({
        data: {
          product,
          success: true,
        },
        message: "Product added",
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
path: /product/all
Route to fetch a category 
*/

router.get(
  "/all",

  async (req, res) => {
    try {
      const products = await Product.find({}).populate('category');

      return res.json({
        data: {
          products,
          success: true,
        },
        message: "Products fetched",
      });
    } catch (error) {
      console.log(error);
      return res.json({
        data: {
          products: [],
          success: false,
        },
        message: error.message,
      });
    }
  }
);



/*
type: DELETE
body: none
path: /product/all
Route to delete the product
*/

router.delete(
    "/:id",
    isAuthenticated,
    isAdmin,
    async (req, res) => {
      try {
        const product = await Product.findOneAndDelete({});
  
        return res.json({
          data: {
            product,
            success: true,
          },
          message: "Products deleted",
        });
      } catch (error) {
        console.log(error);
        return res.json({
          data: {
            products: [],
            success: false,
          },
          message: error.message,
        });
      }
    }
  );
  

export default router;
