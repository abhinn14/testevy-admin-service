import jwt from "jsonwebtoken";
import type { Request, Response, NextFunction } from "express";

export const adminAuth = (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;
  if(!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({message:"No auth header."});
    return;
  }
  const token = authHeader.split(" ")[1];
  if(!token) {
    res.status(401).json({ message: "Token missing" });
    return;
  }

  try {
    const payload = jwt.verify(token, process.env.ADMIN_JWT_SECRET!) as { role: string };
    if(payload.role !== "admin") return res.status(403).json({ error: "Not an admin" });
    next();
  } catch {
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};
