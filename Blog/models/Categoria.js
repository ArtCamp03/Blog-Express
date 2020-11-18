const mongoose = require("mongoose")
const Schema = mongoose.Schema;

mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost:8081/aprendendo', {
    useNewUrlParser: true
})

const Categoria = new Schema({

    nome: {
        type: String,
        require: true
    },
    slug: {
        type: String,
        require: true
    },
    data: {
        type: Date,
        default: Date.now()
    }
})

mongoose.model("categorias", Categoria)