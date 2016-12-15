var express = require('express');
var passport = require('passport');
var Account = require('../models/account');
var Article = require('../models/articles');
var router = express.Router();

router.get('/', function (req, res) {
    if(req.user){
        Article.find({userID: req.user.username}, function(err, articles) {
            res.render('index', { user : req.user, articles:articles});
        }, function(err) {
            console.log(err)
        });
    }else{            
        res.render('index', { user : req.user, articles:0});
    }
});

router.get('/articles/remove/:tag', function(req, res){
    if(req.user){
        Article.remove(Article.findOne({tag: req.params.tag, userID: req.user.username}), function(error, article) {
            res.redirect('/');
        })
    }else{
        res.render('index', {user:req.user, articles: 0})
    }
});


router.get('/articles/:tag', function(req, res){
  if(req.user){
      Article.findOne({tag: req.params.tag, userID: req.user.username}, function(error, article) {
        res.render('article', {user: req.user, article: article});
      });
  }else{
      res.render('index', {user:req.user, articles: 0})
  }
});

router.get('/register', function(req, res) {
    res.render('register');
});

router.get('/inspire:search?', function(req, res){
    if (req.query.search){
    }else{
        res.render('inspire', {user: req.user})
    }
})

router.post('/register', function(req, res, next) {
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }
        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err);
                }
                res.redirect('/');
            });
        });
    });
});


router.get('/update', function(req, res) {
    res.render('update', { user : req.user });
});

router.get('/create', function(req, res) {
    res.render("post", { user: req.user});
});

router.post('/create', function(req, res) {
    var newArticle = Article({
        title: req.body.title,
        tag: req.body.tag,
        text: req.body.text,
        userID: req.user.username
    })
    newArticle.save(function(err) {
        if (err) throw err;
    });
    res.redirect('/');
});

router.post('/update', function(req, res) {
    Account.remove(req.user, function(err, records){
    })
    Account.register(new Account({ username : req.body.username }), req.body.password, function(err, account) {
        if (err) {
          return res.render('register', { error : err.message });
        }
        passport.authenticate('local')(req, res, function () {
            req.session.save(function (err) {
                if (err) {
                    return next(err)
                }
                res.redirect('/');
            });
        });
    });
});

router.get('/delete', function(req, res) {
    res.render('delete', { user : req.user });
});


router.post('/delete', function(req, res, next) {
    Account.remove(req.user, function(err, records){
        if(err){
            res.status(200).send("Error! " + err);
        }
        else{
            console.log("Account Removed");
            res.redirect('/');
        }
    })
});

router.get('/login', function(req, res) {
    res.render('login', { user : req.user });
});

router.post('/login', passport.authenticate('local'), function(req, res) {
    res.redirect('/');
});

router.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
});

module.exports = router;