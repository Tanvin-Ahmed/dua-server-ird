const express = require("express");
const {
  getAllCategory,
  getCategoryNameByCatId,
  getAllInfoOfCategory,
} = require("../controllers/dua.controller");
const router = express.Router();

/* GET home page. */
router.get("/", function (req, res, next) {
  res.render("index", { title: "Express" });
});

router.get("/get-categories", getAllCategory);
router.get("/get-cat-name/:catId", getCategoryNameByCatId);
router.get("/get-all-by-category/:catId", getAllInfoOfCategory);

module.exports = router;
