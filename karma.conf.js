/* eslint-env node */
// Karma configuration
// Generated on Thu Jun 30 2016 11:04:09 GMT-0400 (EDT)
//
const webpack = require('webpack')
const webpackConfig = require('./config/webpack/test.js')
const isDocker = require('is-docker')

module.exports = (config) => {
  config.set({
    frameworks: ['jasmine-ajax', 'jasmine'],
    files: [
      'spec/karma_tests.js',
    ],
    preprocessors: {
      './spec/karma_tests.js': ['webpack', 'sourcemap'],
    },
    exclude: [
      './node_modules/',
    ],
    client: {
      captureConsole: true,
    },
    reporters: ['dots'],
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: isDocker() ? ['chrome_headless', 'firefox_headless'] : ['Chrome_no_sandbox', 'Firefox'],
    customLaunchers: {
      Chrome_no_sandbox: {
        base: 'Chrome',
        flags: ['--no-sandbox'],
      },
      chrome_headless: {
        base: 'Chrome',
        flags: [
          '--no-sandbox',
          '--headless',
          '--disable-gpu',
          '--disable-dev-shm-usage',
          ' --remote-debugging-port=9222',
        ],
      },
      firefox_headless: {
        base: 'Firefox',
        flags: ['--headless', '--start-debugger-server'],
      },
    },
    captureTimeout: 60000,
    browserNoActivityTimeout: 30000,
    singleRun: true,
    concurrency: Infinity,
    junitReporter: {
      outputDir: process.env.CI_REPORTS, // results will be saved as $outputDir/$browserName.xml
      outputFile: undefined, // if included, results will be saved as $outputDir/$browserName/$outputFile
      suite: '', // suite will become the package name attribute in xml testsuite element
      useBrowserName: true, // add browser name to report and classes names
      nameFormatter: undefined, // function (browser, result) to customize the name attribute in xml testcase element
      classNameFormatter: undefined, // function (browser, result) to customize the classname attribute in xml testcase element
      properties: {}, // key value pair of properties to add to the <properties> section of the report
    },
    coverageIstanbulReporter: {
      reports: ['html'],
      fixWebpackSourcePaths: true,
      dir: `${process.env.CI_REPORTS}/coverage/js`,
    },
    webpack: {
      mode: 'development',
      devtool: 'inline-source-map',
      module: webpackConfig.module,
      resolve: webpackConfig.resolve,
      performance: {
        hints: false,
      },
      externals: {
        'react/addons': 'react/addons',
        'react/lib/ReactContext': 'react/lib/ReactContext',
        'react/lib/ExecutionEnvironment': 'react/lib/ExecutionEnvironment',
      },
    },
  })
}
