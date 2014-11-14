doiuse
======

Lint CSS for browser support against caniuse database.

**NOTE:** This is a very, very initial release.  Feedback or contributions
are quite welcome!

#Usage: 
`postcss(doiuse(opts)).process(css)`, where `opts` is:
```javascript
{
  `browsers`: ['ie >= 8', '> 1%'] // an autoprefixer-like array of browsers.
  `onUnsupportedFeatureUse`: function(usageInfo) { } // a callback for usages of features not supported by the selected browsers
}
```

And `usageInfo` looks like this:

```javascript
{
  feature: 'css-gradients', //slug identifying a caniuse-db feature
  featureData:{
    missing: {
      // subset of selected browsers that are missing support for this
      // particular feature, mapped to the version and (lack of)support code
      ie: { '8': 'n' }
    },
    caniuseData: { // data from caniuse-db/features-json/[feature].json }
  },
  usage: //the postcss node where that feature is being used.
}
```
    Called once for each usage of each css feature not supported by the selected
    browsers.

License
=======

MIT

**NOTE:** The files in test/cases are from autoprefixer-core, Copyright 2013 Andrey Sitnik <andrey@sitnik.ru>.  Please see https://github.com/postcss/autoprefixer-core.
