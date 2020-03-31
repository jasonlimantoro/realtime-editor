const express = require("express");
const { Draft } = require("../database/schema");

const router = express.Router();

router.get("/", async (req, res) => {
  const drafts = await Draft.find()
    .sort({ _id: -1 })
    .lean();
  res.json(drafts);
});

router.get("/:draftId", async (req, res) => {
  const draft = await Draft.findById(req.params.draftId).lean();
  res.json(draft);
});

router.delete("/:draftId", async (req, res) => {
  await Draft.findByIdAndRemove(req.params.draftId);
  res.send("Success");
});

module.exports.default = router;
