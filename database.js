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
  postTrade: postTrade,
  getItemByDay: getItemByDay,
  getItemByMonth: getItemByMonth,
  getItemByYear: getItemByYear,
  getVendorByDay: getVendorByDay,
  getVendorByMonth: getVendorByMonth,
  getVendorByYear: getVendorByYear,
  getCategoryByDay: getCategoryByDay,
  getCategoryByMonth: getCategoryByMonth,
  getCategoryByYear: getCategoryByYear
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

function getItemByDay(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from ba_item_day where (day >= $1 and day <= $4) and month = $2 and year = $3 and vendor_id = $7';
    } else {
      query = 'select * from ba_item_day where ((day >= $1 and month = $2) or (day <= $4 and month = $5) or (month > $2 and month < $5)) and year = $3 and vendor_id = $7';
    }
  } else {
    query = 'select * from ba_item_day where ((year > $3 and year < $6) or (month > $2 and year = $3) or (month < $5 and year = $6) or (day >= $1 and month = $2 and year = $3) or (day <= $4 and month = $5 and year = $6)) and vendor_id = $7';
  }
  db.any(query, [req.query.diaInicial, req.query.mesInicial, req.query.anoInicial, req.query.diaFinal, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getItemByMonth(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from ba_item_month where month = $1 and year = $2 and vendor_id = $5';
    } else {
      query = 'select * from ba_item_month where (month >= $1 and month <= $3) and year = $2 and vendor_id = $5';
    }
  } else {
    query = 'select * from ba_item_month where ((year > $2 and year < $4) or (month >= $1 and year = $2) or (month <= $3 and year = $4)) and vendor_id = $7';
  }
  db.any(query, [req.query.mesInicial, req.query.anoInicial, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getItemByYear(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
      query = 'select * from ba_item_year where year = $1 and vendor_id = $3';
  } else {
    query = 'select * from ba_item_year where year >= $1 and year <= $2 and vendor_id = $3';
  }
  db.any(query, [req.query.anoInicial, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCategoryByDay(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from category_day where (day >= $1 and day <= $4) and month = $2 and year = $3 and vendor_id = $7';
    } else {
      query = 'select * from category_day where ((day >= $1 and month = $2) or (day <= $4 and month = $5) or (month > $2 and month < $5)) and year = $3 and vendor_id = $7';
    }
  } else {
    query = 'select * from category_day where ((year > $3 and year < $6) or (month > $2 and year = $3) or (month < $5 and year = $6) or (day >= $1 and month = $2 and year = $3) or (day <= $4 and month = $5 and year = $6)) and vendor_id = $7';
  }
  db.any(query, [req.query.diaInicial, req.query.mesInicial, req.query.anoInicial, req.query.diaFinal, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCategoryByMonth(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from category_month where month = $1 and year = $2 and vendor_id = $5';
    } else {
      query = 'select * from category_month where (month >= $1 and month <= $3) and year = $2 and vendor_id = $5';
    }
  } else {
    query = 'select * from category_month where ((year > $2 and year < $4) or (month >= $1 and year = $2) or (month <= $3 and year = $4)) and vendor_id = $5';
  }
  db.any(query, [req.query.mesInicial, req.query.anoInicial, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getCategoryByYear(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
      query = 'select * from category_year where year = $1 and vendor_id = $3';
  } else {
    query = 'select * from category_year where year >= $1 and year <= $2 and vendor_id = $3';
  }
  db.any(query, [req.query.anoInicial, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getVendorByDay(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from ba_vendor_day where (day >= $1 and day <= $4) and month = $2 and year = $3 and vendor_id = $7';
    } else {
      query = 'select * from ba_vendor_day where ((day >= $1 and month = $2) or (day <= $4 and month = $5) or (month > $2 and month < $5)) and year = $3 and vendor_id = $7';
    }
  } else {
    query = 'select * from ba_vendor_day where ((year > $3 and year < $6) or (month > $2 and year = $3) or (month < $5 and year = $6) or (day >= $1 and month = $2 and year = $3) or (day <= $4 and month = $5 and year = $6)) and vendor_id = $7';
  }
  db.any(query, [req.query.diaInicial, req.query.mesInicial, req.query.anoInicial, req.query.diaFinal, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getVendorByMonth(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
    if(req.query.mesInicial == req.query.mesFinal){
      query = 'select * from ba_vendor_month where month = $1 and year = $2 and vendor_id = $5';
    } else {
      query = 'select * from ba_vendor_month where (month >= $1 and month <= $3) and year = $2 and vendor_id = $5';
    }
  } else {
    query = 'select * from ba_vendor_month where ((year > $2 and year < $4) or (month >= $1 and year = $2) or (month <= $3 and year = $4)) and vendor_id = $5';
  }
  db.any(query, [req.query.mesInicial, req.query.anoInicial, req.query.mesFinal, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function getVendorByYear(req, res, next){
  var query;
  if(req.query.anoInicial == req.query.anoFinal){
      query = 'select * from ba_vendor_year where year = $1 and vendor_id = $3';
  } else {
    query = 'select * from ba_vendor_year where year >= $1 and year <= $2 and vendor_id = $3';
  }
  db.any(query, [req.query.anoInicial, req.query.anoFinal, req.query.id])
    .then(function (data){
      res.status(200).json({
        status: 'success',
        data: data,
        message: 'dados retornados'
      });
    })
    .catch(function (err) {
      return next(err);
    });
}

function isEmpty(obj) {
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      return false;
    }
  }
  return true;
}
