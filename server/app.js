const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');
const passport = require('passport');
const config = require('./DB.js');
const path = require('path');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);
const User = require('./api/models/user');
require('dotenv').config();

mongoose.Promise = global.Promise;
mongoose.connect(config.DB, { useNewUrlParser: true, useCreateIndex: true, useUnifiedTopology: true }).then(
    () => {console.log('Database is connected') },
    err => { console.log('Can not connect to the database'+ err)}
);

const store = new MongoDBStore({
    uri: config.DB,
    collection: 'sessions'
});

const productRoutes = require('./api/routes/products');
const userRoutes = require('./api/routes/users');
const imageRoutes = require('./api/routes/image');
const shopRoutes = require('./api/routes/shop');

app.use(passport.initialize());
require('./passport.js')(passport);

app.use(cors());
app.use('/uploads', express.static('uploads'));
app.use(bodyParser.json({limit: '50mb'}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: false}));
if (process.env.NODE_ENV === 'production') {
    app.use(express.static('client/build'));
    app.get('*', (req, res) => {
        res.sendFile(path.join(__dirname, 'client', 'build', 'index.html'));
    })
}

app.use(
    session({
        secret: 'my secret new',
        resave: false,
        saveUninitialized: true,
        store: store
    })
);

app.use((req, res, next) => {
    if(!req.session.user){
        return next();
    }
    console.log('req session...', req.session)
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next()
        })
        .catch(err => console.log(err));
});

app.use('/products', productRoutes);
app.use('/user', userRoutes);
app.use('/cart', shopRoutes);
app.use('/image/', imageRoutes);

app.use((req, res, next) => {
    const error = new Error('Not found');
    error.status = 404;
    next(error);
});

app.use((error, req, res, next) => {
    res.status(error.status || 500);
    res.json({
        error: {
            message: error.message
        }
    });
});

module.exports = app;