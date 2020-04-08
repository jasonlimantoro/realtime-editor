import express from "express";
import draft from "./draft";
import auth from "./auth";
import { jwt } from "@app/lib/middleware";

const router = express.Router();

router.use("/auth", auth);
router.use("/drafts", jwt(), draft);

export default router;
