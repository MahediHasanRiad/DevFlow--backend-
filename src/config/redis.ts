import { createClient } from "redis";

interface ValueType {
  username: string;
  password?: string;
  socket: {
    host?: string | undefined;
    port: number;
  };
}

const redisOptions:ValueType = {
  username: process.env.REDIS_USERNAME || "default",
  socket: {
    host: process.env.REDIS_HOST,
    port: Number(process.env.REDIS_PORT),
  },
};

if (process.env.REDIS_PASSWORD) {
  redisOptions.password = process.env.REDIS_PASSWORD;
}

const redis = createClient(redisOptions);

redis.on("error", (err) => console.error("Redis Client Error:", err));
redis.on("connect", () => console.log("Redis connecting..."));
redis.on("ready", () => console.log("Redis Client Ready & Connected"));
redis.on("end", () => console.log("Redis Client Disconnected"));

export const connectRedis = async (): Promise<void> => {
  try {
    if (!redis.isOpen) {
      await redis.connect();
    }
  } catch (error) {
    console.error("Failed to connect to Redis:", error);
    process.exit(1);
  }
};

export default redis;
