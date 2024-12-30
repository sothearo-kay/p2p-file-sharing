import { Router, Request, Response } from "express";

const router = Router();

router.get("/", home);

function home(req: Request, res: Response) {
  res.json({ text: "Hello, world!" });
}

export default router;
