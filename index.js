import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import {MONGO_USER , MONGO_PASSWORD , MONGO_IP , MONGO_PORT, REDIS_URL, SESSION_SECRET, REDIS_PORT } from "./config/config.js";
import postRouter from "./routes/postRoutes.js";
import userRouter from "./routes/userRoutes.js";
import {createClient} from "redis";
import { RedisStore } from "connect-redis";
import session  from "express-session";
import cors from "cors";



const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());
app.use(bodyParser.urlencoded({ extended: true }));

const mongoURL = `mongodb://${MONGO_USER}:${MONGO_PASSWORD}@${MONGO_IP}:${MONGO_PORT}/?authSource=admin`
const connectWithRetry = ()=>{
    mongoose.connect(mongoURL
    ).then(()=> console.log("Succesfully connected to DB")).catch((error)=>{
        console.log(error);
        setTimeout(connectWithRetry , 5000);
    });
};

connectWithRetry();
app.use(cors({}));

let redisClient = createClient({
  url: `redis://${REDIS_URL}:${REDIS_PORT}`,
});


redisClient.on('error', (err) => {
  console.error(' Redis error:', err);
});

(async () => {
  try {
    await redisClient.connect();
    console.log(" Redis client connected");
  } catch (err) {
    console.error(" Redis connection error:", err);
  }
})();



app.use(session({
    store: new RedisStore({client: redisClient}),
    secret: SESSION_SECRET,
    resave: false,            
    saveUninitialized: false, 
    cookie: {
        secure:false,
        httpOnly:true,
        maxAge: 60000
    }
}));

//expresss methods
app.get("/api/v1", (req , res) =>{
    //send HTML file
    res.send("<h1>Done and Happy gentlemen@</h1>"); 
    console.log("Yeah it Ran bitches");
});


app.use("/api/v1/posts" , postRouter);
app.use("/api/v1/users" ,  userRouter);


app.listen(port, () => {
    console.log(`Server running on port: ${port}`);
});