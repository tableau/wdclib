# wdclib

The shim_lib package is used to generate the WDC shim library which must be included by every web data connector. It works by using webpack to combine all of the various files in the package into a single bundle.js file as well as a minified version of that file.

!Please run all these commands from shim_lib folder, before running any of the following task, install required node packages by running "npm install"

#### Usage:
Build unminified version of shim and copy to ./dist
```sh
npm run build
```

Build minified version of shim and copy to ./dist
```sh
npm run build_min
```

Build both versions of shim, copy them to ../js with appropriate versions number and checkout/add in perforce:
```sh
npm run build_and_copy
```
