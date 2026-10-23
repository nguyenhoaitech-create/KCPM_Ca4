const express = require("express");
const router = express.Router();
const surveyController = require("../controllers/surveyController");
const authMiddleware = require("../middlewares/authMiddleware");

router.get("/", authMiddleware.verifyToken, surveyController.getSurveys);
router.post("/", authMiddleware.verifyToken, surveyController.createSurvey);
router.delete(
  "/:id",
  authMiddleware.verifyToken,
  surveyController.deleteSurvey,
);

module.exports = router;
