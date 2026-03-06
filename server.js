import express from "express";
import dotenv from "dotenv";
import { Redis } from "@upstash/redis";

dotenv.config();

const app = express();
app.use(express.json());

const redis = new Redis({
  url: process.env.UPSTASH_REDIS_REST_URL,
  token: process.env.UPSTASH_REDIS_REST_TOKEN
});

app.post("/book", async (req, res) => {

  const seat = req.body.seat;

  const lock = await redis.set(seat, "locked", {
    nx: true,
    ex: 30
  });

  if (!lock) {
    return res.json({ message: "Seat already booked" });
  }

  res.json({ message: "Seat booked successfully" });

});

app.get("/", (req,res)=>{
  res.send("Server is working");
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});