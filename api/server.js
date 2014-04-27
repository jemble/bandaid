var express = require('express');
var events = require('./routes/events');

var app = express();

app.configure(function () {
    app.use(express.logger('dev'));
    app.use(express.bodyParser());
});

app.get('/api/events',events.findAll);
app.get('/api/events/:id',events.findById);
app.post('/api/events', events.addEvent);
app.put('/api/events/:id',events.updateEvent);
app.delete('/api/event/:id',events.deleteEvent);

app.listen(3000);
console.log('Listening on port 3000');