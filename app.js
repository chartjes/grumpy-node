// Front controller for our API

var application_root = __dirname;
var express = require("express");
var path = require("path");
var pg = require('pg');
var app = express();
var model = require('./transactionmodel');

// Create our database connection
var connectionString = "pg://chartjes:@localhost:5432/ibl_stats";

pg.connect(connectionString, function(err, client) {
    if (err) {
        console.log(err);
    }
});
var client = new pg.Client(connectionString);
var tm = new model.TransactionModel(client);

// Config things we need to get the app going
app.configure(function() {
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use(express.static(path.join(application_root, "public")));
    app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.get('/transactions/archived', function(req, res) {
    var done = function (err, transactions) {
        if(err) {
            res.send("Error querying transactions", 500);
        } else {
            res.send(transactions);
        }

    };

    var currentTransactions = tm.getArchived(done);
});

app.get('/transactions/current', function(req, res) {
    var done = function (err, transactions) {
        if(err) {
            res.send("Error querying transactions", 500);
        } else {
            res.send(transactions);
        }
    };

    var currentTransactions = tm.getCurrent(done);
});

// Launch server
app.listen(4242);
