const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
require('../models/usuario')
const Usuario = mongoose.model("usuarios")
const bcrypt = require('bcryptjs')
const passport = require('passport')
const eAdmin = require('../helpers/eAdmin')

router.get('/cadastro', (req, res) =>{
    res.render('usuarios/cadastro')
})

router.post('/cadastro', (req, res) => {
    var erros = []

    if(!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null){
        erros.push({texto:"Nome invalido"})
    }

    if(!req.body.email || typeof req.body.email == undefined || req.body.email == null){
        erros.push({texto:"Email invalido"})
    }

    if(!req.body.senha || typeof req.body.senha == undefined || req.body.senha == null){
        erros.push({texto:"Senha invalida"})
    }

    if(req.body.senha.length < 3 ){
        erros.push({texto:"Senha pequena"})
    }

    if(req.body.senha != req.body.senha2 ){
        erros.push({texto:"Senhas diferentes "})
    }

    if(erros.length > 0){
        res.render('usuarios/cadastro', {erros: erros})
    }else{
        Usuario.findOne({email:req.body.email}).lean().then((usuarios) => {

            if(usuarios){
                req.flash('error_msg',"Conta ja existente com este email")
                res.redirect('/usuarios/cadastro')
            }else{
                const NovoUsuario = new Usuario({
                    nome: req.body.nome,
                    senha: req.body.senha,
                    email: req.body.email
                })

                bcrypt.genSalt(5, (erro, salt) => {
                    bcrypt.hash(NovoUsuario.senha, salt, (erro,hash) => {
                        if(erro){
                            req.flash('erros_msg', "nao foi possivel salvar o usuario")
                            res.redirect('/')
                        }

                        NovoUsuario.senha = hash

                        NovoUsuario.save().then(() => {
                            req.flash('success_msg', "Cadastro Concluido com Sucesso")
                            res.redirect('/')
                        }).catch((err) => {
                            req.flash('error_mag', "Nao foi possivel concluir o cadastro")
                            res.redirect('/cadastro')
                        })
                    })
                })
            }
        }).catch((err) => {
            //console.log(err)
            req.flash('error_msg', "Houve um erro interno")
            res.redirect('/')
        })
    }
})

router.get('/login', (req,res) => {
    res.render('usuarios/login')
})

router.post('/login', (req, res, next) => {
    passport.authenticate("local", {
        successRedirect: "/",
        failureRedirect: "/usuarios/login",
        failureFlash: true
    })(req, res, next);
})

router.get('/logout', (req, res) => {
    req.logout()
    req.flash('success_msg', "Deslogado com sucesso")
    res.redirect('/')
})

module.exports = router