const contato = require('../models/contatoModel');
exports.index = async function(req, res){
    if (!req.session.user){
        const contatos = [];
        res.render('index', {contatos});
        return;
    }

    const contatos = await contato.buscarContato(req.session.user._id);
    res.render('index', {contatos});
    return
}