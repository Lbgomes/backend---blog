const express = require("express");
const cors = require("cors");
const articlesRoutes = require('./src/routes')

const app = express();

app.use(express.json())
app.use(cors())

app.use(articlesRoutes)

app.listen(3030, () => {
    console.log('Aplicação rodando em http://localhost:3030')
})