var app = require('../app');
var request = require('supertest');
var assert = require('assert');

describe('Transaction API', function() {
  it('GET /transactions/current should return 200', function(done) {
    request(app)
      .get('/transactions/current')
      .expect(200, done);
  });
});

