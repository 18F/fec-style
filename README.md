[![Build Status](https://img.shields.io/travis/18F/fec-style/master.svg)](https://travis-ci.org/18F/fec-style)
[![Dependencies](https://img.shields.io/gemnasium/18F/fec-style.svg)](https://gemnasium.com/18F/fec-style)
[![Test Coverage](https://img.shields.io/codecov/c/github/18F/fec-style/master.svg)](https://codecov.io/github/18F/fec-style)

## Campaign finance for everyone
The Federal Election Commission (FEC) releases information to the public about money that’s raised and spent in federal elections — that’s elections for US President, Senate, and House of Representatives.

Are you interested in seeing how much money a candidate raised? Or spent? How much debt they took on? Who contributed to their campaign? The FEC is the authoritative source for that information.

The new FEC.gov is a collaboration between [18F](http://18f.gsa.gov) and the FEC. It aims to make campaign finance information more accessible (and understandable) to all users.

## FEC repositories
We welcome you to explore, make suggestions, and contribute to our code.

This repository, [fec-style](https://github.com/18F/fec-style), houses our shared styles and user interface components.

### All repositories
- [FEC](https://github.com/18F/fec): a general discussion forum. We [compile feedback](https://github.com/18F/fec/issues) from the FEC.gov feedback widget here, and this is the best place to submit general feedback.
- [openFEC](https://github.com/18F/openfec): The first RESTful API for the Federal Election Commission
- [openFEC-web-app](https://github.com/18f/openfec-web-app): the FEC’s web app for exploring campaign finance data
- [fec-style](https://github.com/18F/fec-style): shared styles and user interface components
- [fec-cms](https://github.com/18F/fec-cms): the content management system (CMS) for the new FEC.gov

## Get involved
We’re thrilled you want to get involved!
- All contributions to this project will be released under the CC0 dedication alongside the public domain portions of this project. Read our [contributing guidelines](https://github.com/18F/openfec/blob/master/CONTRIBUTING.md). Then, [file an issue](https://github.com/18F/fec/issues) or submit a pull request.
- [Send us an email](mailto:betafeedback@fec.gov).
- If you’re a developer, follow the installation instructions in the README.md page of each repository to run the apps on your computer.
- Check out our StoriesonBoard [FEC story map](https://18f.storiesonboard.com/m/fec) to get a sense of the user needs we'll be addressing in the future.

---


## Set up

### Install dependencies

    $ npm install

Generate icons:

    $ npm build-icons

Run unit tests:

    $ npm test


### Style Guide

The FEC Pattern Library is accessible [on this Github repo](https://github.com/18F/fec-pattern-library).


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

## Licensing and attribution

A few parts of this project are not in the public domain. Attribution and licensing information for those parts are described in detail in [LICENSE.md](LICENSE.md).

The rest of this project is in the worldwide public domain, released under the [CC0 1.0 Universal public domain dedication](https://creativecommons.org/publicdomain/zero/1.0/). Read more in [LICENSE.md](LICENSE.md).
