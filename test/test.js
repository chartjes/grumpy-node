var app = require('../app');
var request = require('supertest');
var assert = require('assert');

describe('Transaction API', function() {
  it('GET /transactions/current should return 200', function(done) {
    request(app)
      .get('/transactions/current')
      .expect('Content-Type', /json/)
      .expect(200, done);
  });
  
  it('GET /transactions/current should return expected results', function(done) {
    var currentData = '';
    var fs = require('fs');
    var stream = fs.createReadStream('./test/fixtures/current');

    stream.on('data', function (data) {
      currentData += data;
    });
    stream.on('end', function () {
      request(app)
        .get('/transactions/current')
        .expect(currentData, done);
    });
  });
});

