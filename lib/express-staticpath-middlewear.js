var url = require('url')
  , path = require('path');

module.exports.create = function(version) {

  if (!version) {
    throw new Error('version argument is required');
  }

  version = String(version);

  return {

    /**
     * View helper
     */
    staticPath: function(url) {

      url = url.toString();

      var position = url.indexOf('/');

      if (-1 !== position) {

        return path.normalize(
          url.substring(0, position) + '/' + version 
            + url.substring(position)
        ).replace(/\\/g, '/');

      } else {

        return url;

      }

    },

    middleware: function(req, res, next) {

      if ('GET' !== req.method) {
        return next();
      }

      var positionInUrl = req.url.indexOf(version);

      if (-1 === positionInUrl) {
        return next();
      }

      req.url = req.url.substring(0, positionInUrl - 1) 
        + req.url.substring(positionInUrl + version.length);

      next();
    }
  };
};
