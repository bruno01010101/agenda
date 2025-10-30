const Login = require('../models/loginModel');
exports.index = (req, res) => {
    if(req.session.user){
        res.render('logado');
    }else{
        res.render('login');
    }
}

exports.register = async (req, res) =>{
    try{
        const login = new Login(req.body);
        await login.cadastra();

        if (login.erros.length > 0){
            req.flash('errors', login.erros);
            req.session.save(() => res.redirect('/login/index'));
            return;
        }

        req.flash('success', 'Usuário cadastrado com sucesso'); // O req.flash() coloca a mensagem dentro de req.session.flash.
        req.session.save(() => res.redirect('/login/index'));
    }catch(e){
        res.render('erro');
        console.log(e);
    }
}

exports.login = async(req, res) =>{
    try{
        const login = new Login(req.body);
        await login.logar();

        if (login.erros.length > 0){
            req.flash('errors', login.erros);
            req.session.save(() => res.redirect('/login/index'));
            return;
        }

        req.session.user = login.user;
        req.flash('success', 'Usuário logado com sucesso');
        req.session.save(() => res.redirect('/'));
    }catch(e){
        res.render('erro');
        console.log(e);
    }
}

exports.logout = function(req, res){
    req.session.destroy();
    res.redirect('/');
}