import express from "express";
import { connectDB } from "./services/mongodb/connectDB";
import userRoutes from "./routes/user";
import categoryRoutes from './routes/category'
import productRoutes from './routes/product'
import addressRoutes from './routes/address'
import orderRoutes from './routes/order'
const app = express();

const PORT = 8086;

//const DB_URI = 'HGFHGDFHADGA'

connectDB();
app.use(express.json());
app.use("/user", userRoutes);
app.use("/category", categoryRoutes);
app.use("/product", productRoutes);
app.use("/address", addressRoutes);
app.use("/order", orderRoutes);

app.get('/',(req, res)=> {
  res.send(`Server deployed to PORT : ${PORT}`)
})



app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
