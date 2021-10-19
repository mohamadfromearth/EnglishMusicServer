const express = require('express');
const router = require('express').Router();
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const winston = require('winston');
require("winston-mongodb");
require('express-async-errors');

const app = express();

const homeRoute = require('./routes/homeRoutes')
const api = require('./routes/api');

class Application{
    constructor() {
        this.setupExpressServer();
        this.setupMongoose();
        this.setUpRoutesAndMiddleWare();
    }
    setUpRoutesAndMiddleWare(){
        app.use(express.json());
        app.use(express.urlencoded({extended:true}));
        app.use(express.static('uploads'));
        app.use(homeRoute);
        app.use('/api',api);
        app.use(cors());
    }
    setupMongoose(){
        //'mongodb://localhost:27017/englishmusics'
        mongoose
            .connect('mongodb://root:sicCrZJfYuGqzH9U8Bu1avVX@englishmusic-db:27017/my-app?authSource=admin', {
                authSource:'admin',
                useNewUrlParser: true,
                useUnifiedTopology: true,
            })
            .then(() => {
                console.log('db connected');
                // winston.info('db connected');
            })
            .catch((err) => {
                console.error('db not connected', err);
            });
    }
    setupExpressServer(){
        const port =  3000;
        app.listen(port,(err)=>{
            if (err) console.log(err);
            else console.log(port);
        });
    }
}

module.exports = Application;