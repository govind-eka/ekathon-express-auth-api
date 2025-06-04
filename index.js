import express from "express";
import manageAuthHandler from "./api/manage-auth";

const app = express();

app.use(express.json());

const router = express.Router();

router.get("/", (_req, res) => {
  res.send("Express is working");
});

router.all("/manage-auth", (req, res) => {
  manageAuthHandler(req, res);
});

app.use("/api", router);

export default app;
