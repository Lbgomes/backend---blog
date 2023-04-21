const express = require("express");
const router = express.Router()

const { createArticle, ListArticles, ListArticle, EditArticle } = require('../controllers/articles')

router.post("/", createArticle)
router.get("/", ListArticles)
router.get("/:id", ListArticle)
router.put("/:id", EditArticle)

module.exports = router;