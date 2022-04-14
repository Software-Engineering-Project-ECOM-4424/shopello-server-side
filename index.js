const app = require('./app');
var debug = require('debug')('debugOs');

const port = app.get('port');

var server = app.listen(port, function () {
    debug('Express server listening on port ' + server.address().port);
});

