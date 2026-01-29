Database -Mongodb Atlas .(Linked to my test account)
Redis (Linked into my Test Account) 
everything in cloud so no hassle in configuration



How to run
...........

cd ride-hailing-system

api-service

cd api-service
npm install
node src/server.js



worker-service

cd ../worker-service
npm install
node src/worker.js

API requests


use postman or something

http://localhost:5000

Add driver 

POST /drivers
{
  "name": "Alex"
}

Create Driver

POST /rides
{
  "riderId": "r1",
  "pickup": "Edappally",
  "drop": "MG Road"
}

Worker automatically:

Picks available driver

Updates ride status to ASSIGNED


check status
GET /rides/:id (ride's mongodb id here)



