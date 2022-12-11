import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
dotenv.config({
  path: `.env`
});

import { router } from "./routes";
import { Configs } from "./configs";

const app = express();
app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));

app.use("/api", router);

const mongodbConnectionString = `mongodb+srv://${Configs.mongo.host}`;

const mongoConnect = async () => {
  try {
    console.time("Connected in");
    await mongoose.connect(mongodbConnectionString, {
      dbName: `${Configs.mongo.db}`,
      useNewUrlParser: true,
      useUnifiedTopology: true,
      connectTimeoutMS: 15000,
      useCreateIndex: true
    });
    console.log("MONGODB: Connection OK");
  } catch (err) {
    console.log("MONGODB: Connection Error: ", err);
    process.exit(1);
  }
};

mongoConnect();

app.set("port", process.env.PORT || 8000);

app.get("/", (req, res) => {
    res.send({
      name: "E-Commerce-App",
      author: "Nitin-Sanatan"
    });
  });

const server = app.listen(app.get("port"), () => {
    console.log(`API Server running at http://localhost:${app.get("port")}`);
  });
  
export default server;