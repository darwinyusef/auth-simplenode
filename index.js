const express = require('express');
const mongoose = require('mongoose');

const cors = require('cors');
var cookieParser = require('cookie-parser');

// content routes
const authRoutes = require('./src/routes/auth');
const dashboadRoutes = require('./src/routes/dashboard');
const verifyToken = require('./src/routes/validate-token');

const app = express();

// .env 
require('dotenv').config();


// Conexión a Base de datos
const uri = `mongodb+srv://${process.env.USER}:${process.env.PASSWORD}@cluster0.rbql1.mongodb.net/${process.env.DBNAME}?retryWrites=true&w=majority`;
mongoose.connect(uri,
    { useNewUrlParser: true, useUnifiedTopology: true }
)
    .then(() => console.log('Base de datos conectada'))
    .catch(e => console.log('error db:', e))

// middleware register

// Cors
app.use(cors());
app.use(cookieParser());

// json
app.use(express.json());
app.use(express.urlencoded({
    extended: true
}));

// public page
app.use(express.static(__dirname + 'public'));

// import routes
app.use('/api/user', authRoutes);
app.use('/api/dashboard', verifyToken, dashboadRoutes);

// route middlewares
app.get('/api', (req, res) => {
    res.json({
        estado: true,
        mensaje: 'Bienvenidos!'
    })
});

// iniciar server
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
    console.log(`servidor andando en: ${PORT}`)
})