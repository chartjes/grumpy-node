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
    var fs = require('fs');
    var currentData = fs.readFile('./test/fixtures/current', 'utf8', function(err, data) { 
      if (err) { throw err; }
      return data;
    });
    request(app)
      .get('/transactions/current')
      .expect(currentData, done);
  });
});

