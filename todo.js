const express = require('express');
const app = express();
const morgan = require('morgan');

const routes = require('./router/routes');

const path = require('path')
    
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(morgan('tiny'));

app.use(routes);
app.use('/public',express.static(path.join(__dirname, 'public')))
app.set('views', path.join(__dirname, 'views'));

app.use((req, res) => {
    res.send("404");
})

app.listen(6789 ,() => {
    console.log("Listening on https://localhost:6789/");
})
