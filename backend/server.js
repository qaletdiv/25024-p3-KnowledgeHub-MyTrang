require('dotenv').config();
const express = require('express');
const app = express();
const db = require('./models');

app.use(express.json());

//server->DB
db.sequelize.sync({alter:true})
.then(()=>{
    console.log('db connected successfully!');
})
.catch((err)=>{
    console.log('fail to connect db:',err);
})

//xu ly input vao server (client->server)
const port = process.env.DB_PORT || 3001;
app.listen(port,()=>{
    console.log('server listening at',port);
})