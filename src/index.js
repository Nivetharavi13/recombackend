import express from "express";
import { connectDB } from "./services/mongodb/connectDB";
import userRoutes from "./routes/user";

const app = express();

const PORT = 8067;

//const DB_URI = 'HGFHGDFHADGA'

connectDB();
app.use(express.json());
app.use("/user", userRoutes);

app.get('/',(req, res)=> {
  res.send(`Server deployed to PORT : ${PORT}`)
})



app.listen(PORT, () => {
  console.log(`server listening to port ${PORT}`);
});
