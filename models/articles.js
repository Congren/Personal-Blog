var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var Article = new Schema({
    title: String,
    tag: String,
    text: String,
    userID: String
}, {collection: 'article'});
var article = mongoose.model('article', Article);
module.exports = article