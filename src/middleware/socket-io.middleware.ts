import { Socket } from "socket.io";
import jwt from "jsonwebtoken";

export const socketAuthMiddleware = (socket: Socket, next: (err?: Error) => void) => {
  try {
    const token = socket.handshake.auth?.token;

    if (!token) {
      return next(new Error("Authentication error: Token missing"));
    }

    const decoded = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY as string
    ) as { id: string };

    socket.data.userId = decoded.id;
    next();
  } 
  catch (error) {
    next(new Error("Authentication error: Invalid or expired token"));
  }
};