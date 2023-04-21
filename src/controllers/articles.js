const firebase = require('../config')
const db = firebase.firestore()
const blog = db.collection('cl_blog')

exports.createArticle = async (req, res) => {
    const data = req.body

    const checkinData = {
        author: data?.author,
        content: data?.content,
        creationDate: new Date(),
        image: data?.image,
        subtitle: data?.subtitle,
        title: data?.title,
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
            await blog.doc(id).update(data)
            res.status(201).send({ status: 1, msg: 'Atualizado com sucesso' })
        } catch (error) {
            res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
        }
    }
exports.listarCheckIn = async (req, res) => {
    try {
        const listParking = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }))
        const formatedDate = listParking.map((doc) => ({
            id: doc.id,
            hrEntrada: new Date(doc.hrEntrada.seconds * 1000).toLocaleString('pt-BR', {
                timeZone: 'America/Sao_Paulo'
            }),
            hrSaida: doc.hrSaida,
            isParking: doc.isParking,
            emailFuncionario: doc.emailFuncionario,
            valorFinal: doc.valorFinal,
            car: {
                placa: doc.placa,
                modelo: doc.modelo,
                cor: doc.cor
            }
        }))
        res.status(201).send({ status: 1, data: formatedDate })
    } catch (error) {
        res.status(500).send({ status: 0, msg: 'Algo deu errado.', error: error })
    }
}