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
    var proxyPrefix = 'http://mp-jsonproxy.herokuapp.com/proxy?callback=?&url=';
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


this["mpApp"] = this["mpApp"] || {};
this["mpApp"]["minnpost-legislature-roundup-2015"] = this["mpApp"]["minnpost-legislature-roundup-2015"] || {};
this["mpApp"]["minnpost-legislature-roundup-2015"]["templates"] = this["mpApp"]["minnpost-legislature-roundup-2015"]["templates"] || {};

this["mpApp"]["minnpost-legislature-roundup-2015"]["templates"]["js/templates/template-bill-list.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<h4>Bills</h4>\n<div class="bills-list">\n  <ul>\n    ';
 _.each( bills, function( b ) { ;
__p += '\n      <li><a data-id="' +
((__t = ( b.cid )) == null ? '' : __t) +
'" class="show-bill" href="#show-bill"><i class="bs-icon bs-icon-' +
((__t = ( b.get('bill_status') )) == null ? '' : __t) +
'"></i> ' +
((__t = ( b.get('bill') )) == null ? '' : __t) +
'</a></li>\n    ';
 }); ;
__p += '\n  </ul>\n</div>';

}
return __p
};

this["mpApp"]["minnpost-legislature-roundup-2015"]["templates"]["js/templates/template-bill.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<div class="bill-details-wrapper">\n  <div class="bill-status">' +
((__t = ( bill.get('bill_status') )) == null ? '' : __t) +
' <i class="bs-icon bs-icon-' +
((__t = ( bill.get('bill_status') )) == null ? '' : __t) +
'"></i></div>\n  <h4 class="bill-title">' +
((__t = ( bill.get('bill') )) == null ? '' : __t) +
'</h4>\n  <p class="bill-description">\n    <span class="bill-title">' +
((__t = ( bill.get('title') )) == null ? '' : __t);
 if (bill.get('title').slice(-1) !== '.') { ;
__p += '.';
 } ;
__p += '</span>\n    <br /><br />\n    <em><a target="_blank" href="' +
((__t = ( bill.get('billurl') )) == null ? '' : __t) +
'">View bill status and details</a>, <a href="https://www.revisor.mn.gov/bills/status_description.php?f=' +
((__t = ( bill.get('bill').replace(' ', '') )) == null ? '' : __t) +
'&ssn=0&y=2015" target="_blank">full description</a>, and <a href="https://www.revisor.mn.gov/bills/text.php?number=' +
((__t = ( bill.get('bill').replace(' ', '') )) == null ? '' : __t) +
'&session=ls89&session_year=2015&session_number=0" target="_blank">current version</a>.</em>\n    ';
 if (bill.get('notes')) { ;
__p += '\n      <em><span class="bill-notes">' +
((__t = ( bill.get('notes') )) == null ? '' : __t) +
'</span></em>\n    ';
 } ;
__p += '\n  </p>\n\n\n  ';
 if (typeof bill.get('start_date') != 'undefined' && (bill.getDays() != NaN || bill.getDays() != 'NaN')) { ;
__p += '\n    <div class="bill-timeline">\n      ';
 if (bill.get('bill_status') == 'signed') { ;
__p += '\n        <p>This bill took about <span class="timeline-days">' +
((__t = ( bill.getDays() )) == null ? '' : __t) +
' days</span> to become law.</p>\n      ';
 } else if (bill.get('bill_status') == 'vetoed') { ;
__p += '\n        <p>This bill was considered for at least <span class="timeline-days">' +
((__t = ( bill.getDays() )) == null ? '' : __t) +
' days</span>.</p>\n      ';
 } else { ;
__p += '\n        <p>This bill has been considered for at least <span class="timeline-days">' +
((__t = ( bill.getDays() )) == null ? '' : __t) +
' days</span>.</p>\n      ';
 } ;
__p += '\n      <div class="session-start">\n        <span>Jan ' +
((__t = ( bill.sessionBegin().getDate() )) == null ? '' : __t) +
'</span>\n      </div>\n      <div class="bill-timeline-container">\n        <div style="width: ' +
((__t = ( bill.getIntervalPercentage() * 100 )) == null ? '' : __t) +
'%; margin-left: ' +
((__t = ( bill.getStartPercentage() * 100 )) == null ? '' : __t) +
'%;" class="bill-timeline-interval">\n        </div>\n      </div>\n      <div class="session-end">\n        <span>May ' +
((__t = ( bill.sessionEnd().getDate() )) == null ? '' : __t) +
'</span>\n      </div>\n      <br class="clear" />\n    </div>\n  ';
 } ;
__p += '\n\n\n  <div class="bill-house">\n    ';
 if (typeof bill.get('house_ayes') != 'undefined') { ;
__p += '\n      <div class="bill-house-votes bill-votes">\n        <div>\n          ';
 if (bill.get('house_ayes') < 0) { ;
__p += '\n            &nbsp;\n          ';
 } else { ;
__p += '\n            ' +
((__t = ( bill.get('house_ayes') )) == null ? '' : __t) +
'-' +
((__t = ( bill.get('house_nays') )) == null ? '' : __t) +
'\n          ';
 } ;
__p += '\n        </div>\n      </div>\n    ';
 } ;
__p += '\n\n    <div class="bill-house-sponsors">\n      ';
 if (!_.isEmpty(bill.get('house_sponsors'))) { ;
__p += '\n        <h6>House Sponsors</h6>\n        <ul>\n          ';
 _.each( bill.get('house_sponsors'), function( s ) { ;
__p += '\n            ';
 if (s[3]) { ;
__p += '\n              <li>\n                <a target="_blank" href="' +
((__t = ( s[3] )) == null ? '' : __t) +
'">' +
((__t = ( s[0] )) == null ? '' : __t) +
'</a>\n                ';
 if (s[1]) { ;
__p += '\n                  (' +
((__t = ( s[1].charAt(0) )) == null ? '' : __t) +
')\n                ';
 } ;
__p += '\n              </li>\n            ';
 } else { ;
__p += '\n              <li>' +
((__t = ( s[0] )) == null ? '' : __t) +
'</li>\n            ';
 } ;
__p += '\n          ';
 }); ;
__p += '\n        </ul>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n\n  <div class="bill-senate">\n    ';
 if (typeof bill.get('senate_ayes') != 'undefined') { ;
__p += '\n      <div class="bill-senate-votes bill-votes">\n        <div>\n          ';
 if (bill.get('senate_ayes') < 0) { ;
__p += '\n            &nbsp;\n          ';
 } else { ;
__p += '\n            ' +
((__t = ( bill.get('senate_ayes') )) == null ? '' : __t) +
'-' +
((__t = ( bill.get('senate_nays') )) == null ? '' : __t) +
'\n          ';
 } ;
__p += '\n        </div>\n      </div>\n    ';
 } ;
__p += '\n\n    <div class="bill-senate-sponsors">\n      ';
 if (!_.isEmpty(bill.get('senate_sponsors'))) { ;
__p += '\n        <h6>Senate Sponsors</h6>\n        <ul>\n          ';
 _.each( bill.get('senate_sponsors'), function( s ) { ;
__p += '\n            ';
 if (s[3]) { ;
__p += '\n              <li>\n                <a target="_blank" href="' +
((__t = ( s[3] )) == null ? '' : __t) +
'">' +
((__t = ( s[0] )) == null ? '' : __t) +
'</a>\n                ';
 if (s[1]) { ;
__p += '\n                  (' +
((__t = ( s[1].charAt(0) )) == null ? '' : __t) +
')\n                ';
 } ;
__p += '\n              </li>\n            ';
 } else { ;
__p += '\n              <li>' +
((__t = ( s[0] )) == null ? '' : __t) +
'</li>\n            ';
 } ;
__p += '\n          ';
 }); ;
__p += '\n        </ul>\n      ';
 } ;
__p += '\n    </div>\n  </div>\n  <br class="clear" />\n\n  ';
 if (!_.isEmpty(bill.get('categories'))) { ;
__p += '\n    <div class="bill-categories">\n      Categories:\n      <ul>\n        ';
 _.each( bill.get('categories'), function( c, i, list ) { ;
__p += '\n          <li>\n            <a href="#' +
((__t = ( c )) == null ? '' : __t) +
'" data-category="' +
((__t = ( c )) == null ? '' : __t) +
'">' +
((__t = ( c )) == null ? '' : __t) +
'</a>';
 if (i < list.length - 1) { ;
__p += ',';
 } ;
__p += '\n          </li>\n        ';
 }); ;
__p += '\n      </ul>\n    ';
 } ;
__p += '\n  </div>\n</div>\n';

}
return __p
};

this["mpApp"]["minnpost-legislature-roundup-2015"]["templates"]["js/templates/template-category.html"] = function(obj) {
obj || (obj = {});
var __t, __p = '', __e = _.escape, __j = Array.prototype.join;
function print() { __p += __j.call(arguments, '') }
with (obj) {
__p += '\n<a class="all-categories" href="#all-categories"><i class="bs-icon bs-icon-white bs-icon-circle-arrow-left"></i> back</a>\n<h3>\n  ';
 if (typeof image_url != 'undefined') { ;
__p += '\n    <img class="category-image" src="' +
((__t = ( image_url )) == null ? '' : __t) +
'" /> \n  ';
 } ;
__p += '\n  ';
 if (typeof sponsor != 'undefined' && typeof sponsor[2] != 'undefined') { ;
__p += '\n    <img class="category-image" src="' +
((__t = ( sponsor[2] )) == null ? '' : __t) +
'" /> \n  ';
 } ;
__p += '\n  ' +
((__t = ( category )) == null ? '' : __t) +
'\n  ';
 if (typeof sponsor != 'undefined' && typeof sponsor[1] != 'undefined') { ;
__p += '\n    (' +
((__t = ( sponsor[1].charAt(0) )) == null ? '' : __t) +
')\n  ';
 } ;
__p += '\n</h3>';

}
return __p
};

/**
 * Main application logic
 */
(function(app, $, undefined) {

  // Determine if chrome
  var isChrome = navigator.userAgent.toLowerCase().indexOf('chrome') > -1;

  // Icon list
  var categoryIcons = {
    'Government': 'noun_project_1761',
    'Administration': 'noun_project_1761',
    'Energy and Technology': 'noun_project_2075',
    'Housing and Property': 'noun_project_1439',
    'Campaign Finance and Election Issues': 'noun_project_287',
    'Reproductive Issues': 'noun_project_626',
    'Environment and Recreation': 'noun_project_479',
    'Health and Science': 'noun_project_1868',
    'Military': 'noun_project_1697',
    'Welfare and poverty': 'noun_project_620',
    'Budget, Spending and Taxes': 'noun_project_925',
    'Insurance': 'noun_project_1675',
    'Business and Economy': 'noun_project_1640',
    'Education': 'noun_project_1051',
    'Immigration': 'noun_project_31',
    'Agriculture and Food': 'noun_project_741',
    'Arts and Humanities': 'noun_project_1554',
    'Guns': 'noun_project_138',
    'Gambling and Gaming': 'noun_project_1740',
    'Crime and Drugs': 'noun_project_2039',
    'Social Issues': 'noun_project_288',
    'Vetoed': 'noun_project_558',
    'Controversial': 'noun_project_1635',
    'Legal': 'noun_project_1004',
    'Transportation': 'noun_project_97'
  };

  // Create basic models for bills and categories
  var Bill = Backbone.Model.extend({
    sessionBegin: function() {
      return app.options.sessionBegin;
    },

    sessionEnd: function() {
      return app.options.sessionEnd;
    },

    convertDate: function(string) {
      var dateArray = string.replace(/( [0-9]{2}:[0-9]{2}:[0-9]{2}$)/, '').split('-');
      if (_.isArray(dateArray) && dateArray.length == 3) {
        return new Date(dateArray[0], dateArray[1] - 1, dateArray[2]);
      }
      else {
        return new Date();
      }
    },

    getDays: function() {
      var start = this.convertDate(this.get('start_date'));
      var end = this.convertDate(this.get('end_date'));
      var days = 24 * 60 * 60 * 1000;

      // Add one to ensure it is a non-zero result.
      return Math.ceil(((end.getTime() + 1) - start.getTime()) / days);
    },

    getIntervalPercentage: function() {
      var percentage;
      var days = 24 * 60 * 60 * 1000;
      var sessionBegin = this.sessionBegin();
      var sessionEnd = this.sessionEnd();
      var sessionLength = Math.ceil(((sessionEnd.getTime() + 1) - sessionBegin.getTime()) / days);
      var theseDays = (this.getDays() < 3) ? 3 : this.getDays();

      // Get percentage of length but don't go over 1.
      if (this.getStartPercentage() + (theseDays / sessionLength) >= 1) {
        percentage = (1 - this.getStartPercentage());
      }
      else {
        percentage = (theseDays > sessionLength) ? 1 : theseDays / sessionLength;
      }
      return percentage;
    },

    getStartPercentage: function() {
      var days = 24 * 60 * 60 * 1000;
      var sessionBegin = this.sessionBegin();
      var sessionEnd = this.sessionEnd();
      var start = this.convertDate(this.get('start_date'));

      var startInterval = Math.ceil(((start.getTime() + 1) - sessionBegin.getTime()) / days);
      var sessionLength = Math.ceil(((sessionEnd.getTime() + 1) - sessionBegin.getTime()) / days);

      // Add one to ensure it is a non-zero result.  If start time is
      // before the session start time, just assume 0.
      return (start.getTime() < sessionBegin.getTime()) ? 0 : startInterval / sessionLength;
    },

    getSponsorData: function(author, type) {
      var sponsorlist = (type == 'representative') ? 'house_sponsors' : 'senate_sponsors';
      var sponsors = this.get(sponsorlist);

      if (_.isArray(sponsors)) {
        for (var s in sponsors) {
          if (sponsors[s][0] == author) {
            return sponsors[s];
          }
        }
      }
    }
  });

  // Collections
  var Bills = Backbone.Collection.extend({
    model: Bill,

    filterCategory: function (category) {
      return this.filter(function (bill) {
        if (_.isArray(bill.get('categories'))) {
          var found = _.filter(bill.get('categories'), function(c) {
            return c == category;
          });
          return !_.isEmpty(found);
        }
        else {
          return false;
        }
      });
    },

    filterAuthor: function(author, type) {
      var sponsorlist = (type == 'representative') ? 'house_sponsors' : 'senate_sponsors';

      if (!_.isArray(author)) {
        author = [author];
      }

      return this.filter(function (bill) {
        if (_.isArray(bill.get(sponsorlist))) {
          var found = _.filter(bill.get(sponsorlist), function(s) {
            return (_.indexOf(author, s[0]) === -1) ? false : true;
          });
          return !_.isEmpty(found);
        }
        else {
          return false;
        }
      });
    },

    comparator: function(bill) {
      return (bill.get('bill_status') == 'pending') ? 'zzz' : bill.get('bill_status');
    }
  });

  // Single bill view.
  var BillView = Backbone.View.extend({
    initialize: function(d) {
      // Every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render');

      this.model = d.model || new Bill();
    },

    render: function() {
      // Render template
      app.getTemplate('template-bill', function(template) {
        $(this.el).html(template({ bill: this.model }));

        // Figure out heights
        var billH = $('.bill-details-wrapper').height();
        var listH = $('#bills-list-container').height();
        if (listH > billH) {
          $('.bill-details-wrapper').height(listH);
        }
      }, this);
      return this;
    }
  });

  // Bills list view
  var BillsListView = Backbone.View.extend({
    categoryContainer: $('#bill-category-container'),
    listContainer: $('#bills-list-container'),

    events: {
      'click .show-bill': 'showBill',
      'submit form#address-chooser-form': 'showByAddress'
    },

    initialize: function(d) {
      // Every function that uses 'this' as the current object should be in here
      _.bindAll(this, 'render', 'showBill', 'showFirstBill', 'activateBill', 'showByAddress', 'filterCategory');

      this.collection = d.collection || new Bills();
      this.fullCollection = new Bills(this.collection.models);
      this.billView = new BillView({ el: $('#bill-detail-container') });
    },

    render: function() {
      // Render template
      app.getTemplate('template-bill-list', function(template) {
        this.listContainer.html(template({ bills: this.collection.models }));

        // Figure if we are scrolling.  Height on ul is not working,
        // so we count the li's.  :(
        var size = $('.bills-list ul li').size();
        if (size > 16) {
          $('.bills-list').addClass('is-scrolling');
        }
      }, this);
      return this;
    },

    showBill: function(e) {
      e.preventDefault();
      var thisElem = $(e.currentTarget);
      this.billView.model = this.collection.get(thisElem.attr('data-id'));
      this.activateBill(thisElem);
      this.billView.render();
      this.activateCategoryLinks();
      return this;
    },

    showFirstBill: function() {
      this.billView.model = this.collection.at(0);
      this.activateBill($('[data-id="' + this.billView.model.cid + '"]'));
      this.billView.render();
      this.activateCategoryLinks();
      return this;
    },

    activateCategoryLinks: function() {
      var that = this;
      // Hookup category links
      $('.bill-categories ul a').click(function(e) {
        e.preventDefault();
        that.filterCategory($(this).attr('data-category'));
      });

      return that;
    },

    activateBill: function(element) {
      $('.show-bill').removeClass('active');
      element.addClass('active');
      return this;
    },

    showCategory: function(data) {
      // Render template
      app.getTemplate('template-category', function(template) {
        this.categoryContainer.html(template(data));
      }, this);
      return this;
    },

    showError: function(message) {
      $('<div class="address-error">' + message + '</div>').hide().prependTo('#address-chooser-form').fadeIn();
    },

    removeErrors: function() {
      $('#address-chooser-form .address-error').fadeOut('fast');
    },

    showByAddress: function(e) {
      e.preventDefault();
      var thisList = this;
      var geocodeURL;
      var thisElem = $(e.currentTarget);
      var type = $('input:radio[name="author_type"]:checked').val();
      var address = $('input#address-chooser-address').val();
      var mnBounds = [43.499356, -97.239209, 49.384358, -89.489226];

      // Remove any errors
      this.removeErrors();

      // Geocode address using Mapquest open
      geocodeURL = 'http://open.mapquestapi.com/geocoding/v1/address?key=' +
        app.options.mapQuestKey +
        '&outFormat=json&callback=?&countrycodes=us&maxResults=1&location=' +
        encodeURI(address);
      $.getJSON(geocodeURL, function(response) {
        var value;

        // Use first response
        try {
          value = response.results[0].locations[0].latLng;
        }
        catch (e) {
          thisList.showError('We were unable turn your search terms, ' + address + ', into a geographical location.  Please be more specific, such as including ZIP code.');
          return;
        }

        // Check we are still mostly in Minnesota
        if (value.lat < mnBounds[0] || value.lat > mnBounds[2] || value.lng < mnBounds[1] || value.lng > mnBounds[3]) {
          thisList.showError('Sorry, but what you are looking for is outside of Minnesota.');
        }
        else {
          // Send to Open States service
          var APIKEY = '49c5c72c157d4b37892ddb52c63d06be';
          var request = 'http://openstates.org/api/v1/legislators/geo/?long=' + encodeURI(value.lng) + '&lat=' + encodeURI(value.lat) + '&apikey=' + encodeURI(APIKEY) + '&callback=?';
          $.getJSON(request, function(data) {
            var d;
            var names = [];
            var chamber = (type == 'representative') ? 'lower' : 'upper';

            // Find relevant names.
            // data[d].level == 'state' does not seem to be there anymore
            for (d in data) {
              if (data[d].active && data[d].chamber == chamber) {
                names.push(data[d].full_name);
              }
            }

            // Filter by representative
            if (!_.isEmpty(names)) {
              // Get last name found
              var name = names[names.length - 1];
              var filtered = thisList.filterAuthor(name, type, true);
              if (_.isEmpty(filtered)) {
                thisList.showError('There were no bills found that were sponsored by your legislator(s): <em>' + name + '</em>.  This could be an issue with the data quality and may not accurately reflect the activities of these legislator(s).');
              }
              else {
                $('#address-chooser').slideUp('fast');
                $('#category-details').slideDown('fast');
              }
            }
            else {
              thisList.showError('We could not find a representative for that address.');
            }
          });
        }
      });
    },

    filterAuthor: function(author, type) {
      var filtered = this.fullCollection.filterAuthor(author, type);

      if (_.isEmpty(filtered)) {
        // TODO: show empty message
      }
      else {
        this.collection.reset(filtered);
        this.showCategory({
          category: author,
          sponsor: this.collection.at(0).getSponsorData(author, type)
        });
        this.render();
        this.showFirstBill();
      }

      return filtered;
    },

    filterCategory: function(category) {
      var filtered = this.fullCollection.filterCategory(category);

      if (_.isEmpty(filtered)) {
        // TODO: show empty message
      }
      else {
        this.collection.reset(filtered);
        var image = app.options.imageDirectory +
          this.getCatIcon(category) + '.png';
        this.showCategory({ category: category, image_url: image });
        this.render();
        this.showFirstBill();
      }
    },

    getCatIcon: function(cat) {
      if (typeof categoryIcons[cat] != 'undefined') {
        return categoryIcons[cat];
      }
      else {
        return 'noun_project_1635';
      }
    }
  });

  // Visualize categories with a bubble layout.
  function visCategories(categories, billList) {
    var height = 650;
    var width = 975;
    var bubbleMinRadius = 3;
    var bubbleMaxRadius = 65;
    var bubbleMinArea = Math.PI * bubbleMinRadius * bubbleMinRadius;
    var bubbleMaxArea = Math.PI * bubbleMaxRadius * bubbleMaxRadius;
    var xBubbleSpacing = 50;
    var yBubbleSpacing = 150;
    var xPos = -50;
    var yPos = 165;
    var bubbleColors = ['156DAC', '1571A6', '1575A0', '15799A', '157D94', '15828E', '158688', '158A82', '158E7D', '159277', '159771', '159B6B', '159F65', '15A35F', '15A759', '15AC54'];
    var customColors = { 'Vetoed': 'C83D2D', 'Controversial': 'E31C2D', 'Uncategorized': 'E3D21C' };
    var customSorts = { 'Vetoed': -1, 'Controversial': -2, 'Uncategorized': -3 };
    var reordered = [];

    // Find the max number in a category
    var maxBills = 1;
    for (var c in categories) {
      maxBills = (categories[c].length > maxBills) ? categories[c].length : maxBills;
      // For re-ordering
      reordered.push({ name: c, bills: categories[c]});
    }

    // Sort categories by number of bills
    reordered = reordered.sort(function(a, b) {
      // Handle custom sorts, otherwise just sort by length.
      if (typeof customSorts[a.name] != 'undefined') {
        return 0 - customSorts[a.name];
      }
      else if (typeof customSorts[b.name] != 'undefined') {
        return customSorts[b.name];
      }
      else {
        return b.bills.length - a.bills.length;
      }
    });

    // Base Raphael canvas
    var bubbleChart = Raphael(document.getElementById('bubble-chart'), width, height);

    // Create bubbles
    _.each(reordered, function(cat, i) {
      // Make area proportional given max bills in a category.  This could
      // be a lot more elegant and efficient.
      var percentage = cat.bills.length / maxBills;
      var thisArea = (percentage * (bubbleMaxArea - bubbleMinArea)) + bubbleMinArea;
      var radius = Math.sqrt(thisArea / Math.PI);
      var color = bubbleColors[Math.floor(Math.random() * bubbleColors.length)];

      // Custom color
      if (typeof customColors[cat.name] != 'undefined') {
        color = customColors[cat.name];
      }

      // Update x and y positions
      xPos += 150;
      if (xPos + radius >= width) {
        xPos = 100;
        yPos += yBubbleSpacing;
      }

      // Create circle with proportional radius and starting in
      // a random spot (as it will be positioned later).  Attached
      // data for the position and radius.
      var circle = bubbleChart.circle(Math.random() * (width - radius), Math.random() * (height - radius), 0)
        .data('name', cat.name)
        .data('spreadX', xPos)
        .data('spreadY', yPos - radius)
        .data('radius', radius)
        .attr('fill', Raphael.rgb(hexToRGB(color, 'R'), hexToRGB(color, 'G'), hexToRGB(color, 'B')))
        .attr('opacity', '0.7')
        .attr('stroke-width', 0.5)
        .attr('cursor', 'pointer');

      // Animate the circle to its full radius
      var enlarge = Raphael.animation({'r': radius}, 1000, 'easeIn');
      circle.animate(enlarge.delay(Math.random() * 1000));

      // Text for each bubble, attaching data for spreading.
      var catText = cat.name + ' (' + cat.bills.length + ')';
      var text = bubbleChart.text(circle.attrs.cx, circle.attrs.cy)
        .attr('font-size', 12)
        .attr('fill', '#444')
        .attr('cursor', 'pointer')
        .data('spreadX', xPos)
        .data('spreadY', yPos + 20)
        .data('name', catText);
      text = wrapText(catText, text);

      // Create image for for the bubble.  A slight offset
      // on spread for centering.
      //
      // Images don't seem to work in Chrome.  This is a recent bug and
      // can't seem to find a way around this
      var image;
      if (isChrome) {
        image = false;
      }
      else {
        image = bubbleChart.image(app.options.imageDirectory + billList.getCatIcon(cat.name) + '.png',
          Math.random() * (width - radius), Math.random() * (height - radius),
          radius * 0.9, radius * 0.9)
          .attr('opacity', '0.1')
          .attr('cursor', 'pointer')
          .data('spreadX', xPos - (radius * 0.5) + 1)
          .data('spreadY', yPos - (radius * 1.5) + 1)
          .data('name', cat.name);

        // Fade in image
        var fadeIn = Raphael.animation({'opacity': '0.6'}, 1000, 'easeIn');
        image.animate(fadeIn.delay(Math.random() * 1000));
      }

      // Create set for handling events.
      settingIt(bubbleChart, billList, circle, image, text);
    });

    // Set it function for bubble chart
    function settingIt(paper, bL, c, i, t) {
      var set = paper.set();
      set.push(c);

      if (i) {
        set.push(i);
      }

      set.push(t)
        .mouseover(function() {
          c.attr('opacity', '1.0');
          if (i) {
            i.attr('opacity', '1.0');
          }
        })
        .mouseout(function() {
          c.attr('opacity', '0.8');
          if (i) {
            i.attr('opacity', '0.6');
          }
        })
        .click(function() {
          // Handle filtering of Bills list and display
          if (typeof bL != 'undefined') {
            bL.filterCategory(this.data('name').replace('\n', ''));
            $('#bubble-chooser').slideUp('fast');
            $('#category-details').slideDown('fast');
          }
        });
    }

    // Position elements
    spreadVis(bubbleChart);
  }

  // Preload the images
  function preloadImages() {
    var defers = [];

    _.each(categoryIcons, function(c, ci) {
      var src = app.options.imageDirectory + c + '.png';
      var d = new $.Deferred();

      if (c && c !== '') {
        $('<img />').attr('src', src).appendTo('body').css('display', 'none').load(function() {
          d.resolve();
        });
        defers.push(d);
      }
    });

    return $.when.apply($, defers);
  }

  // Function to convert hex to rgb
  function hexToRGB(h, part) {
    h = (h.charAt(0) == '#') ? h.substring(1,7) : h;
    switch (part) {
      case 'R':
        return parseInt(h.substring(0, 2), 16);

      case 'G':
        return parseInt(h.substring(2, 4), 16);

      case 'B':
        return parseInt(h.substring(4, 6), 16);
    }
  }

  // Move the bubbles around.
  function spreadVis(paper) {
    paper.forEach(function(el) {
      var spread;

      // Position elements, pulling position from their data, and
      // create animation
      if (el.type === 'circle') {
        spread = Raphael.animation({
          'cx': el.data('spreadX'),
          'cy': el.data('spreadY')
        }, 1000, 'backOut');
        el.animate(spread.delay(Math.random() * 1000));

        el.attr({
          'cx': el.data('spreadX'),
          'cy': el.data('spreadY')
        });
      }
      else if (el.type === 'text' || el.type === 'image') {
        spread = Raphael.animation({
          'x': el.data('spreadX'),
          'y': el.data('spreadY')
        }, 1000, 'backOut');
        el.animate(spread.delay(Math.random() * 1000));
      }
    });
  }

  // Wrapping text function
  function wrapText(text, textObject) {
    var maxWidth = 140;
    var words = text.split(' ');
    var tempText = '';

    // Opera does not like Raphaels bbox command so
    // we just bypass this
    /*
    if ($.browser.opera) {
      return textObject.attr('text', text);
    }
    */

    for (var i = 0; i < words.length; i++) {
      textObject.attr('text', tempText + ' ' + words[i]);
      if (textObject.getBBox(true).width > maxWidth) {
        tempText += '\n' + words[i];
      }
      else {
        tempText += ' ' + words[i];
      }
    }
    return textObject.attr('text', tempText.substring(1));
  }

  // Process bill data and handle application.  JSONP callback
  // $.getJSON('data/bills.json', function(data) {
  billsProcess = function(data) {
    // Get categories
    var i;
    var categories = {};
    var noCat = 'Uncategorized';

    _.each(data, function(d, di) {
      if (_.isArray(d.categories) && d.categories.length > 0) {
        _.each(d.categories, function(c, ci) {
          categories[c] = categories[c] || [];
          categories[c].push(d.bill);
        });
      }
      // Handle no categories
      else {
        data[di].categories = [noCat];
        categories[noCat] = categories[noCat] || [];
        categories[noCat].push(d.bill);
      }
    });

    // Create bills collection
    var bills = new Bills();
    _.each(data, function(d, di) {
      bills.add(new Bill(d));
    });

    // Handle list of bills
    var billList = new BillsListView({ el: app.options.el, collection: bills });

    // Done loading
    $('.loading-temp').fadeOut();
    $('#application-nav, #tab-container').show();

    // Show number of bills
    var count = bills.length;
    $('#bill-count-description').html('The legislature passed <strong>' + count + '</strong> bills in the 2015 session.');

    // Preload images to fix Chrome and Raphael bug
    preloadImages(categories).done(function() {

      // Create bubble visualization
      visCategories(categories, billList);
    });

    // Navigation and interface
    $(app.options.el).on('click', '.all-categories', function(e) {
      e.preventDefault();
      if ($('.by-category').hasClass('tab-active')) {
        $('#bubble-chooser').slideDown('fast');
      }
      else {
        $('#address-chooser').slideDown('fast');
      }
      $('#category-details').slideUp('fast');
    });

    // Tabs
    $('.by-category').click(function(e) {
      e.preventDefault();
      if (!$('.by-category').hasClass('tab-active')) {
        $('#address-chooser').fadeOut('fast');
        $('#application-nav li, #application-nav a').toggleClass('tab-active');
      }
      $('#bubble-chooser').fadeIn('fast');
      $('#category-details').hide();
    });
    $('.by-address').click(function(e) {
      e.preventDefault();
      if (!$('.by-address').hasClass('tab-active')) {
        $('#bubble-chooser').fadeOut('fast');
        $('#application-nav li, #application-nav a').toggleClass('tab-active');
      }
      $('#address-chooser').fadeIn('fast');
      $('#category-details').hide();
    });

    // Address input form
    var inputText = 'Enter your address';
    $('#address-chooser-address').val(inputText).addClass('showing-label')
    .focus(function() {
      if ($(this).val() == inputText) {
        $(this).val('').removeClass('showing-label');
      }
    })
    .blur(function() {
      if ($(this).val() === '' || $(this).val() == inputText) {
        $(this).val(inputText).addClass('showing-label');
      }
    });
  };



  // Main entrance into application
  app.start = function(data) {
    // Mark as loading
    $('<span class="loading-temp">Loading...</span>').hide().prependTo($('#application-nav').parent()).fadeIn();

    // Get data
    app.getData('data/bills').done(function(data) {
      app.data.bills = data;
      billsProcess(data);
    });
  };
})(mpApp['minnpost-legislature-roundup-2015'], jQuery);
