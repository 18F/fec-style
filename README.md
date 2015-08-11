# Getting started (work in progress)
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
