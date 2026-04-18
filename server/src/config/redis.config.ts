import { createClient } from "redis";
import dotenv from "dotenv";
dotenv.config();

const REDIS_URL = process.env.REDIS_URL || "";

//
const client = createClient({
  url: REDIS_URL,
});

client.on("error", (err) => console.log("Redis Client Error", err));

export default client;
