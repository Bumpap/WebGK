const express = require('express');
const expressHandlebars = require('express-handlebars')
const app = express();
const expressWS = require('express-ws')(app);
const WsController = require('./controllers/ws-controller');

app.engine('handlebars', expressHandlebars({
	defaultLayout: 'main',
}))

app.set('views', './views');
app.set('view engine', 'handlebars');
app.use(express.static('public'));

app.get('/', (req, res) => {
    res.render('index');
})

app.ws('/chat', WsController)

const port = 3000;
app.listen(port, () => console.log(`App listening on ${port}`));