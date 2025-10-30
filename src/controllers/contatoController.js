const Contatos = require('../models/contatoModel');
exports.index = (req, res) =>{
    res.render('contato', {
        contato: {} // so para não dar erro na hora de cadastrar
    });
}

exports.register = async function(req, res){
    try{
        req.body.userId = req.session.user._id; 
        const contato = new Contatos(req.body);
        await contato.criaContato();

        if (contato.erros.length > 0){
            req.flash('errors', contato.erros);
            req.session.save(() => res.redirect('/contatos/index'));
            return;
        }

        
        req.flash('success', 'Contato cadastrado com sucesso!');
        req.session.save(() => res.redirect('/'));
    }
    catch(e){
        res.render('erro');
        console.log(e);
    }
}

exports.editIndex = async function(req, res){
    if (!req.params.id) return res.render('erro');
    const user = await Contatos.buscaId(req.params.id)
    if (!user) return res.render('erro');
    res.render('contato', {
        contato: user
    })
}

exports.edit = async(req, res) =>{
    try{
        if (!req.params.id) return res.render('erro');
        const contato = new Contatos(req.body);
        await contato.edit(req.params.id);

        if (contato.erros.length > 0){
            req.flash('errors', contato.erros);
            req.session.save(() => res.redirect(`/`));
            return;
        }

        req.flash('success', 'Contato editado com sucesso!');
        req.session.save(() => res.redirect('/'));
    }
    catch(e){
        res.render('erro');
        console.log(e);
    }
}

exports.delete = async(req, res) =>{
    try{
        if (!req.params.id) return res.render('erro');
        await Contatos.apagar(req.params.id);

        req.flash('success', 'Contato apagado com sucesso!');
        req.session.save(() => res.redirect('/'));
        return
    }
    catch(e){
        res.render('erro');
        console.log(e);
    }
}