'use strict';

/* global Ethnio */

var $ = require('jquery');

// Opens the sign-up window
function openEthnio() {
  Ethnio.force_display = true;
  Ethnio.show();
  Ethnio.insertIframe();
  Ethnio.force_display = false;
}

// Loads the Ethnio script if it wasn't already loaded
function checkEthnio() {
  if (typeof Ethnio === 'undefined') {
    $.getScript('https://ethn.io/70862.js', function() {
      openEthnio();
    });
  } else {
    openEthnio();
  }
}

module.exports = {
  checkEthnio: checkEthnio,
  openEthnio: openEthnio
};
