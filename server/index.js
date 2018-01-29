const redisPubSub = require( 'node-redis-pubsub' );
const options = { scope: 'development', port: 6379 };
const redPubSubClient = new redisPubSub( options );

const redis = require( 'redis' );
const RClient = redis.createClient();
const hashKeyBase = "printJobsHash";

const schedule = require( 'node-schedule' );
let i = 0; // id

//Subscription to client express app
redPubSubClient.on( "message", function (data) {
    if( data.command === 'add' ) {
        RClient.hmset( hashKeyBase + i, 'timeAt', data.timeAt, 'message', data.message, redis.print );
        i++;
        //console.log( "Put data to store timeAt=" + data.timeAt + " message=" + data.message );
    }
    if( data.command === 'reset' ) {
        //console.log("Clear all data from Redis store");
        RClient.flushdb( function (err, succeeded) {
            console.log( succeeded ); // will be true if FLUSH successfully
        } );
    }

} );

RClient.on( "error", function (err) {
    console.log( "Error " + err );
} );

// Scheduler task that runs every 5 sec and read from readis
schedule.scheduleJob( '*/10 * * * * *', function () {
    //console.log( 'The recurrent job runs every 5 sec! and get Data from Redis date = ' + new Date() );
    RClient.scan( 0, function (err, data) {
        for( let i = 0; i <= data.length; i++ ) {
            RClient.hgetall( hashKeyBase + i, function (err, reply) {
                if( err === null && reply !== null ) {
                    let timeOfMessage = new Date( parseInt( reply.timeAt ) );
                    if( Date.now() > parseInt( reply.timeAt ) ) {
                        console.log( " You receive message ad time:  " + timeOfMessage + " message: " + reply.message );
                        deleteItemFromRedis(hashKeyBase + i, Object.keys(reply));
                    }
                    //RClient.quit();
                }
            } );
        }

    } );
} );


function deleteItemFromRedis(hashKey, ...fields) {
    fields.forEach((filed)=>{
        RClient.hdel(hashKey,filed);
    });


}





