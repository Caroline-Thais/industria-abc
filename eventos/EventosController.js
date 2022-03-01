const express = require("express");
const Evento = require("./Evento");
const router = express.Router();
const slugify = require("slugify");
const res = require("express/lib/response");


router.get("/eventos", (req, res) => {
    res.send("Rota de eventos");
});

router.get("/admin/eventos/new", (req, res) => {
    res.render("admin/eventos/new");
});

router.post("/eventos/save", (req, res) => {
    var codigo = req.body.codigo;
    if(codigo != undefined){
        Evento.create({
            codigo: codigo,
            slug: slugify(codigo)
        }).then(() => {
            res.redirect("/admin/eventos");
        })
    }else{
        res.redirect("/admin/eventos/new");
    }
});

router.get("/admin/eventos", (req, res) => {
    Evento.findAll().then(eventos => {
        res.render("admin/eventos/index", {eventos: eventos});
    });   
});

router.post("/eventos/delete", (req, res) => {
    var id = req.body.id;
    if(id != undefined){
        if(!isNaN(id)){
            Evento.destroy({
                where:{
                    id: id
                }
            }).then(() => {
                res.redirect("/admin/eventos")
            });
        }else{
            res.redirect("/admin/eventos");
        }
    }
});

router.get("/admin/eventos/edit/:id", (req, res) => {
    var id = req.params.id;
    if(isNaN(id)){
        res.redirect("/admin/eventos");
    }
    Evento.findByPk(id).then(evento => {
        if(evento != undefined){
            res.render("admin/eventos/edit", {evento: evento});
        }else{
            res.redirect("/admin/eventos");
        }
    }).catch(error => {
        res.redirect("/admin/eventos");
    })
});

router.post("/eventos/update", (req, res) => {
    var id = req.body.id;
    var codigo = req.body.codigo;

    Evento.update({codigo: codigo, slug: slugify(codigo)}, {
        where:{
            id: id
        }
    }).then(() => {
        res.redirect("/admin/eventos");
    })
});

module.exports = router;