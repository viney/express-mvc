'use strict'

var log = require('tracer').console();

/* GET users listing. */
module.exports = function(app){
    app.get('/login', function(req, res) {

        log.debug('/login', req.session.user);
        // auth
        if (req.session.user) {
            log.debug('/login', req.cookie.remember);
            if (req.cookies.remember) {
                res.redirect('/');
            }
        }

        res.render('login', { title: '用户登录'});
    });

    app.post('/login', function(req, res) {
        var user = {username: 'admin', password: 'admin'}

        if(req.body.username === user.username && req.body.password === user.password){
            // remember
            var remember = req.body.remember;
            if (remember){
                res.cookie('remember', 1, {maxAge: 60*1000});
            }

            req.session.user = user;
            req.session.success = '登录成功';
            return res.redirect('/'); 
        }

        req.session.error = '用户名或密码不正确';
        return res.redirect('/login');
    });

    app.get('/logout', function(req, res){
        req.session.success = '已退出';
        req.session.user = null;         
        // 清空session
        // req.session.destroy();         
        res.clearCookie('remember');
        return res.redirect('/login');
    });
};
