const localStrategy = require("passport-local").Strategy
const mongoose = require("mongoose")
const bcrypt = require("bcryptjs")

//model de usuario
require("../models/usuario")
const Usuario = mongoose.model("usuarios")

//configurando altentificaçao
module.exports = function (passport) {
    passport.use(new localStrategy({ usernameField: 'email', passwordField: "senha"}, (email, senha, done) => {

        Usuario.findOne({ email: email }).then((usuario) => {
            if(!usuario) {
                return done(null, false, { message: "Esta conta nao exite" })
            }
                bcrypt.compare(senha, usuario.senha, (erro, batem) => {

                if(batem){
                    return done(null, usuario)
                }else{
                    return done(null, false, { message: "senha incorreta" })
                }

            })
        })
    }))

    //salva os dados do usuario na sessao
    passport.serializeUser((usuario, done) => {
        done(null, usuario.id)
    })

    passport.deserializeUser((id, done) => {
        Usuario.findById(id, (err, usuario) => {
            done(err, usuario)
        })
    })

}