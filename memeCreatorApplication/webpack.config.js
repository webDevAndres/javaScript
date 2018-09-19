
// In the module.exports object
// context: is used to specify the absolute path from which the path of files
//      in the entry section needs to be resolved. Here, __dirname is a constant that
//      will automatically include the absolute path of the current directory.
// Entry is used to specify all the fiels that need to be bundled using Webpack.
//      it accepts strings, arrays, and a JSON object. If you need Webpack to bundle a
//      single entry file, just speecify the file's path as a string. Otherwise, use
//      an array or object.
//      In our case, we specifiy input files as objects in the form of [name]: [path_of_the_file]
//      This [name] will be used in name the output bundle of each file
// Output is where we need to specify the absolute path of the output directory, dist in our case, and
//      the filename, which is [name], we specified in the entry section,
//      followed by the file-extension [name].js
// To add a loader in Webpack we need to create an array of rules inside the module section. The rule
//      contains an array of configuration objects for the loaders. In our configuration, it will
//      test the file to see whether it matches the reular expression .js$, that is, check whether
//      the file is a JavaScript file using its extension. We jave also excluded the node_modules
//      directory so that only our code will be evaluated fro the transformation.
// If the imported file is a JavaScript file, Webpack will use babel-loader with the provided options.
//      Here, in options, we instruct Babel to use env and es2015 presets. The es2015 preset will
//      transpule the ES6 code into ES5 format.
// We installed two loaders to budle CSS files
// The first one css-loader resolves all the imports and url() using Webpack. It then returns the
//      completed css file.
// style-loader will add the css to the page so that the styles are active on the page.
// We need to run css-loader first, followed by style-loader, which uses the output returned by
//      css-loader. Webpack exectues the loaders in a last to first order. So, first, css-loader
//      will be executed and its output will be pased over to style-loader
// Bootstrap is written using Less instead of CSS. Less is a CSS pre-processor that extends CSS with more
//      features, such as variables, mixins, and functions. To import Bootstrap's less file using Webpack,
//      we need another loader.npm install -S jquery bootstrap@3, npm install -D less less-loader
// Since Bootstrap is dependent on a lot of fonts, we need to create a separate loader to include them in
//       our bundle and then include them in our rules array. npm install -D file-loader url-loader
// This will tell Webpack if the file size is smaller than 10 KB. Then, simply inline the file into 
//      JavaScript as a data URL. Otherwise, move the file into the fonts folder and create a reference 
//      in JavaScript. This is useful to reduce a network overhead if the file is smaller than 10 KB. 
//      url-loader requires file-loader to be installed as a dependency. Once again, execute npm run webpack
//      and, this time, your Bootstrap less file will be bundled successfully.
// This may look like a lot of work for a few CSS and JS files. But, when you are working on large-scale 
//      applications, these configurations can save hours of development work. The biggest advantage of Webpack is 
//      that you can write the configuration for one project and use it for other projects. So, most of the work we 
//      do here will be done only once. We'll simply copy and use our webpack.config.js file in other projects.
// To make jQuery available in the global scope throughout our web application, we need to use a Webpack plugin
// here is just one more loader that is commonly used - img-loader. There are scenarios when we include images in 
//      CSS and JavaScript. Using Webpack, we can automatically bundle the images while compressing the size of larger 
// To bundle images, we need to use img-loader and url-loader together. npm install -D img-loader
// webpack-dev-server is a small server written using Node.js and Express, which is used to serve the Webpack bundle. 
//      To use webpack-dev-server, we need to install it's dependencies and update our npm scripts, npm install -D webpack-dev-server
//      One great feature of webpack-dev-server is that it is able to do HotModuleReplacement, which will replace a part of code that 
//      has been changed without even reloading the page.
// we need files to be served from the dist/js directory. To do that, we need to set publicPath in our output configuration
// isProduction will be set to true when NODE_ENV is set to production. To include the other two variables in our JavaScript code, 
//      we need to use DefinePlugin in Webpack.
// DefinePlugin will define the constants at compile time, so you can change your environment variables depending on your environment
//       and it will be reflected in the code. Make sure you stringify any value you pass to DefinePlugin
// Since we set up a flag using the isProduction variable, we can use this variable to do various optimizations to the build only
//      when the environment is production
// PurifyCSSPlugin will go through all the HTML files and remove any unnecessary CSS styles that we have defined before bundling 
//      the code. To use PurifyCSSPlugin, we need to install the purifycss-webpack package: npm install -D purifycss-webpack
// glob is an inbuilt module in Node.js. We specify the paths of HTML using glob.sync, which resolves the regular expression 
//      into all the HTML files inside the specified directory. PurifyCSSPlugin will now use these HTML files to purify our styles.
//      The minimize option will minify CSS along with purification. PurifyCSSplugin is useful but it might cause problems with 
//      Bootstrap animations and some other plugins. Make sure you test it well before using it.
// In production, it is recommended to extract all your CSS code into a separate file. This is because CSS files need to be 
//      included at the beginning of the page so that page styles will be applied to HTML while it is loading. However, 
//      since we are bundling CSS together with JavaScript, we are including it at the end of the page. When the page is 
//      loading, it will look like a plain document till the CSS files are loaded.
// ExtractTextPlugin is used to overcome this problem. It will extract all the CSS files in JS code into separate files 
//      with the same name as the JS file it was bundled together with. We can now include that CSS file at the top of our 
//      HTML file, which makes the styles be loaded first. As usual, the first step is to install the package:
//      npm install -D extract-text-webpack-plugin.
// After this, we need to create a new instance of ExtractTextPlugin, which we are going to use with our CSS files.
// Since we are using PurifyCSSPlugin, make sure you include the extractLess object before we create an instance 
//      PurifyCSSPlugin in the plugins array.
// Once you have added ExtractTextPlugin, Webpack will generate two files for each JavaScript file if the JavaScript 
//      file imports CSS. You will have to include the CSS files separately in your HTML. In our case, for memes.js, 
//      it will generate memes.js and memes.css in the dist directory, which needs to be included separately in the HTML file.
//  ExtractTextPlugin will not work properly with Webpack HotModuleReplacement for CSS files. Hence, it's best to include 
//      ExtractTextPlugin only in production
// ---------------------------------------------------------------------------------------------------------------------------

// Import webpack using require('webpack')
const webpack = require('webpack');

module.exports = {
    mode: 'development',
    context: __dirname,
    entry: {
        general: './src/js/general.js',
        memes: './src/js/memes.js',
    },
    output: {
        path: __dirname + "/dist/js",
        filename: '[name].js',
        publicPath: '/dist/js',
    },
    devServer: {
        compress: true,
        port: 8080,
        hot: true,
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /(node_modules)/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['env', 'es2015'],
                    }
                }
            },
            {
                test: /\.(svg|eot|ttf|woff|woff2)$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'fonts/[name].[ext]'
                }
            },
            {
                test: /\.(png|jpg|gif)$/,
                loaders: [
                    {
                        loader: 'url-loader',
                        options: {
                            limit: 10000,
                            name: 'images/[name].[ext]'
                        }
                    },
                    'img-loader'
                ],
            },
            {
                test: /\.(less|css)$/,
                use: [
                    {
                        loader: "style-loader"
                    },
                    {
                        loader: "css-loader",
                        options: {
                            sourceMap: true
                        }
                    },
                    {
                        loader: "less-loader",
                        options: {
                            sourceMap: true
                        }
                    }
                ],
            },
        ]
    },
    devtool: 'source-map',
    plugins: [
        new webpack.ProvidePlugin({
            jQuery: 'jquery',
            $: 'jquery',
            jquery: 'jquery'
        }),
        new webpack.HotModuleReplacementPlugin()
    ],
}