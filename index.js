const express = require('express');
const bodyParser = require('body-parser');
const request = require('request');
const access_token = "??";

const app = express();

app.use(express.json());

app.get('/', (req, res)=>{
    res.status(200).send(`
    <h1>Hola a todos desde el home</h1>
    `);
});

app.get('/webhook', (req, res)=>{

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

app.post('/webhook', (req, res)=>{
    const webhook_event = req.body.entry[0];
    if (webhook_event.messaging) {
        webhook_event.messaging.forEach(element => {
            // handleMessage(element)
            handleEvent(element.sender.id, element)
        });
    }
    res.sendStatus(200);
});

function handleMessage(event) {
    const senderId = event.sender.id;
    const messageText = event.message.text;
    const messageData = {
        recipient: {
            id: senderId
        },
        message: {
            text: messageText
        }
    };
    callSendApi(messageData);
};

function handleEvent(senderId, event) {
    if (event.message) {
        handleMessage(senderId, event.message)
    } else if (event.postback) {
        handlePostback(senderId, event.postback.payload)
    }
};

function handleMessage(senderId, event) {
    if (event.text) {
        defaultMessage(senderId)
    }
};

function defaultMessage(senderId) {
    const messageData = {
        "recipient": {
            "id": senderId
        },
        "message": {
            "text": "Hola soy alpabot de messenger, gracias por visitarnos"
        }
    }
    callSendApi(messageData);
};

function handlePostback(senderId, payload){
    switch (payload) {
        case "GET_STARTED_AlPAGAMES":
        console.log(payload);
        break;
    }
}

function callSendApi(response) {
    request({
        "uri": "https://graph.facebook.com/me/messages/",
        "qs": {
            "access_token": access_token
        },
        "method": "POST",
        "json": response
    },
    function (err) {
        if (err) {
            console.log('Ha ocurrido un error');
        }
        else{
            console.log('Mensaje enviado');
        }
    }    
)
}



app.set('port', process.env.PORT || 5000);

app.listen(app.get('port'), () =>{
    console.log('Server running in port', app.get('port'));
});