'use strict';

var chai = require('chai');
var expect = chai.expect;

var helpers = require('../js/helpers');

describe('helpers', function() {
  describe('sanitizeValue', function() {
    it('sanitizes a string', function() {
      var value = 'X0YZ12345><sCrIPt>alert(document.cookie)</ScRiPt>';

      expect(helpers.sanitizeValue(value)).to.equal('X0YZ12345');
    });

    it('sanitizes an array', function() {
      var value = [
          'X0YZ12345><sCrIPt>alert(document.cookie)</ScRiPt>',
          'A1BC67890'
      ];

      expect(helpers.sanitizeValue(value)).to.deep.equal(
          ['X0YZ12345', 'A1BC67890']
      );
    });

    it('skips sanitizing null values', function() {
      var value = null;

      expect(helpers.sanitizeValue(value)).to.be.null;
    });

    it('skips sanitizing undefined values', function() {
      var value;

      expect(helpers.sanitizeValue(value)).to.be.undefined;
    });

    it('sanitizes an array that includes null values', function() {
      var value = [
          'X0YZ12345"><sCrIPt>alert(document.cookie)</ScRiPt>',
          null
      ];

      expect(helpers.sanitizeValue(value)).to.deep.equal(
          ['X0YZ12345', null]
      );
    });
  });

  describe('sanitizeQueryParams', function() {
    it('sanitizes a collection of parameters', function() {
      var query = {
        candidate_id: 'H4GA06087"><sCrIPt>alert(document.cookie)</ScRiPt>',
        committee_id: 'C00509893',
        max_date: '12-31-2016',
        min_date: '01-01-2015',
        support_oppose_indicator: 'S',
        q: '@@@@@@@@@@@@@@@@@@@@@@'
      };

      expect(helpers.sanitizeQueryParams(query)).to.deep.equal({
        candidate_id: 'H4GA06087',
        committee_id: 'C00509893',
        max_date: '12-31-2016',
        min_date: '01-01-2015',
        support_oppose_indicator: 'S',
        q: ''
      });
    });
  });
});
