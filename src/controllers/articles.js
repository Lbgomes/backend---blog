const firebase = require('../config')
const db = firebase.firestore()
const blog = db.collection('cl_blog')
const { v4: uuidv4 } = require('uuid');
const admin = require("firebase-admin");
const serviceAccount = require("../admin-config.json");
var express = require('express')
var bodyParser = require('body-parser')

var app = express()

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

const imageId = uuidv4();
const BUCKET = "gs://blog-6715e.appspot.com"
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: BUCKET
});

const bucket = admin.storage().bucket();
exports.uploadImage = (req, res, next) => {
    if(!req.file) {
        return next(new Error('No file uploaded'))
    }
    
    const image = req.file
    const imageName = Date.now() +"." + image.originalname.split('.').pop()
    const file = bucket.file(imageName)
    const stream = file.createWriteStream({
        metadata: {
            contentType: image.mimetype,
        }
    })
    stream.on('error', (err) => {
        console.error(err)
    })
    stream.on('finish', async () => {
        try{
           
            await file.makePublic()
            req.file.firebaseUrl = `https://firebasestorage.googleapis.com/v0/b/blog-6715e.appspot.com/o/${imageName}?alt=media&token=${imageId}`
            next()
        } catch(err){
            console.error(err)
        }
        })

    stream.end(image.buffer)
}

exports.createArticle =  async (req, res) => {
    const {firebaseUrl} = req.file ? req.file : ""
    const {title, subtitle, content, author} = req.body
    console.log(req.body)
    const checkinData = {
        author: author,
        content: content,
        creationDate: new Date(),
        image: firebaseUrl,
        subtitle: subtitle,
        title: title,
    }

    if (
        checkinData.author === undefined ||
        checkinData.content === undefined ||
        checkinData.image === undefined ||
        checkinData.subtitle === undefined ||
        checkinData.title === undefined
    ) {
        res.status(400).send({ status: 0, msg: 'Uma ou mais informações enviadas não estão de acordo com o solicitado.' })
    } else {
        res.status(201).send({ status: 1, msg: 'Cadastrado com sucesso' })
        try {
            await blog.add(checkinData)
        } catch (error) {
            res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
        }
    }
}

exports.ListArticles = async (req, res) => {
    try {
        const snapshot = await blog.get()
        const articles = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const formatedData = articles.map((doc) => ({
            id: doc.id,
            author: doc.author,
            image: doc.image,
            title: doc.title,
            content: doc.content,
            subtitle: doc.subtitle,
            creationDate: new Date(doc.creationDate.seconds * 1000).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo'
            }),
        }))
        res.status(201).send({ status: 1, data: formatedData })
    } catch (error) {
        res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
        
    }
}

exports.ListArticle = async (req, res) => {
    try {
        
        const id = req.params.id
        const snapshot = await blog.doc(id).get()
        const article = snapshot.data()
        res.status(201).send({ status: 1, data: article })
    } catch (error) {
        res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })        
    }
    }

    exports.EditArticle = async (req, res) => {
        try {
        const id = req.params.id
        const data = req.body
        const updatedArticle = await blog.doc(id).update(data)
        console.log(id, data, updatedArticle)
            res.status(201).send({ status: 1, msg: updatedArticle })
        } catch (error) {
            res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
        }
    }

exports.RemoveArticle = async (req, res) => {
        try {
        const id = req.params.id
            await blog.doc(id).delete()
            res.status(201).send({ status: 1, msg: 'Deletado com sucesso' })
        } catch (error) {
            res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
        }
    }