'use strict'

var log = require('tracer').console();

/*
 *
 * Get home page
 *
 */
module.exports = function(app){
    app.get('/', function(req, res) {

        log.debug('/', req.session.user);
        // auth
        if (!req.session.user){
            req.flash('success', '用户已过期，请重新登录！'); 
            return res.redirect('/login');
        }

        res.render('index', { title: 'Express' });
    });
};
