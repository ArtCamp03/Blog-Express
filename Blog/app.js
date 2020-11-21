//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")       //Biblioteca usada para manipular formularios
const app = express()
const admin = require("./rotas/admin")
const path = require("path")
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const session = require("express-session")
const flash = require("connect-flash")
const moment = require('moment')
//Configuraçoes

//Data
app.use('handlebars', handlebars({
    defaultLayout: 'main',
    helpers: {
         formatDate: (date) => {
              return moment(date).format('DD/MM/YYYY')
          }
     }
}))

//session
app.use(session({
    secret: "cursoNode",
    resave: true,
    saveUninitialized: true
}))
//configurando flash
app.use(flash())

//middleware
app.use((req, res, next) => {
    //declaraçao de variaveis globais
    res.locals.success_msg = req.flash("success_msg")
    res.locals.error_msg = req.flash("error_msg")
    next()
})
//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;      //evita erros durante o processo
mongoose.connect("mongodb://localhost/blogapp").then(() => {
    console.log("Conectado Sucesso!!")
}).catch((err) => {
    console.log("Falha ao Conectar!!" + err)
})

//public
app.use(express.static('public'));

//middlewares
app.use((req, res, next) => {
    console.log("OI Eu sou um middleware")
    next();
})

//Rotas
app.get('/', (req, res) => {
    res.send("Rota Principal")
})

app.get('/posts', (req, res) => {
    res.send("Lista de Posts")
})

app.use('/admin', admin)

//Outros
const PORT = 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando!!")
})