import express from 'express'
import { body, validationResult } from 'express-validator'
import { isAuthenticated  } from '../services/middlewares/isAuthenticated';
import { isAdmin  } from '../services/middlewares/isAdmin';
import {Category} from '../services/mongodb/models/Category'
const router = express.Router();

/*
type: POST
body: name descripion 
path: /category/add
Route to add a category 
*/

router.post(
    "/add",
    isAuthenticated,
    isAdmin, 
    body("name").isLength({ min: 1 }),
    body("description").isLength({ min: 1 }),
    async (req, res) => {
      try {
        const { errors } = validationResult(req);
        console.log(errors);
        if (errors.length > 0)
          return res.json({
            data: {
              category: null,
              success: false,
            },
            message: "validation failed",
          });
  
        console.log(req.user);
        const {name, description} = req.body
      //from the isauthenticated middleware req.user has id in it 
    const category = new Category({name, description})

    await category.save()
    return  res.json({
        data: {
          category,
          success: true,
        },
        message: "Category added",
      });

      } catch (error) {
        console.log(error);
      return  res.json({
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
path: /category/all
Route to fetch a category 
*/

router.get(
    "/all",
   
    async (req, res) => {
      try {
      
     
    const categories = await Category.find({})

    return  res.json({
        data: {
          categories,
          success: true,
        },
        message: "Categories fetched",
      });

      } catch (error) {
        console.log(error);
      return  res.json({
          data: {
            categories: [],
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
path: /category/all
Route to delete the product
*/
//the problem occurs as products has categories in to it ........
//change the code 
router.delete(
    "/:id",
    isAuthenticated,
    isAdmin,
    async (req, res) => {
      try {
        const category = await Category.findOneAndDelete({_id:id});
  
        return res.json({
          data: {
            category,
            success: true,
          },
          message: "Category deleted",
        });
      } catch (error) {
        console.log(error);
        return res.json({
          data: {
            category: [],
            success: false,
          },
          message: error.message,
        });
      }
    }
  );
  

// /*
// type: UPDATE
// body: none
// path: /category/update
// Route to delete the product
// */

  
router.put(
    "/:id",
    isAuthenticated,
    isAdmin,
    async (req, res) => {
      try {
        const {id} = req.params
        const category = await Category.findOneAndUpdate({_id:id});
  
        return res.json({
          data: {
            category,
            success: true,
          },
          message: "Category updated",
        });
      } catch (error) {
        console.log(error);
        return res.json({
          data: {
            category: [],
            success: false,
          },
          message: error.message,
        });
      }
    }
  );



export default router

