
/*
 * GET home page.
 */

exports.index = function(req, res){
  res.render('index', { 
    package: exports.package,
    title: 'Express' 
  });
};
