require('dotenv').config();
const express = require('express');
const app = express();

app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: true }));
app.use(express.static('public'));

const productRoutes = require('./routes/productRoutes');
app.use('/', productRoutes);

app.listen(3000, () => {
    console.log("http://localhost:3000");
});