require('dotenv').config();
const mongoose = require('mongoose');
const cors = require('cors');
const express = require('express');
const PORT = process.env.PORT || 5001;
const { logger } = require('./middleware/logEvents');
const errorHandler = require('./middleware/errorHandler');
const connectDB = require('./config/dbConn');
const cookieParser = require('cookie-parser');
const corsOptions = require('./config/corsOptions');
const app = express();


//Add database

connectDB();

app.use(logger);
app.use(cors(corsOptions));
app.options(/.*/, cors(corsOptions));


app.use(express.urlencoded({ extended: false })); // form data
app.use(express.json()); // json


//Routes

app.use('/member', require('./routes/member'));

app.use(errorHandler);

mongoose.connection.once('open', () => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
        console.log(`Server running on Port ${PORT}`);
    });
});