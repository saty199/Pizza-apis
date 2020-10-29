const express = require('express');
const cookieParser = require('cookie-parser');
const bodyparser = require('body-parser');
const morgan = require('morgan');
const Promise = require('bluebird')
const cors = require('cors');
const mongoose = Promise.promisifyAll(require("mongoose"));
const flash = require('connect-flash');
const Config = require('./config');
const Routes = require('./Routes/index');
const multer = require('multer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 4000;


app.use(bodyparser.urlencoded({ extended: false }));
app.use(bodyparser.json());
app.use(morgan('dev'));
app.use(cors());
app.options("*", cors());
app.use(cookieParser());
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(flash());
app.use('/uploads', express.static(path.join(__dirname, '/public')));


mongoose.set('useCreateIndex', true);
mongoose.connect(Config.DB, { useNewUrlParser: true, useUnifiedTopology: true }, function (err) {
    if (err) console.log(err);
    console.log("database is connected");
});



app.get('/', function (req, res) {
    res.status(200).send(`Welcome to pizza application APIs`);
});

app.use('/api', Routes);

app.listen(PORT, () => console.log(`Server is running at ${PORT}`));