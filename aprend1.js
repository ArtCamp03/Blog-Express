const mongoose = require("mongoose")
const Schema = mongoose.Schema;

//configurando o Mongoose
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:8081/aprendendo', {

    useNewUrlParser: true
})
    .then(() => { console.log("Mongobd Conectado..."); })
    .catch((error) => {
        console.log("Houve um erro: " + error);
    })

//Model- Usuarios

//definindo model
//const UsuarioSchema = mongoose.schema({
const UsuarioSchema = new Schema({

    nome: {
        type: String,
        require: true
    },
    sobrenome: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    idade: {
        type: Number,
        required: true
    },
    pais: {
        type: String,
    }
})

//collection
mongoose.model('usuarios', UsuarioSchema)

const Victor = mongoose.model('usuarios')

new Victor({
    nome: "fernando",
    sobrenome: "barbosa",
    email: "fernando.ffw@gmail.com",
    idade: 31,
    pais: "Brasil"
}).save().then(() => {
    console.log("usuario criado com sucesso")
}).catch((err) => {
    console.log("Houve erro ao criar o usuario" + err)
})

// ".save" salva o usuario