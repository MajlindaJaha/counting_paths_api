import { Router, Request, Response } from "express";
import {
  countEqualXYPaths,
  countPaths,
} from "../countrollers/count.controller";

const router = Router();

router.post("/", (req: Request, res: Response) => {
  const { x, y } = req.body;

  if (typeof x !== "number" || typeof y !== "number") {
    return res.status(400).json({ message: "Invalid input" });
  }
  if (x === y) {
    const paths = countEqualXYPaths(x);
    res.json(paths);
  }
  const paths = countPaths(x, y);
  res.json(paths);
});

export default router;
