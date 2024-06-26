const path = require('path');
const fs = require('fs');
const webpack = require('webpack');
const TerserPlugin = require('terser-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const AdvancedPreset = require('cssnano-preset-advanced');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const WorkboxPlugin = require('workbox-webpack-plugin');
const BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;
const { execSync } = require('child_process');
const MangleCssClassPlugin = require('mangle-css-class-webpack-plugin');

async function makeDirectory(path) {
  // Check if the path already exists
  try {
    await fs.promises.access(path);
    // If there is no error, it means the path already exists
    console.log('Given directory already exists!');
  } catch (error) {
    // If there is an error, it means the path does not exist
    // Try to create the directory
    try {
      await fs.promises.mkdir(path, { recursive: true });
      // If there is no error, log a success message
      console.log('New directory created successfully!');
    } catch (error) {
      // If there is an error, log it
      console.error(error);
      process.exit(1);
    }
  }
}

async function createTextFile(filePath, data, encoding = 'utf-8') {
  try {
    await fs.promises.writeFile(filePath, data, { encoding });
    return `Text file '${filePath}' has been created successfully with ${encoding} encoding!`;
  } catch (err) {
    throw new Error(`Error writing to file: ${err}`);
  }
}

function generateRandomString(length) {
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    result += charset[randomIndex];
  }
  return result;
}

const workflowRunNumber = parseInt(execSync('echo $GITHUB_RUN_NUMBER').toString().trim());
const commitHash = execSync('git rev-parse HEAD').toString().trim();
const thisVersion = {
  build: workflowRunNumber,
  hash: commitHash.substring(0, 7),
  fullHash: commitHash
};

async function outputVersionJSON() {
  await makeDirectory('dist');
  await createTextFile('./dist/version.json', JSON.stringify(thisVersion, null, 2));
}

outputVersionJSON();

module.exports = (env, argv) => {
  const isProduction = argv.mode === 'production';
  return {
    plugins: [
      new MiniCssExtractPlugin({
        filename: '[contenthash].min.css' // Output CSS filename
      }),
      new MangleCssClassPlugin({
        classNameRegExp: '(css_|v-cssvar-)[a-z0-9_-]*',
        mangleCssVariables: true,
        /*ignorePrefix: [''],*/
        log: true
      }),
      new webpack.DefinePlugin({
        'process.env': {
          VERSION: JSON.stringify(thisVersion.hash) // You can adjust the length of the random string here (e.g., 8 characters)
        }
      }),
      new HtmlWebpackPlugin({
        template: './src/index.html', // Path to your custom HTML template file
        inject: 'head' // Specify 'body' to insert the script tags just before the closing </body> tag
      }),
      new WorkboxPlugin.GenerateSW({
        clientsClaim: true,
        skipWaiting: true,
        exclude: [/\.map$/, /LICENSE\.txt$/],
        include: [/\.js|css|png$/],
        cacheId: `vector-${thisVersion.hash}`,
        runtimeCaching: [
          {
            urlPattern: new RegExp('^https://fonts.googleapis.com'),
            handler: 'StaleWhileRevalidate',
            options: {
              cacheName: 'google-fonts-stylesheets'
            }
          }
        ]
      }),
      new BundleAnalyzerPlugin({
        analyzerMode: 'static', // Generate static HTML report
        reportFilename: 'dist/bundle-analysis-report.html' // Output file path and name
      })
    ],
    target: ['web', 'es6'], // Target the browser environment (es6 is the default for browsers)
    mode: 'production', // Set the mode to 'production' or 'development'
    entry: './src/index.ts', // Entry point of your application
    output: {
      filename: isProduction ? '[contenthash].min.js' : 'index.js', // Output bundle filename
      path: path.resolve(__dirname, 'dist'), // Output directory for bundled files
      publicPath: './',
      library: {
        name: 'vector',
        type: 'umd',
        umdNamedDefine: true,
        export: 'default'
      }
    },
    module: {
      rules: [
        {
          test: /\.js|ts|jsx|tsx?$/, // Use babel-loader for TypeScript files
          exclude: /node_modules/,
          use: {
            loader: 'babel-loader',
            options: {
              presets: ['@babel/preset-env', '@babel/preset-flow', 'babel-preset-modules', '@babel/preset-typescript'],
              plugins: ['@babel/plugin-syntax-flow']
            }
          }
        },
        {
          test: /\.css|less?$/,
          use: [MiniCssExtractPlugin.loader, 'css-loader']
        }
      ]
    },
    resolve: {
      extensions: ['.ts', '.tsx', '.js', '.jsx', '.css'], // File extensions to resolve
      mainFields: ['browser', 'module', 'main']
    },
    optimization: {
      minimize: isProduction,
      minimizer: [
        new TerserPlugin({
          terserOptions: {
            compress: {
              drop_console: [/*'log',*/ 'assert', 'clear', 'count', 'countReset', 'debug', 'dir', 'dirxml', /* 'error',*/ 'group', 'groupCollapsed', 'groupEnd', 'info', 'profile', 'profileEnd', 'table', 'time', 'timeEnd', 'timeLog', 'timeStamp', 'trace', 'warn']
            }
          }
        }),
        new CssMinimizerPlugin({
          parallel: 4,
          minimizerOptions: {
            preset: [
              'default',
              AdvancedPreset,
              {
                discardComments: { removeAll: true }
              }
            ]
          }
        })
      ],
      splitChunks: {
        chunks: 'all',
        minSize: 20000,
        maxSize: 90000,
        cacheGroups: {
          // Define your cache groups here with specific rules
          default: {
            minChunks: 1,
            priority: -20,
            reuseExistingChunk: true
          }
          // Add more cache groups if needed
        }
      }
    },
    devtool: 'source-map',
    devServer: {
      contentBase: path.join(__dirname, 'dist'),
      hot: true
    }
    // Add any additional plugins and configurations as needed
  };
};