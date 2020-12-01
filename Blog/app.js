//carregando modulos
const express = require('express')
const handlebars = require('express-handlebars')
const bodyParser = require("body-parser")       //Biblioteca usada para manipular formularios
const urlencodedParse = bodyParser.urlencoded({extended:false}); 
const app = express()
const admin = require("./rotas/admin")
const path = require("path")
const mongoose = require("mongoose")
const Schema = mongoose.Schema;
const session = require("express-session")
const flash = require("connect-flash")
const moment = require('moment');
const router = require('./rotas/admin');
const usuarios = require('./rotas/usuario');
const passport = require('passport');
require("./config/auth")(passport);

//Configuraçoes

//carregar o models
require("./models/Postagem")
const Postagem = mongoose.model("postagens")
require("./models/Categoria")
const Categoria = mongoose.model("categorias")

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

//inicializando passport
app.use(passport.initialize())
app.use(passport.session())

//configurando flash
app.use(flash());       //sempre abaixo da sessao

//middleware
app.use((req, res, next) => {
    //declaraçao de variaveis globais
    res.locals.success_msg = req.flash("success_msg");
    res.locals.error_msg = req.flash("error_msg");
    res.locals.error = req.flash("error")
    res.locals.user = req.user || null;
    next();
})

//Body-Parser
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())

//Handlebars
app.engine('handlebars', handlebars({ defaultLayout: 'main' }))
app.set('view engine', 'handlebars');

//Mongoose
mongoose.Promise = global.Promise;      //evita erros durante o processo
mongoose.connect("mongodb://localhost/blogap").then(() => {
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
    Postagem.find().lean().populate("categoria").sort({data: "desc"}).then((postagens) =>{
        res.render("index", {postagens: postagens})
    }).catch((err) => {
        req.flash('error_msg', "Erro interno")
        res.redirect("/404")
    })
})

//rota de Erro
app.get('/404', (req, res) =>{
    res.send("Erro 404")
})

app.get('/postagem/:slug',(req, res) => {
    Postagem.findOne({slug: req.params.slug}).lean().then((postagem) =>{
        if(postagem){
            res.render('postagem/index', {postagem: postagem})
        }else{
            req.flash('error_msg', "Postagem nao encontrada")
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg' ,"Houve um erro interno")
        res.redirect('/')
    })
})

app.get('/categorias', (req, res) => {
    Categoria.find().lean().then((categorias) =>{
        res.render('categorias/index', {categorias: categorias})
    }).catch((err) => {
        req.flash('error_msg', "Erro ao lsitar categorias")
        res.redirect('/')
    })
})

app.get('/categorias/:slug', (req, res) => {
    Categoria.findOne({slug: req.params.slug}).lean().then((categoria) => {
        if(categoria){
            Postagem.find({categoria: categoria._id}).lean().then((postagens) => {
                res.render('categorias/postagens', {postagens: postagens, categoria: categoria})
            }).catch((err) => {
                req.flash('error_msg', "Erro ao listar post")
                res.redirect('/')
            })
        }else{
            req.flash('error_msg', "Categoria nao encontrada")
            res.redirect('/')
        }
    }).catch((err) => {
        req.flash('error_msg', "Erro ao carregar")
        res.redirect('/')
    })
})

app.use("/admin", urlencodedParse, admin);
app.use('/usuarios', usuarios)

//Outros
const PORT = process.env.PORT || 8081
app.listen(PORT, () => {
    console.log("Servidor Rodando!!")
})