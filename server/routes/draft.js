const express = require("express");
const { Draft } = require("../database/schema");

const router = express.Router();

router.get("/", async (req, res) => {
  const drafts = await Draft.find({}, { value: 0 })
    .sort({ _id: -1 })
    .populate("author", "-password")
    .lean();
  res.json(drafts);
});

router.post("/", async (req, res) => {
  const exisiting = await Draft.findById(req.body.id);
  if (!exisiting) {
    const draft = new Draft({ _id: req.body.id, author: req.user.sub });
    const result = await draft.save();
    return res.json(result);
  }
  res.status(204).send({});
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
