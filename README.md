[![Build Status](https://img.shields.io/travis/18F/fec-style/master.svg)](https://travis-ci.org/18F/fec-style)
[![Test Coverage](https://img.shields.io/codecov/c/github/18F/fec-style/master.svg)](https://codecov.io/github/18F/fec-style)

## Campaign finance for everyone
The Federal Election Commission (FEC) releases information to the public about money that’s raised and spent in federal elections — that’s elections for US President, Senate, and House of Representatives.

Are you interested in seeing how much money a candidate raised? Or spent? How much debt they took on? Who contributed to their campaign? The FEC is the authoritative source for that information.

betaFEC is a collaboration between [18F](http://18f.gsa.gov) and the FEC. It aims to make campaign finance information more accessible (and understandable) to all users.

## FEC repositories
We welcome you to explore, make suggestions, and contribute to our code.

This repository, [fec-style](https://github.com/18F/fec-style), houses our shared styles and user interface components.

### All repositories
- [FEC](https://github.com/18F/fec): a general discussion forum. We [compile feedback](https://github.com/18F/fec/issues) from betaFEC’s feedback widget here, and this is the best place to submit general feedback.
- [openFEC](https://github.com/18F/openfec): betaFEC’s API
- [openFEC-web-app](https://github.com/18f/openfec-web-app): the betaFEC web app for exploring campaign finance data
- [fec-style](https://github.com/18F/fec-style): shared styles and user interface components
- [fec-cms](https://github.com/18F/fec-cms): the content management system (CMS) for betaFEC

## Get involved
We’re thrilled you want to get involved!
- Read our [contributing guidelines](https://github.com/18F/openfec/blob/master/CONTRIBUTING.md). Then, [file an issue](https://github.com/18F/fec/issues) or submit a pull request.
- [Send us an email](mailto:betafeedback@fec.gov).
- If you’re a developer, follow the installation instructions in the README.md page of each repository to run the apps on your computer.
- Check out our StoriesonBoard [FEC story map](https://18f.storiesonboard.com/m/fec) to get a sense of the user needs we'll be addressing in the future.

---


## Set up

You can view the current styleguide on https://pages.18f.gov/fec-style/. It is
updated automatically on every successful push to the `master` branch.


### View the style guide

Clone the repo to your machine and open `styleguide/index.html`. Voila.


### Install dependencies

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

To upload screenshots to [percy.io](https://percy.io):

    $ gem install percy
    $ npm run percy

### Use KSS
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

### Versioning
We use [Semantic Versioning](http://semver.org/):

> Given a version number MAJOR.MINOR.PATCH, increment the:
>
> MAJOR version when you make incompatible API changes,
> MINOR version when you add functionality in a backwards-compatible manner, and
> PATCH version when you make backwards-compatible bug fixes.
> Additional labels for pre-release and build metadata are available as extensions to the MAJOR.MINOR.PATCH format.

When changes in master are ready to be released, follow these steps to update the package version and publish to npm:

    npm version <major | minor | patch>
    git push --follow-tags

Use `npm version minor` or `npm version major` for minor and major updates respectively, and `npm version patch` for small updates that only add small bits of functionality to existing features. For details on npm versioning, see `npm version --help`.

Travis will run a clean build with tests. Assuming all goes well, Travis will
publish to npm for you.

Downstream applications should pin versions as appropriate. For example, to get bug fixes but not new features, pin to the minor version:

    {
        "dependencies": {
            "fec-style": "~1.0"
        }
    }

## Copyright and licensing
This project is in the public domain within the United States, and we waive worldwide copyright and related rights through [CC0 universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/). Read more on our license page.

A few restrictions limit the way you can use FEC data. For example, you can’t use contributor lists for commercial purposes or to solicit donations. Learn more on FEC.gov.
