import express from "express";
import cors from "cors";
import { MongoClient } from "mongodb";
import bcrypt from "bcrypt";
import jwt from 'jsonwebtoken';
import {Auth} from './Auth.js';

const MONGO_URL = "mongodb://127.0.0.1:27017";
const app = express();

async function connectionMongoDb() {
  const Client = new MongoClient(MONGO_URL);
  await Client.connect();
  console.log("Connected to the database");
  return Client;
}
//calling the func to connect
const client = await connectionMongoDb();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

//to show the message to front end
const message=[];
const postMessage=(data)=>{
    if(message!=''){
        message.pop()
    }
    message.push(data)
    return data;
}
//route for response message  
app.get('/signup',(req,res)=>{
    res.send(message)
})
app.post("/signup", async (req, res) => {
  const newUser = req.body;
  console.log("signup :",newUser)
  const Exist = await client
    .db("Food-App")
    .collection("userSignupDetails")
    .findOne({ username: newUser.username });
      if (Exist) {
    postMessage({ message: "UserAlready Exist" });
    return;
  }
  //rejex: are the validators
  if (
    !/^(?=.*[0-9])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#%&]).{6,}$/g.test(
        newUser.password
    )
  ) {
    postMessage({ message: "password pattern is not matching" });
    return;
  }
  const salt = await bcrypt.genSalt(10); //no of rounds of salt
  const hashedPassword = await bcrypt.hash(newUser.password, salt); //hashing the password
  const newUsers = {username:newUser.username, email: newUser.email, password: hashedPassword };
  const result = await client
  .db("Food-App")
  .collection("userSignupDetails")
    .insertOne(newUsers)
    postMessage({message:"Succefully Registerd",credential:result,data:newUsers})

    return result;
      }
    );
app.listen(8080, () => {
  console.log("Server started at the port 8080");
});


//route for response message  
app.get('/signin',(req,res)=>{
    res.send(message)
})
export const SECRET_KEY="Tamil@Secret-97-@379h3sbjb"

app.post("/signin", async (req, res) => {
    const user = req.body;
    console.log("signin :",user)
  const Exist = await client
    .db("Food-App")
    .collection("userSignupDetails")
    .findOne({ username:user.username });

    if(!Exist){
        postMessage({ message: "Invalid Data" });
        return;
    }
    const PasswordMatch=await bcrypt.compare(user.password,Exist.password)
    if(!PasswordMatch){
        postMessage({ message: "Invalid Data" });
        return;
    }
    const token=await jwt.sign(Exist,SECRET_KEY,{expiresIn:30000})
    postMessage({message:"LoggedIn Succeffully",jwtToken:token})
})
// app.use(Auth);
app.post('/user/profile',Auth,(req,res)=>{
    // console.log(req.body)
    res.send({message:"Token Verified",user:req.token})
})


//sending home data to client

app.get('/user/home',async(req,res)=>{
    const homeData=await client.db('Food-App').collection('HomePage').find({}).toArray()
    res.send(homeData)
    console.log(homeData);
})

























// //imported the modules
// import express from "express";
// import { MongoClient } from "mongodb";
// import cors from "cors";
// //creating instance for the module
// const app = express();
// //adding to a local server
// const MONGO_URL = "mongodb://127.0.0.1:27017";
// //using middileware functions
// app.use(express.json());
// app.use(cors());
// //creating the connection to the data base
// async function connectionMongoDb() {
//   const Client = new MongoClient(MONGO_URL);
//   await Client.connect();
//   console.log("Mongodb Connected");
//   return Client;
// }
// //calling the func to connect
// const client = await connectionMongoDb();
// //simple get request
// app.get("/", (req, res) => {
//   res.send("Hello world");
// });
// //to find the data precence in our data base
// app.get("/mobile", async (req, res) => {
//   const mobile = await client.db("Mobile").collection("data").find().toArray();
//   res.status(200).send(mobile);
// });
// //to add the data to a data base
// app.post("/mobile", async (req, res) => {
//   const mobile = req.body;
//   console.log(mobile);
//   const insertData = await client
//     .db("Mobile")
//     .collection("data")
//     .insertMany(mobile);
//   res.status(201).send("Added to the data base", insertData);
// });
// //checking the cart items
// app.put("/cart", async (req, res) => {
//   const cartItem = req.body;
//   const type = req.query.type;
//   const cartCheck = await client
//     .db("Cart")
//     .collection("data")
//     .findOne({_id:cartItem._id});
//   if (cartCheck) {
//     if (type === "decrement" && cartItem.noOfItems <= 1) {
//       await client
//         .db("Cart")
//         .collection("data")
//         .deleteOne({_id:cartItem._id});
//     } else {
//       await client
//         .db("Cart")
//         .collection("data")
//         .updateOne(
//           { _id: cartItem._id },
//           { $inc: { noOfItems: type === "increment" ? +1 : -1 } }
//         );
//     }
//   }else {
//   const cartAdd = await client
//   .db("Cart")
//   .collection("data")
//   .insertOne({ ...cartItem, noOfItems: 1 });
// res.status(200).send("Added", cartAdd);
// }
// });
// //listening to the port
// app.listen(8080, () => {
//   console.log("Server Started at the port 8080");
// });
















// app.post("/signup", async (req, res) => {
//   const { email, password } = req.body;
//   const Exist = await client
//     .db("")
//     .collection("new collection name")
//     .findOne({ email });

//   if (Exist) {
//     res.status(400).send({ message: "UserAlready Exist" });
//     return;
//   }
//   //rejex: are the validators
//   if (
//     !/^(?=.*[0-9])(?=.*[0-9])(?=.*[A-Z])(?=.*[a-z])(?=.*[@!#%&]).{6,}$/g.test(
//       password
//     )
//   ) {
//     res.status(400).send({ message: "password pattern is not matching" });
//     return;
//   }
//   const salt = await bcrypt.genSalt(10); //no of rounds of salt
//   const hashedPassword = await bcrypt.hash(password, salt); //hashing the password
//   const newUser = { email: email, password: hashedPassword };
//   const result = await client
//     .db("")
//     .collection("new collection name")
//     .insertOne(newUser)
//     res.send(result)
// });

// app.post("/signup", async (req, res) => {
//     const { email, password } = req.body;
//   const Exist = await client
//     .db("")
//     .collection("new collection name")
//     .findOne({ email });

//     if(!Exist){
//         res.status(400).send({ message: "Invalid Data" });
//         return;
//     }
//     const PasswordMatch=await bcrypt.compare(password,Exist.password)
//     if(!PasswordMatch){
//         res.status(400).send({ message: "Invalid Data" });
//         return;
//     }
//     // res.send({message:"Logged in Successfully"})

// })
