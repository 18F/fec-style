# Viewing the style guide
Clone the repo to your machine and open `styleguide/index.html`. Voila.

# Contributing
Install dependencies
``` 
$ npm install
```

Eventually we'll have a sweet build process for this all. In the mean time, we're using node-sass and kss-node to compile the Sass and generate the styleguide.

Watch the sass:
```
$ node-sass -w scss/ -o css/
```

Generate the styleguide:
```
 $ ./node_modules/.bin/kss-node --config kss-config.json
```

And then we're using a custom template for the styleguide, which lives in `fec-template/`. To make style changes to the template, you need to edit `kss.less` and compile. From `fec-template/`:
```
$ npm run less
```

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
