// basic route (http://localhost:8080)
const express = require('express');
var busboy = require('connect-busboy');
var csv = require('csv-parser')
import parser from './data-parser/data-parser.js';

// ---------------------------------------------------------
// get an instance of the router for api routes
// ---------------------------------------------------------
var apiRoutes = express.Router();

export default function({
    app,
    ImportedExpense,
    Expense
}) {

    //busboy is for uploading multipart forms (csv files here)
    app.use(busboy());

    apiRoutes.get('/', function(req, res) {
        res.send('Hello! this is budgetqt backend!');
    });

    apiRoutes.get('/expenses', function(req, res) {
        Expense.find({}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.post('/expenses', function(req, res) {
        let newExpense = new Expense(req.body);
        Expense.save(newExpense, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.delete('/expenses', (req, res) => {
      let expense = req.body;
      //remove the imported expense
      Expense.find({
        _id: expense["_id"]
      }).remove().exec((err) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.status(200).send();
      });
    });

    apiRoutes.get('/expenses/imported', (req, res) => {
        ImportedExpense.find({}, (err, data) => {
            if (err) {
                console.log(err);
                res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.post('/expenses/imported', (req, res) => {
        //take the imported expense, format it and add it to the expenses collection
        let expense = req.body;
        let newExpense = {title:expense.file,amount:expense.amount,date:expense.date,tags:expense.tags}
        Expense.findOneAndUpdate({_id:expense._id}, newExpense, {
            upsert: true
        }, function(err, doc) {
            if (err) return res.send(500, {error: err});

            //remove the imported expense
            ImportedExpense.find({
                _id: expense["_id"]
            }).remove().exec((err) => {
                if (err) {
                    return res.status(500).send(err);
                }
            });

            res.send(newExpense);
        });
    });

    apiRoutes.put('/expenses/imported/:id', (req, res) => {
        ImportedExpense.update({}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.delete('/expenses/imported', (req, res) => {
        let expense = req.body;
        //remove the imported expense
        ImportedExpense.find({
            _id: expense["_id"]
        }).remove().exec((err) => {
            if (err) {
                return res.status(500).send(err);
            }
            res.status(200).send();
        });
    });

    apiRoutes.post('/expenses/upload/csv', function(req, res) {
        if (req.busboy) {
            req.busboy.on('file', function(fieldname, file, filename, encoding, mimetype) {
                file.pipe(csv()).on('data', (entry) => {
                    var expense = parser({
                        entry
                    });
                    expense.file = filename;
                    let newExpense = new ImportedExpense(expense);
                    newExpense.save((err) => {
                        if (err) {
                            console.log(err);
                        }
                        else {
                            console.log("SAVED EXPENSE!");
                        }
                    })
                })
            });
            req.busboy.on('field', function(key, value, keyTruncated, valueTruncated) {});
            req.pipe(req.busboy);
        }
        res.send('You have uploaded the file!');
    });

    apiRoutes.get('/expenses/:id', function(req, res) {
        let id = req.params.id;
        Expense.find({id}, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.put('/expenses/:id', function(req, res) {
        let newExpense = new Expense(req.body);
        let id = req.params.id;
        Expense.save(newExpense, (err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    apiRoutes.delete('/expenses/:id', function(req, res) {
        let id = req.params.id;
        Expense.find({id}).remove().exec((err, data) => {
            if (err) {
                console.log(err);
                return res.status(500).send(err);
            }
            res.send(data);
        });
    });

    return apiRoutes;
}
