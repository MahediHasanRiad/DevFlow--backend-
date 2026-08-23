export const queueConnection = {
  host: process.env.REDIS_HOST || "127.0.0.1",
  port: Number(process.env.REDIS_PORT) || 6379,
  password: process.env.REDIS_PASSWORD || undefined, // Add this line!
  username: process.env.REDIS_USERNAME || undefined, // Add if using ACL
};