exports.erro = function(e, req, res, next){
    console.log(e)
    next();
}

exports.csrf = (req, res, next) =>{
    res.locals.csrfToken = req.csrfToken();
    next();
}

exports.global = (req, res, next) =>{
    res.locals.errors = req.flash('errors');
    res.locals.success = req.flash('success'); 
    res.locals.user = req.session.user;
    next();
}

exports.logado = (req, res, next) =>{
    if (!req.session.user){
        req.flash('errors','É necessário estar logado');
        req.session.save(() => res.redirect('/'));
        return
    }
    next();
}

//O servidor guarda a sessão (dados do usuário) no banco.
//O cookie no navegador contém apenas o ID da sessão.
//Cada requisição envia o cookie, o servidor consulta a sessão pelo ID, e pronto: o usuário está autenticado.