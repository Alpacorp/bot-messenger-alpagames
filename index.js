'use strcit'

const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');

const app = express();

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send(`
    <h1>Hola a Todos</h1>
    `);
});

app.get('/webhook', (req, res)=>{

    // res.status(200).json({
    //     Message: 'hola'
    // });

    const VERIFY_TOKEN = 'mitexto354645645AL3J0';

    const mode = req.query['hub.mode'];
    const token = req.query['hub.verify_token'];
    const challenge = req.query['hub.challenge'];

    if (mode && token) {
        if (mode === 'subscribe' && token === VERIFY_TOKEN) {
            console.log('Webhook verificado');
            res.status(200).send(challenge);
        }else{
            res.sendStatus(404);
        }
    }else{
        res.sendStatus(404);
    }

    // if (req.query['hub.verify_token'] === 'alpagames_token') {
    //     res.send(req.query['hub.challenge']);
    // }else{
    //     res.status(400).send('Alpagames dice que no tienes permisos');
    // }

    // ?hub.verify_token=mitexto354645645AL3J0&hub.challenge=CHALLENGE_ACEPTED&hub.mode=subscribe
});

app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () =>{
    console.log('Server running in port', app.get('port'));
});