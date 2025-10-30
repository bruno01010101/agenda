const mongoose = require('mongoose');
const validator = require('validator');
const contatoSchema = new mongoose.Schema({
    nome: {type: String, required: true},
    sobrenome: String,
    email: String,
    telefone: String,
    userId: { type: mongoose.Schema.Types.ObjectId, required: true },
    criadoEm: { type: Date, default: Date.now }
})

const contatoModel = mongoose.model('contatos', contatoSchema);
class Contato {
    constructor(body){
        this.body = body,
        this.erros = [];
        this.contato = null
    }

    async criaContato(){
        this.validar();
        if (this.erros.length > 0) return
        this.contato = await contatoModel.create(this.body);
    }

    validar(){
        this.limpar();
        if (!this.body.nome){
            this.erros.push('E necessário colocar um nome');
            return
        }
        if (!validator.isEmail(this.body.email) && !this.body.telefone){
            this.erros.push('E necessário colocar pelo menos o telefone ou email')
        }
    }

    limpar(){
        for (let i in this.body){
            if (typeof (this.body[i]) !== 'string'){
                this.body[i] = '';
            } 
        }

        this.body = {
            nome: this.body.nome,
            sobrenome: this.body.sobrenome,
            email: this.body.email,
            telefone: this.body.telefone,
            userId: this.body.userId
        }
    }

    async edit(di){
        this.validar();
        if (this.erros.length > 0) return
        await contatoModel.findByIdAndUpdate(di , this.body);
    }

    static async buscaId(id){
        if (typeof(id) !== 'string') return;
        const contato = await contatoModel.findById(id);
        return contato;
    }


    static async buscarContato(id){
        const contatos = await contatoModel.find({ userId: id})
            .sort({ criadoEm: -1 })
        return contatos;
    }

    static async apagar(id){
        if (typeof(id) !== 'string') return;
        await contatoModel.findByIdAndDelete(id);
    }
}

module.exports = Contato;