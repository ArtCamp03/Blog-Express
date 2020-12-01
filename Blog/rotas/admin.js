const express = require('express')
const router = express.Router()
const mongoose = require("mongoose")
const { EINPROGRESS } = require('constants')
const {eAdmin} = require("../helpers/eAdmin")

//carregar o models
require("../models/Categoria")
const Categoria = mongoose.model("categorias")
require("../models/Postagem")
const Postagem = mongoose.model("postagens")

router.get('/', eAdmin ,(req, res) => {
    res.render("admin/index")
})

router.get('/posts', eAdmin, (req, res) => {
    res.send("Pagina de Posts")
})

router.get('/categorias', eAdmin, (req, res) => {
    //modo find vai listar tds os ducumentos de categorias
    Categoria.find().lean().then((categorias) => {
        //passando as categorias para a pagina
        res.render("admin/categorias", { categorias: categorias })
    }).catch((err) => {
        req.flash("error_msg", "Houve um erro ao listar as categorias")
        res.redirect("/admin")
    })
})

router.get('/categorias/add', eAdmin,(req, res) => {
    res.render("admin/addcategorias")
})

router.post('/categorias/nova', eAdmin, (req, res) => {

    //montar  validaçoes
    var erros = []

    if (!req.body.nome || typeof req.body.nome == undefined || req.body.nome == null) {
        erros.push({ texto: "Nome invalido" })
    }
    if (!req.body.slug || typeof req.body.slug == undefined || req.body.slug == null) {
        erros.push({ texto: "Slug Invalido" })
    }

    if (req.body.nome.length < 2) {
        erros.push({ texto: "Nome da categoria é muito pequeno!" })
    }

    if (erros.length > 0) {
        res.render("admin/addcategorias", { erros: erros })
    } else {
        const novaCategoria = {
            nome: req.body.nome,
            slug: req.body.slug
        }
        new Categoria(novaCategoria).save().then(() => {
            req.flash('success_msg', 'Categoria criada com sucesso')
            res.redirect('/admin/categorias')
        }).catch((err) => {
            req.flash('error_msg', 'Houve um erro ao salvar a categoria' + err)
            res.redirect('/admin')
        })
    }
});

router.get("/categorias/edit/:id", eAdmin, (req, res) => {
    Categoria.findOne({ _id: req.params.id }).lean().then((categoria) => {
        res.render("admin/editCategoria", { categoria: categoria})
    }).catch((err) => {
        req.flash("error_msg", "Essa categoria nao existe")
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/edit", eAdmin,(req, res) => {
    Categoria.findOne({ _id: req.body.id}).then((categoria) => {
        categoria.nome = req.body.nome
        categoria.slug = req.body.slug

        categoria.save().then(() => {
            req.flash('success_msg', 'Categoria editada com sucesso')
            res.redirect("/admin/categorias")
        }).catch((err) => {
            req.flash('error_msg', 'Erro ao salvar ediçao')
            res.redirect("/admin/categorias")
        })
    }).catch((err) => {
        req.flash('error_msg', 'Erro na ediçao')
        res.redirect("/admin/categorias")
    })
})

router.post("/categorias/deletar", eAdmin, (req, res) => {
    Categoria.remove({ _id: req.body.id }).then(() => {
        req.flash("success_msg", "Categoria Deletada com Sucesso")
        res.redirect("/admin/categorias")
    }).catch((err) => {
        res.flash("error_msg", "Erro ao deletar categoria")
        res.redirect("/admin/categorias")
    })
})

router.get("/postagens", eAdmin,(req, res) => {
    Postagem.find().lean().populate("categoria").sort({ data: "desc" }).then((postagens) => {
        res.render("admin/postagens", { postagens: postagens })
    }).catch((erro) => {
        req.flash("error_msg", "Erro ao listar postagem")
        res.redirect('/admin')
    })
})

router.get("/postagens/add", eAdmin,(req, res) => {
    Categoria.find().lean().then((categorias) => {
        res.render("admin/addpostagens", { categorias: categorias})
    }).catch((err) => {
        req.flash("error_msg", "Erro ao carregar formulario")
        res.redirect("/admin")
    })
})

//defenindo postagens dentro do BD
router.post("/postagens/nova", eAdmin,(req, res) => {

    var erros = []

    if (req.body.categoria == "0") {
        erros.push({ texto: "Categoria Invalida" })
    }

    if (erros.length > 0) {
        res.render("admin/addpostagens", { erros: erros })
    } else {
        const novaPostagem = {
            titulo: req.body.titulo,
            descricao: req.body.descricao,
            conteudo: req.body.conteudo,
            categoria: req.body.categoria,
            slug: req.body.slug
        }

        new Postagem(novaPostagem).save().then(() => {
            req.flash("success_msg", "Postagem Criada com Sucesso")
            res.redirect("/admin/postagens")
        }).catch((err) => {
            req.flash("error_msg", "Erro ao Salvar")
            res.redirect("/admin/postagens")
        })
    }

})

router.get('/postagens/edit/:id', eAdmin,(req, res) => {
    Postagem.findOne({_id: req.params.id}).lean().then((postagem) => {     //linha de pesquisa
        Categoria.find().lean().then((categorias) => {
            res.render('admin/editpostagens',{categorias: categorias, postagem: postagem})
        }).catch((err) => {
            req.flash('error_msg', "Erro ao listar categorias")
            res.redirect('/admin/postagens')
        })
    }).catch((err) => {
        req.flash('error_msg', "Erro na ediçao")
        res.redirect('/admin/postagens')
    })
})

router.post('/postagens/edit', eAdmin, (req, res) => {
    Postagem.findOne({_id: req.body.id}).then((postagem) => {

        postagem.titulo = req.body.titulo
        postagem.slug = req.body.slug
        postagem.descricao = req.body.descricao
        postagem.conteudo = req.body.conteudo
        postagem.categoria = req.body.categoria

        postagem.save().then(() => {
            req.flash('success_msg', "Postagem editada com sucesso")
            res.redirect('/admin/postagens')
        }).catch((err) => {
            req.flash('error_msg', "Erro ao salvar psotagem")
            res.redirect('/admin/postagens')
        })

    }).catch((err) => {
        req.flash('error_msg', "Erro ao salvar a ediçao")
        res.redirect('/admin/postagens')
    })

})

//nao recomendado por se tratar de um rota get
router.get('/postagens/delete/:id', eAdmin,(req,res) => {
    Postagem.remove({_id: req.params.id}).then(() =>{
        req.flash('success_msg', "Postagem deletada com Sucesso")
        res.redirect('/admin/postagens')
    }).catch((err) => {
        req.flash('error_msg', "Erro ao deletar postagem")
        res.redirect('/admin/postagens')
    })
})

module.exports = router