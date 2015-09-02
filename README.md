# FEC Style

Shared styles and user interface components used by https://github.com/18F/openFEC-web-app and https://github.com/18F/fec-cms.

[![Build Status](https://img.shields.io/travis/18F/fec-style/master.svg)](https://travis-ci.org/18F/fec-style)
[![Test Coverage](https://img.shields.io/codecov/c/github/18F/fec-style/master.svg)](https://codecov.io/github/18F/fec-style)

# Viewing the style guide
Clone the repo to your machine and open `styleguide/index.html`. Voila.

# Contributing
Install dependencies

    $ npm install

Eventually we'll have a sweet build process for this all. In the mean time, we're using node-sass and kss-node to compile the Sass and generate the styleguide.

Watch the sass, build css and styleguide:

    $ npm run watch

Generate the CSS:

    $ npm run build-sass

Generate the JS:

    $ npm run build-js

Run unit tests:

    $ npm test

Watching the Sass:

    $ npm run watch-sass

Note: in order for css changes to be visible on the styleguide, you need to run `npm run copy-css`, which will copy it to the styleguide directory.

Generate the styleguide once:

    $ npm run build

And then we're using a custom template for the styleguide, which lives in
`fec-template/`. To make style changes to the template, you need to edit
`kss.less` and then run:

    $ npm run build-styleguide

Host the styleguide on a local server:

    $ npm install http-server
    $ http-server

To upload screenshots to [percy.io](https://percy.io):

    $ gem install percy
    $ npm run percy

## Using KSS
We use the KSS standard for documenting our Sass. This is both readable to humans and can be used to automatically generate styleguides. Here's an example:

```
// Buttons
// A button suitable for giving stars to someone.
//
// Markup:
// <button>Button</button>
// <button class="primary">Primary Button</button>
//
// :hover             - Subtle hover highlight.
// .primary           - The primary action button
// .disabled          - Dims the button to indicate it cannot be used.
//
// Styleguide 2.1.3.
//
```
