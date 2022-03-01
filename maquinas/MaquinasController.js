const express = require("express");
const router = express.Router();
const Maquina = require("./Maquina");
const Evento = require("../eventos/Evento");
const slugify = require("slugify");
const res = require("express/lib/response");

router.get("/admin/maquinas", (req, res) => {
    Maquina.findAll({
        include:[{model: Evento}]
    }).then(maquinas => {
        res.render("admin/maquinas/index", {maquinas: maquinas})
    });
});

router.get("/admin/maquinas/new", (req, res) => {
    Evento.findAll().then(eventos => {
        res.render("admin/maquinas/new", {eventos: eventos});
    })    
});

router.post("/maquinas/save", (req, res) => {
    var nome = req.body.nome;
    var observacoes = req.body.observacoes;
    var body = req.body.body;
    var evento = req.body.evento;

    Maquina.create({
        nome: nome,
        slug: slugify(nome),
        observacoes: observacoes,
        body: body,
        eventoId: evento
    }).then(() => {
        res.redirect("/admin/maquinas");
    });
});

router.post("/maquinas/delete", (req, res) => {
    var id = req.body.id;
    if (id != undefined){
        if (!isNaN(id)){
            Maquina.destroy({
                where: {
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/maquinas");
            });
        }else{
            res.redirect("/admin/maquinas");
            }
        }else{
            res.redirect("/admin/eventos");
        }   
});

router.get("/admin/maquinas/edit/:id", (req, res)=> {
    var id = req.params.id;
    Maquina.findByPk(id).then(maquina => {
        if(maquina != undefined){
            Evento.findAll().then(eventos => {
                    res.render("admin/maquinas/edit", {eventos: eventos, maquina: maquina})
            });
        }else{
            res.redirect("/");
        }
    }).catch(err => {
        res.redirect("/");
    });
});

router.post("/maquinas/update", (req, res) => {
    var id = req.body.id;
    var nome = req.body.nome;
    var observacoes = req.body.observacoes;
    var body = req.body.body;
    var evento = req.body.evento;

    Maquina.update({nome: nome, observacoes: observacoes, body: body, eventoId: evento, slug: slugify(nome)}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/maquinas");
    })
});

router.get("/admin/maquinas/acompanhamento", (req, res) => {
    res.render("admin/maquinas/acompanhamento");
});

//rota para paginação
router.get("/maquinas/page/:num", (req, res) => {
    var page = req.params.num;
    var offset = 0;

    if (isNaN(page) || page == 1){
        offset = 0;
    }else{
        offset = (parseInt(page) - 1) * 4;
    }
    Maquina.findAndCountAll({
        limit: 4,
        offset: offset,
        order: [
            ['id', 'DESC']//ordena paginação pelo id
        ]
    }).then(maquinas => {
        var next;
        if(offset + 4 >= maquinas.count){
            next = false;
        }else{
            next = true;
        }
        var result={
            page: parseInt(page),
            next: next,
            maquinas: maquinas
        }
        Evento.findAll().then(eventos => {
            res.render("admin/maquinas/page", { result: result, eventos: eventos})
        })
    })
});

module.exports = router;