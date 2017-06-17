var promise = require('bluebird');

var options = {
  // Initialization Options
  promiseLib: promise
};

const pg = require('pg-promise')(options);
const connectionString = "postgres://bonamango:teste1234@bonamango.postgresql.dbaas.com.br:5432/bonamango?ssl=true";
var db = pg(connectionString);

module.exports = {
  postLogin: postLogin,
  getRandom: getRandom,
  getSearch: getSearch,
  getLogin: getLogin,
  postTrade: postTrade
};

function postLogin(req, res, next) {
  db.func('consumerSignUp', [req.query.f, req.query.l, req.query.e, req.query.p])
    .then(function (data) {
      if(data == -1){
        res.status(400).json({
          status: "fail",
          message: "email already in use"
        });
      } else {
        res.status(201).json({
          status: "success",
          data: data,
          message: "created user"
        });
      }
    })
    .catch(function (err){
      return next(err);
    });
}

function getRandom(req, res, next) {
  db.func('randomItems', req.params.n)
    .then(function (data) {
      res.status(200).json({
          status: 'success',
          data: data,
          message: 'Retrieved random itens'
      });
    })
    .catch(function (err) {
      return next(err);
    });
};

function getSearch(req, res, next) {
  db.func('itemSearch', req.query.s)
    .then(function (data){
      if(isEmpty(data)){
        res.status(404).json({
          status: 'fail',
          message: 'no products with string in name, tags or category'
        })
      } else {
        res.status(200).json({
          status: 'success',
          data: data,
          message: 'returned products with string in name, tags or category'
        })
      }
    })
    .catch(function (err) {
      return next(err);
    });
};

function getLogin(req, res, next){
  db.func('login', [req.query.l, req.query.p])
    .then(function (data) {
      if (isEmpty(data)){
        res.status(404)
          .json({
            status: 'fail',
            message: '404 USER NOT FOUND'
          });
      } else {
        res.status(200)
          .json({
            status: 'success',
            data: data,
            message: 'user found and id returned'
          });
      }
    })
    .catch(function (err) {
      return next(err);
    });
};

function postTrade(req, res, next) {
  db.none('insert into trade(date_time) values($1)', new Date())
    .then(function (data) {
      res.status(200)
        .json({
          status: 'success',
          message: 'inserted into trade with sucess'
        });
    })
    .catch(function (err) {
      return next(err);
    });
};

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
