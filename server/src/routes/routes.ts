import authRoutes from "./auth.routes";
import interviewRoutes from "./interview.routes";
import { Router } from "express";

const routes = Router()

routes.use("/auth", authRoutes)
routes.use("/interview", interviewRoutes)

export default routes;