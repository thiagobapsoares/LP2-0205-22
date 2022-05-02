const multer = require('multer')

module.exports = (app)=>{

    //importar o config database
    var database = require('../config/database')
    //importar o model gallery
    var gallery = require('../models/gallery')

    //exibir o formulario gallery.ejs
    app.get('/gallery',async(req,res)=>{
        //conectar com o database
        database()
        //executar a busca de documentos da coleção gallery
        var documentos = await gallery.find()
        res.render('gallery.ejs',{dados:documentos})
    })

    //importar a config do multer
    var upload = require('../config/multer')
    //upload do arquivo
    app.post('/gallery',(req,res)=>{
        //upload das imagens
        upload(req,res,async (err)=>{
            if(err instanceof multer.MulterError){
                res.send("O arquivo é maior que 100kb")
            }else if(err){
                res.send('Tipo de Arquivo inválido')
            }else{
                //conectar ao database
                database()
                //gravar o nome do arquivo na coleção gallery
                var documento = await new gallery({
                arquivo:req.file.filename
                }).save()
                res.redirect('/gallery')

            }
        })
    })

     //abrir o formulário de exibição do documento selecionado
     app.get('/visualizar_gallery', async(req,res)=>{
        var id = req.query.id
        var acao = req.query.acao
        var ver = await gallery.findOne({_id:id})
        if(acao == "delete"){
            res.render("gallery_excluir.ejs", {dados:ver})
        }else if(acao == "update"){
            res.render("gallery_alterar.ejs", {dados:ver})
        }
    })

    //excluir o documento clicado
    app.post("/excluir_gallery", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //localizar e excluir o documento
        var excluir = await gallery.findOneAndRemove({_id:id})
        //voltar para a página gallery
        res.redirect("/gallery")
    })

     //excluir o documento clicado
     app.post("/excluir_gallery", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //localizar e excluir o documento
        var excluir = await gallery.findOneAndRemove({_id:id})
        //voltar para a página gallery
        res.redirect("/gallery")
    })
        
    //alterar o documento clicado
    app.post("/alterar_gallery", async(req,res)=>{
        //recuperar o id na barra de endereço
        var id = req.query.id
        //recuperar as informações digitadas
        var dados = req.body
        //localizar e alterar o documento
        var alterar = await gallery.findOneAndUpdate({_id:id},{titulo:dados.titulo,texto:dados.texto})
        //voltar para a página gallery
        res.redirect("/gallery")
    })
}