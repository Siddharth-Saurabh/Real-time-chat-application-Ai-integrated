import Redis from "ioredis";

const redisClient = new Redis({
  host: process.env.REDIS_HOST, // without port
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASSWORD,
  tls: {},        // Required by Redis Cloud
  family: 4       // Force IPv4 to avoid ENOTFOUND due to IPv6 issues
});

redisClient.on("connect", () => {
  console.log("✅ Connected to Redis");
});

redisClient.on("error", (err) => {
  console.error("❌ Redis connection error:", err);
});

export default redisClient;
