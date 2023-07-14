var express = require('express');
var router = express.Router();

//config
const conf = require(REQUIRE_PATH.configure);

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', 
    { 
      title: `Newest on ${conf.env.environment}`,
      body: `Bwing project`  
    }
  );
});

module.exports = router;
