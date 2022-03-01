const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const connection = require("./database/database");
const apiindustriaabc = require("apiindustriaabc");

const maquinasController = require("./maquinas/MaquinasController");
const eventosController = require("./eventos/EventosController");
const Maquina = require("./maquinas/Maquina");
const Evento = require("./eventos/Evento");


//View engine
app.set("view engine", "ejs");

//Body-parser(para trabalhar com formulários)
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

//Static(configuração do express para trabalhar com arquivos estáticos-imgs, css, js no frontend, etc.)
app.use(express.static("public"));

//Database
connection
    .authenticate()
    .then(() => {
        console.log("Conexão com o bd feita com sucesso!");
    }).catch((error) => {
        console.log(error);
    });

//Configuração para o express usar as rotas em outros arquivos
app.use("/", eventosController);
app.use("/", maquinasController);

//Rota principal
app.get("/", (req, res) => {
    Maquina.findAll({
        order: [
            ['id','DESC']
        ],
        limit: 4
    }).then(maquinas => {
        Evento.findAll().then(eventos => {
            res.render("index", {maquinas: maquinas, eventos: eventos});
        });   
    });
});

//Rota para ver as máquinas
app.get("/:slug", (req, res) => {
    var slug = req.params.slug;
    Maquina.findOne({
        where:{
            slug: slug
        }
    }).then(maquina => {
        if(maquina != undefined){
            Evento.findAll().then(eventos => {
                res.render("maquina", {maquina: maquina, eventos: eventos});
            })          
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    })
});

//Rora para filtrar maquinas por seu status
app.get("/evento/:slug", (req, res) => {
    var slug = req.params.slug;
    Evento.findOne({
        where:{
            slug: slug
        },
        include: [{ model: Maquina}]
    }).then(evento => {
        if(evento != undefined){
            Evento.findAll().then(eventos => {
                res.render("index", {maquinas: evento.maquinas, eventos: eventos});
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});


//Porta
const PORT = process.env.PORT || 8086
app.listen(8086, () => {
    console.log("Servidor rodando na porta 8086.")
});
