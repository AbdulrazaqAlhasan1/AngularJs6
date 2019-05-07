const express = require('express');
const app = express();
const bodyParser = require("body-parser");

// CORS = Cross Origin Resource Sharing
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");

    if(req.method === "OPTIONS") {
        res.header("Access-Control-Allow-Methods", "GET, POST, PUT, PATCH, DELETE");
        return res.status(200).json({});
    }

    next();
});

// BODY Parser - enable to send data though POST BODY
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());

// http://localhost:port/api/products
const productRoutes = require("./routes/products.js");
app.use("/api/products", productRoutes);

// http://localhost:port/api/users
const userRoute = require("./routes/users.js");
app.use("/api/users", userRoute);


module.exports = app;
