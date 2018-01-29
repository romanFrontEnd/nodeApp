const express = require( 'express' );
const http = require( 'http' );
const bodyParser = require('body-parser');


const redisPubSub = require( 'node-redis-pubsub' );
const options = { scope: 'development', port: 6379 };
const redPubSubClient = new redisPubSub( options );

const app = express();
app.use(express.static(__dirname + '/public'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.set( 'port', 3000 );

http.createServer( app ).listen( app.get( 'port' ), () => {
    console.log( 'You server is listening on port' + 3000 );
} );

//Middleware
app.use( '/echoAtTime', (req, res, next) => {
    if( req.body.date && req.body.message ) {
        const pdate = req.body.date;
        let dateTime = Date.parse( pdate );
        let message = req.body.message;
        redPubSubClient.emit( 'message', { command: 'add', timeAt: dateTime, message: message } );
        res.sendStatus(200);
    } else {
        next();
    }

} );

app.use( '/reset', (req, res, next) => {
    redPubSubClient.emit( 'message', { command: 'reset' } );
    next();
} );


app.use( (req, res, next) => {
    res.sendStatus( 404, "Page not found" );
} );