const express = require("express");
const router = express.Router()
const multer = require("multer")
let upload = multer();
const Multer = multer({
    storage: multer.memoryStorage(),
    limit: 1024 * 1024
})

const { createArticle, ListArticles, ListArticle, EditArticle, uploadImage, RemoveArticle } = require('../controllers/articles')

router.post("/articles", Multer.single('imagem'), uploadImage, createArticle)
router.get("/articles", ListArticles)
router.get("/articles/:id", ListArticle)
router.put("/articles/:id", upload.fields([]),  EditArticle)
router.delete("/articles/:id", RemoveArticle)
module.exports = router;