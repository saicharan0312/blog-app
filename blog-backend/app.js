const express = require('express');
const bodyParser = require('body-parser');
const blogRoutes = require("./routes/blogRoutes");
const profileRoutes = require("./routes/profileRoutes");
const mongoose = require('mongoose');

const app = express();

const url = "mongodb+srv://saicharan:yashodha@cluster0.wdscast.mongodb.net/"

app.use(bodyParser.json());

app.use('/api/blogs',blogRoutes);
app.use('/api/profile', profileRoutes);

mongoose
    .connect(url)
    .then(()=>{
        app.listen(5000);
    })
    .catch((err) => {
        console.log(err);
    });