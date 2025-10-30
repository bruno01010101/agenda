require('dotenv').config();
const express = require('express');
const app = express();
const mongoose = require('mongoose');
const mongoStore = require('connect-mongo');
const helmet = require('helmet');
const flash = require('connect-flash');
const session = require('express-session');
const csurf = require('csurf');
const routes = require('./routes');
const {erro, csrf, global} = require('./src/midlewares/midleware')
const conectionString = process.env.CONECTIONSTRING;
const PORT = process.env.PORT || 3000;

mongoose.set('strictQuery', false);
mongoose.connect(conectionString)
    .then(() =>{
        app.listen(PORT, () =>{
            console.log(`Servidor rodando na porta ${PORT}`);
        })
    })
    .catch((e) =>{
        console.log('Erro ao iniciar ', e);
    })

app.use(helmet());
app.use(express.urlencoded({extended: true}));
app.use(express.json());
app.use(express.static(__dirname + '/public'));

app.use(session({   //precisa de app.use
    secret: 'olhaumsegredinhoahahahah',
    saveUninitialized: false, // salva sessões que não forma modificadas
    resave: false,  // salva sessões vazias
    store: mongoStore.create({
        mongoUrl: conectionString
    }),
    cookie: {
        httpOnly: true,
        maxAge: 1000 * 60 * 24 * 5
    }
}));

app.use(csurf());   // adiciona a função req.csrfToken() ao objeto req.
app.use(csrf);
app.use(flash());
app.use(global);

app.set('views', __dirname + '/src/views');  
app.set('view engine', 'ejs');
app.use(routes);
app.use(erro);