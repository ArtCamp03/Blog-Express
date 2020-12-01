Esse Projeto foi deito para pratica de desenvolvimento web
ultiliza :
- HTML
- JS
- Node Js
- Express
- Handlebars
- Mongo BD

//instalaçoes:

sequelize -> npm install --save sequelize
Express -> npm install --save express (modulo mysql) => npm install --save mysql2
Handlebars -> npm install --save express-handlebars  (so funciona no handlebars@4.5.3)
bodyParser -> npm install --save body-parser
mongoose -> npm install --save mongoose (manipulaçao do mongo)
session -> npm install --save express-session   //session para tratar as requisiçoes
flash -> npm install --save connect-flash       //tipo de seçao qe so aparece uma vez
bcryptjs -> npm install --save bcryptjs         //para encriptar
passport -> npm install --save passport         //para validaçao de senhas
passport -> npm install --save passport-local   //local e a estrategia ultilizada


Um exemplo na rota principal...:

app.get("/", eAdmin , (req,res)=>{
    const User1 = {
        nome: req.user.nome,
        email: req.user.email,
        senha: req.user.senha,
        eAdmin: req.user.eAdmin   }        

    Postagem.find().populate("categoria").lean().then((postagens)=>{
            res.render("index", {postagens: postagens, UsuarioLogado: User1})
    }).catch((err)=>{
        req.flash("error_msg", "Erro ao tentar buscar as postagens")
        res.redirect("/admin/postagens")
    })
    
})

depois la na view eh so usar o User logado:

{{#if UsuarioLogado}}

<h3>Nome do User Logado: {{UsuarioLogado.nome}} </h3>
<h3>Email do User Logado: {{UsuarioLogado.email}} </h3>

{{/if}}


