import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import type { Request, Response } from "express";

export const adminLogin = async (req: Request, res: Response) => {
  const { username, password } = req.body;

  if (
    username !== process.env.ADMIN_USERNAME ||
    !bcrypt.compareSync(password, process.env.ADMIN_PASSWORD_HASH!)
  ) {
    return res.status(401).json({ error: "Invalid credentials" });
  }

  const token = jwt.sign(
    { role: "admin" },
    process.env.ADMIN_JWT_SECRET!,
    { expiresIn: "8h" }
  );

  res.json({ token });
};
