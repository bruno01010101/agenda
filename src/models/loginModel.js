const mongoose = require('mongoose');
const bcryptjs = require('bcryptjs');
const validator = require('validator');
const loginSchema = new mongoose.Schema({
    email: {type: String, required: true},
    senha: {type: String, required: true}
})

const loginModel = mongoose.model('usuarios', loginSchema);
class Login{
    constructor(body){
        this.body = body;
        this.user = null;
        this.erros = [];
    }

    async cadastra(){
        this.validar();
        if (this.erros.length > 0) return
        await this.thisUserExists();
        if (this.erros.length > 0) return
        const salt = bcryptjs.genSaltSync();
        this.body.senha = bcryptjs.hashSync(this.body.senha, salt);
        this.user = await loginModel.create(this.body);
    }

    async logar(){
        this.validar();
        if (this.erros.length > 0) return
        this.user = await loginModel.findOne({email: this.body.email});
        if (!this.user) {
            this.erros.push('usuário inexistente'); 
            return
        }
        if (!bcryptjs.compareSync(this.body.senha, this.user.senha)){
            this.erros.push('Senha inválida'); 
            this.user = null;
            // versatilidade do this.user
            return
        }
    }

    validar(){
        this.limpar();
        if (!validator.isEmail(this.body.email)) this.erros.push('email inválido.');
        if (this.body.senha.length > 30 || this.body.senha.length < 3){
            this.erros.push('A senha deve ter de 3 a 30 caracteres');
        }
    }

    limpar(){
        for (let i in this.body){
            if (typeof (this.body[i]) !== 'string'){
                this.body[i] = '';
            } 
        }

        this.body = {
            email: this.body.email,
            senha: this.body.senha
        }
    }

    async thisUserExists(){
        const achar = await loginModel.findOne({email: this.body.email});
        if (achar){
            this.erros.push('Usuário ja existe, por favor faça login ou crie outra conta.');
        }
    }
}

module.exports = Login;