const pg = require('pq');
var express = require('express');
var app = express();
var connectionString = "postgres://bonamango:teste1234@bonamango.postgresql.dbaas.com.br:5432/bonamango?ssl=true"

app.get('/db', function (request, response) {
  pg.connect(connectionString, function(err, client, done) {
    client.query('select CAST(teste AS character varying(10)) AS id, teste3 as name FROM test_table', function(err, result) {
      done();
      if (err)
        { console.error(err); response.send("Error " + err); }
      else
        { response.render('pages/db', {results: result.rows} ); }
    });
  });
});
