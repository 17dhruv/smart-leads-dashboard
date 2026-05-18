import { Router } from "express";
import { authRouter } from "./auth.routes.js";
import { leadRouter } from "./lead.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      status: "ok"
    }
  });
});

apiRouter.use("/auth", authRouter);
apiRouter.use("/leads", leadRouter);
