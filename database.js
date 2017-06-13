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
  db.any('insert into the_user(user_id, name_first_name, name_last_name, email, password, user_status_id) values((select max(user_id) from the_user)+1, $1, $2, $3, $4, 1)', [req.query.f, req.query.l, req.query.e, req.query.p])
    .then(function (data) {
      res.status(201).json({
        status: "success",
        message: "created user"
      })
    })
    .catch(function (err){
      return next(err);
    });
}

function getRandom(req, res, next) {
  db.any('select picture, name, price, symbol as unit, rate, min_fraction, description, vendor_id, username as vendor_username, (rate_sum/rate_quantity) as vendor_rate from item join (select username, vendor_id, rate_sum, rate_quantity from vendor join the_user on vendor_id) on vendor_id join unit on unit_id order by random() limit 5')
    .then(function (data) {
      var json = data;
      for(let item of json){
        db.any('select name from tag_cult join item_tag on tag_id where culture_id = 1 and item_id = $1#', item.item_id)
          .then(function (data2){
            item.tag = data2;
        })
        .catch(function (err) {
          return next(err);
        });
      }
      res.status(200)
        .json({
          status: 'success',
          data: json,
          message: 'Retrieved itens that have parameter in its name'
      });
    })
    .catch(function (err) {
      return next(err);
    });
};

function getSearch(req, res, next) {
  db.any('select picture, name, price, symbol as unit, rate, min_fraction, description, vendor_id, name_first_name as vendor_username, (rate_sum/rate_quantity) as vendor_rate from product join (select name_first_name, vendor_id, rate_sum, rate_quantity from vendor join the_user on vendor_id) on vendor_id join unit on unit_id where name like \'%$1#%\'', req.query.s)
    .then(function (data) {
      var json = data;
      for(let item of json){
        db.any('select name from tag_cult join item_tag on tag_id where culture_id = 1 and item_id = $1#', item.item_id)
          .then(function (data2){
            item.tag = data2;
        })
        .catch(function (err) {
          return next(err);
        });
      }
      res.status(200)
        .json({
          status: 'success',
          data: json,
          message: 'Retrieved itens that have parameter in its name'
      });
    })
    .catch(function (err) {
      return next(err);
    });
};

function getLogin(req, res, next){
  var login = req.query.e, at = "@";

  if(login.indexOf(at) == -1){
    db.one('select user_id, name_first_name, name_last_name from the_user where user_id = $1# and password = $2', [login, req.query.p])
      .then(function (data) {
        if(isEmpty(data)){
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
  } else {
    db.proc('login', [login, req.query.p])
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
  }
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
