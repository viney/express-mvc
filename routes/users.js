var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', function(req, res) {
    res.render('login', { title: '用户登录'});
});

router.post('/', function(req, res) {
    var user = {username: 'admin', password: 'admin'}

    if(req.body.username === user.username && req.body.password === user.password){
        return res.redirect('/'); 
    }

    return res.redirect('/login');
});

module.exports = router;
