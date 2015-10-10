'use strict';

var chai = require('chai');
var sinon = require('sinon');
var sinonChai = require('sinon-chai');
var expect = chai.expect;
chai.use(sinonChai);

var $ = require('jquery');

var Feedback = require('../js/feedback').Feedback;

describe('feedback', function() {

  beforeEach(function() {
    this.feedback = new Feedback('http://localhost:3000/issue/');
  });

  describe('constructor', function() {

  });

  describe('toggle', function() {

  });

  describe('messages', function() {

  });

  describe('submission', function() {

    beforeEach(function() {
      this.ajaxStub = sinon.stub($, 'ajax');
      sinon.stub(this.feedback, 'handleSuccess');
      sinon.stub(this.feedback, 'handleError');
      this.event = {preventDefault: sinon.spy()};
    });

    afterEach(function() {
      $.ajax.restore();
      this.feedback.handleSuccess.restore();
      this.feedback.handleError.restore();
    });

    it('calls handleSuccess on success', function() {
      var deferred = $.Deferred().resolve({});
      this.ajaxStub.returns(deferred);
      this.feedback.submit(this.event);
      expect(this.feedback.handleSuccess).to.have.been.called;
      expect(this.feedback.handleError).to.have.not.been.called;
    });

    it('calls handleError on error', function() {
      var deferred = $.Deferred().reject();
      this.ajaxStub.returns(deferred);
      this.feedback.submit(this.event);
      expect(this.feedback.handleSuccess).to.have.not.been.called;
      expect(this.feedback.handleError).to.have.been.called;
    });

  });

});
