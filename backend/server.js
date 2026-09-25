require('dotenv').config();
const express = require('express');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const app = express();
const db = require('./models');

//api route
const authRoutes = require('./routes/authRoute');
const profileRoutes = require('./routes/profileRoute');
const postRoutes = require('./routes/postRoute');
const commentRoutes = require('./routes/commentRoute');

app.use(express.json());

//open public for frontend
app.use('/uploads', express.static('uploads'));

//setup cookie
app.use(session({
    secret: process.env.JWT_SECRET || 'secret_jwt_key_123',
    store: new SequelizeStore({db: db.sequelize}),
    resave: false,
    saveUninitialized: false,
    cookie:{
        httpOnly: true,
        sameSite: 'strict',
        maxAge: 24*60*60*1000,
        secure: false
    }
}))

//filter routers
app.use('/api/auth',authRoutes);
app.use('/api/profile', profileRoutes);
app.use('/api/post',postRoutes);
app.use('/api/post/:id',commentRoutes);

//server->DB
db.sequelize.sync({ alter: true})
.then(()=>{
    console.log('db connected successfully!');
})
.catch((err)=>{
    console.log('fail to connect db:',err);
})

//xu ly input vao server (client->server)
const port = 3001;
app.listen(port,()=>{
    console.log('server listening at',port);
})