/**
 * Some core functionality for minnpost-medicare-provider-charges
 */

/**
 * Global variable to handle some things
 * like templates.
 */
var mpApp = mpApp || {};
mpApp['minnpost-legislature-roundup-2015'] = mpApp['minnpost-legislature-roundup-2015'] || {};

/**
 * Extend underscore
 */
_.mixin({
  /**
   * Formats number into currency
   */
  formatCurrency: function(num) {
    var rgx = (/(\d+)(\d{3})/);
    split = num.toFixed(2).toString().split('.');
    while (rgx.test(split[0])) {
      split[0] = split[0].replace(rgx, '$1' + ',' + '$2');
    }
    return '$' + split[0] + '.' + split[1];
  },

  /**
   * Formats percentage
   */
  formatPercentage: function(num) {
    return (num * 100).toFixed(1).toString() + '%';
  }
});


/**
 * Non global
 */
(function(app, $, undefined) {
  app.defaultOptions = {
    dataPath: './'
  };

  /**
   * Template handling.  For development, we want to use
   * the template files directly, but for build, they should be
   * compiled into JS.
   *
   * See JST grunt plugin to understand how templates
   * are compiled.
   *
   * Expects callback like: function(compiledTemplate) {  }
   */
  app.templates = app.templates || {};
  app.getTemplate = function(name, callback, context) {
    var templatePath = 'js/templates/' + name + '.html';
    context = context || app;

    if (!_.isUndefined(app.templates[templatePath])) {
      callback.apply(context, [ app.templates[templatePath] ]);
    }
    else {
      $.ajax({
        url: templatePath,
        method: 'GET',
        async: false,
        contentType: 'text',
        success: function(data) {
          app.templates[templatePath] = _.template(data);
          callback.apply(context, [ app.templates[templatePath] ]);
        }
      });
    }
  };

  /**
   * Data source handling.  For development, we can call
   * the data directly from the JSON file, but for production
   * we want to proxy for JSONP.
   *
   * `name` should be relative path to dataset minus the .json
   *
   * Returns jQuery's defferred object.
   */
  app.data = app.data || {};
  app.getData = function(name) {
    var proxyPrefix = 'https://mp-jsonproxy.herokuapp.com/proxy?callback=?&url=';
    var useJSONP = false;
    var defers = [];

    name = (_.isArray(name)) ? name : [ name ];

    // If the data path is not relative, then use JSONP
    if (app.options && app.options.dataPath.indexOf('http') === 0) {
      useJSONP = true;
    }

    // Go through each file and add to defers
    _.each(name, function(d) {
      var defer;

      if (useJSONP) {
        defer = $.ajax({
          url: proxyPrefix + encodeURI(app.options.dataPath + d + '.json'),
          dataType: 'jsonp'
        });
      }
      else {
        defer = $.getJSON(app.options.dataPath + d + '.json');
      }

      defers.push(defer);
    });

    return $.when.apply($, defers);
  };
})(mpApp['minnpost-legislature-roundup-2015'], jQuery);
