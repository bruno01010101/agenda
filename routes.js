const express = require('express');
const routes = express.Router();
const homeController = require('./src/controllers/homeController');
const loginController = require('./src/controllers/loginController');
const contatoController = require('./src/controllers/contatoController');
const {logado} = require('./src/midlewares/midleware');

routes.get('/', homeController.index);
routes.get('/login/index', loginController.index);
routes.post('/login/registro', loginController.register);
routes.post('/login/login', loginController.login);
routes.post('/login/logout', loginController.logout);

routes.get('/contatos/index', logado, contatoController.index);
routes.post('/contatos/register', logado, contatoController.register);
routes.get('/contato/index/:id',logado, contatoController.editIndex);
routes.post('/contatos/edit/:id', logado, contatoController.edit);
routes.post('/contatos/delete/:id', logado, contatoController.delete)

module.exports = routes;    