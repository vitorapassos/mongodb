/**
 * Modelo de dados (coleção)
 * Clientes
 */


//importação da biblioteca
const { model, Schema } = require('mongoose')

//criação da estrutura de dados ("coleção") que sera usada no banco
const ClienteSchema = new Schema({
    nomeCliente: {
        type: String,
    },
    foneCliente: {
        type: String
    },
    cpfCliente: {
        type: String,
        unique: true,
        index: true
    },
    dataCadastro: {
        type: Date,
        default: Date.now
    }
}, { versionKey: false })
//importação do modelo de dados
//obs: Cliente será o nome da coleção (mongodb-> clientes)
module.exports = model('clientes', ClienteSchema)