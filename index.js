const app = require('./app');
var debug = require('debug')('debugOs');

app.set('port', process.env.PORT || 3000);



const port = app.get('port');

var server = app.listen(port, function () {
    debug('Express server listening on port ' + server.address().port);
});

