To run this app

npm install  - in root directory 
then run 2 servers: 
1) node client - express client app on localhost:3000 
2) node server - will run backend server.In server console you will read messages that you send from client 

**Client side server:**

Express app with two forms:
 1) Allow to store messages that you want to echoAtTime in future into redis.
 2) Second form allow you to clean data from redis
 You will se Ok in server console - successful case.
 3) Interaction between server side and client  - implemented using redis-pub-sub

**Server side scheduler**
1) Receives messages from express app - redis-pub-sub
2) Store them to redis
3) Runs scheduled job - i.e timer  - which gets all data from redis every 10 sec
4) Parse data and compare it with current date  
5) In case if timeAt from message < current date server will print message to console 
and delete it from Redis


**Original task:**

Your task is to write a simple application server that prints a message at a given time in the future.
The server has only 1 API:
echoAtTime - which receives two parameters, time and message, and writes that message to the server console at the given time.
Since we want the server to be able to withstand restarts it will use redis to persist the messages and the time they should be sent at. 
You should also assume that there might be more than one server running behind a load balancer (load balancing implementation itself does not need to be provided as part of the answer).
In case the server was down when a message should have been printed, it should print it out when going back online.
The application should be written in node.js. The focus of the exercise is the efficient use of redis and its data types as well as seeing your code in action. 

