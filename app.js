const express = require('express');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');

const app = express();

//connect to mongoose
mongoose.connect('mongodb://localhost/brainstorm', {
    useMongoClient: true
})
    .then(() => console.log('MongoDB Connected...'))
    .catch(err => console.log(err));


//handlebars middleware
app.engine('handlebars', exphbs({ defaultLayout: 'main' }));
app.set('view engine', 'handlebars');



//Routing

//Index Route
app.get('/', (req, res) => {
    const title = 'Welcome One';
    res.render('index', { title: title });
});

//About Route
app.get('/about', (req, res) => {
    res.render('about');
})

const port = 5000;

app.listen(port, () => {
    console.log(`Server started on port ${port}`);
});