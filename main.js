/**
 * Processo principal
 * Estudo do CRUD com MongoDB
 */


// Importação do módulo de conexão (database.js)
const { conectar, desconectar } = require('./database.js')

/**
 * Processo principal
 * Estudo do CRUD com o MongoDB
 */

//importação do modelo de dados de clientes
const clienteModel = require('./src/models/Clientes.js')

// Importação do pacote string-similarity para aprimorar a busca por nomes
const stringSimilarity = require('string-similarity')

//CRUD Create (função para adicionar um novo cliente)
const criarCliente = async (nomeCli, foneCli, cpfCli) => {
    try {
        const novoCliente = new clienteModel(
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpfCliente: cpfCli
            }
        )
        // a linha abaixo salva o dados do cliente no banco
        await novoCliente.save()
        console.log("Cliente adicionado com sucesso.")
    } catch (error) {
        // Tratamento de exceções específicas

        if (error.code = 11000) {
            console.log(`Erro: O CPF ${cpfCli} já está cadastrado`)
        } else {
            console.log(error)
        }
    }
}

// CRUD Read - Função para listar todos os clientes cadastrados
const listarClientes = async () => {
    try {
        // a linha abaixo lista todos os clientes cadastrados
        //const clientes = await clienteModel.find()

        // a linha abaixo lista todos os clientes cadastrados por ordem alfabética
        const clientes = await clienteModel.find().sort(
            {
                nomeCliente: 1
            }
        )
        console.log(clientes)
    } catch (error) {
        console.log(error)
    }
}

// CRUD Read - Função para buscar um cliente específico
// passado parâmetro nome, como pode ser alterado por cpf
const buscarCliente = async (nome) => {
    try {
        // find() buscar 
        // nomeCliente: new RegExp(nome, 'i') filtro pelo nome (partes que contenham(expressão regular))
        // 'i' insensitive (ignorar letras maiusculas ou minúsculas) 
        const cliente = await clienteModel.find(
            {

                nomeCliente: new RegExp(nome, 'i')
            }
        )
        // Calcular a similaridade entre os nomes retornados e o nome pesquisado
        const nomesClientes = cliente.map(cliente => cliente.nomeCliente)

        // validação (se não existir o cliente pesquisado)
        if (nomesClientes.length === 0) {
            console.log("Cliente não cadastrado")
        } else {
            const match = stringSimilarity.findBestMatch(nome, nomesClientes)

            // cliente com melhor similaridade
            const melhorCliente = cliente.find(cliente => cliente.nomeCliente === match.bestMatch.target)

            //formatação da data
            const clienteFormatado = {
                nomecliente: melhorCliente.nomeCliente,
                foneCliente: melhorCliente.foneCliente,
                cpfCliente: melhorCliente.cpfCliente,
                dataCadastro: melhorCliente.dataCadastro.toLocaleString('pt-BR')
            }
            //console.log(melhorCliente)

            console.log(clienteFormatado)
        }
        //console.log(cliente)
    } catch (error) {
        console.log(error)
    }

}

// CRUD Update - Função para alterar os dados de um cliente
// ATENÇÃO!!!! Obrigatoriamente o update precisa ser feito com base no ID

const atualizarCliente = async (id, nomeCli, foneCli, cpfCli) => {
    try {
        const cliente = await clienteModel.findByIdAndUpdate(
            id,
            {
                nomeCliente: nomeCli,
                foneCliente: foneCli,
                cpfCliente: cpfCli
            },
            {
                new: true,
                runValidators: true
            }
        )
        if (!cliente) {
            console.log("Cliente não encontrado")
        } else {
            console.log("Dados do clinte alterados com sucesso")
        }
    } catch (error) {
        console.log(error)
    }
}

//=========================================================

// CRUD Delete - Função para excluir um cliente
// ATENÇÃO !!! - Obrigatoriamente a exclusão ´feita pelo ID
const deletarCliente = async (id) => {
    try {
        // a linha abaixo exclui o client do banco de dados
        const cliente = await clienteModel.findByIdAndDelete(id)

        // validação
        if(!cliente){
            console.log("Cliente não encontrado")
        }else{
            console.log("Cliente deletado com sucesso")
        }

    } catch (error) {
        console.log(error)
    }
}


//=========================================================


// execução da aplicação

const app = async () => {
    await conectar()
    //await criarCliente("Leandro Ramos", "99999-0000", "142.222.444.02")
    //await criarCliente("Vitor de Assis Passos", "999999-0000", "142.222.444.01")
    //await criarCliente("Wellington R Cruz", "99999-0000", "142.222.444.03")
    //await criarCliente("Luiz Grilo", "99999-0000", "142.222.444.04")
    //await criarCliente("Thiago Lenda Apple", "99999-0000", "142.222.444.05")

    // CRUD Read - (Exemplo 1 - Listar clientes)
    //await listarClientes()

    // CRUD - Read (Exemplo 2 - buscar Clientes)
    //await buscarCliente("Vitor de Assis")
    //await atualizarCliente('67b90410f200a28a59dc2c7d', 'Vitor de Assis Passos', '(11) 9 4708-4137', '47957011803')
    //await buscarCliente("Vitor de Assis")
    await deletarCliente('67b90410f200a28a59dc2c7a')

    await desconectar()


}

console.clear()
app()

