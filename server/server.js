const express = require('express');
const path = require('path');
const Usuario = require('./model');
const colors = require('colors');
const bcrypt = require('bcrypt');
const bodyParser = require('body-parser');
const port = process.env.PORT || 3000;
const mongoose = require('mongoose');
const app = express();

//middlewares
    app.use(express.static(path.join(__dirname, '../public')));
    
    app.use(bodyParser.json());
    app.use(bodyParser.urlencoded({extended:false}));


//conexion y creacion de bse de datos agendaNodeNext
mongoose.connect('mongodb://localhost:27017/agendaNodeNext', { useUnifiedTopology: true, useNewUrlParser: true }, (err, res) => {

    if (err) throw err;

    console.log('Base de datos conectada'.yellow);

});

/////////////////////////////////////////////////
app.get('/', (req, res) => {});


app.get('/signup', (req, res) => {
    res.send('ok');
});



app.post('/signup', (req, res) => {
    let body = req.body;

    let usuario = new Usuario({
        usuario: body.user,
        password: bcrypt.hashSync(body.pass, 10),
    });

    usuario.save((err, usuario) => {
        if (err) {
            return res.status(400).json({
                ok: false,
                err
            });
        }

        //usuario.password = null;
        res.send("Creado");

    });
});

app.post('/login', (req, res) => {
    let body = req.body;

    Usuario.findOne({"usuario":`${body.user}`},function(err, result){
        if(err) throw err;    
        if(!result) res.send("Usuario y/o contraseña incorrectos"); 
        else {
            result.comparePassword(body.pass,(err,resultado)=>{
                if(err){
                    res.status(500).send('Error de autenticacion');
                }else if(resultado){
                    res.status(200).send('Validado');
                }else{
                    res.status(500).send('Usuario y/o contraseña incorrectos');
                }
            })
        }
    });
});





















/*

app.post('/signup',(req,res)=>{
const body = req.body;
const username = body.user;
const password= body.pass;
const usuario =new Usuario({username, password});


usuario.save(err=>{ 
    if(err){
        res.status(500).send('Error al registrar al usuario');
    }else{
        res.status(200).send('creado');
        }
    });
});

app.post('/login', (req,res)=>{
    const body = req.body;
    const nombre = body.user;
    const password= body.pass;
    const usuario =new Usuario();

    Usuario.findOne({ "username" :nombre},(err,usuario)=>{       
        if(err){
            res.status(500).send('Error al autenticar usuario');
        }else if(!usuario){
           
            res.status(500).send('El usuario no existe');
        }else{
            usuario.isCorrectPassword(password,(err, result)=>{
                if(err){
                    res.status(500).send('Error al autenticar usuario');
                }else if(result){
                    res.status(200).send('Validado');
                    
                }else{
                    res.status(500).send('Usuario o contraseña incorrecta');
                }
            });
        }
    });
});
*/


/*
app.post('/login',(req,res)=>{
 let body = req.body;   
let usuario = new Usuario({
    usuario: body.user,
   password: bcrypt.hashSync(body.pass, 10)
});

usuario.save((err, usuario) => {
    if (err) {
        return res.status(400).json({
            ok: false,
            err
        });
    }

    res.send('Validado');

});

});

*/





app.listen(port, () => {
    console.log(`Escuchando en el puerto ${port}`.blue);
});