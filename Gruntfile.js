'use strict';

/**
 * Gruntfile.js template for FA VB app
 *
 * This contains configurations of VB grunt tasks for build & optimizating VB app + perform VB audits.
 & It also defines "fa-cdn" grunt task for producing VB app content on CDN to be used when deploying & serving VB app from FA monolith (Weblogic based environment)
 *
 * Usage:
 * Copy this Gruntfile.js template to <VB app GIT repo root>/ & customize it to tailor your own VB app. See "CUSTOMIZE ME" markers in the template
 * To invoke "fa-cdn" grunt task:
 * - Run 'npm install'
 * - Run './node_modules/.bin/grunt fa-cdn --vbAppID=<value> --vbAppVer=<value> --url:ce=http://exchange.oraclecorp.com/api/0.2.0
 *   e.g. './node_modules/.bin/grunt fa-cdn --vbAppID=payables --vbAppVer=11.13.21.01.0_201221.1826 --url:ce=http://exchange.oraclecorp.com/api/0.2.0'
 * - Output of "fa-cdn" grunt task will be in build/cdn/
 *
 * Dependency:
 * <VB app GIT repo root>/package.json needs to contain following packages and versions (& beyond):
 *   "@oracle/grunt-vb-audit": "https://static.oracle.com/cdn/vb/tools/npm/grunt-vb-audit/grunt-vb-audit-2010.0.4.tar.gz",
 *   "@oracle/grunt-vb-build": "https://static.oracle.com/cdn/vb/tools/npm/grunt-vb-build/grunt-vb-build-2010.0.5.tar.gz",
 *   "edit-json-file": "^1.3.1",
 *   "grunt": "^1.0.3",
 *   "grunt-cli": "^1.3.2",
 *   "load-grunt-tasks": "^4.0.0",
 *   "replace-in-file": "^4.1.3"
 */
module.exports = grunt => {
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    // disable images minification
    'vb-image-minify': {
      options: {
        skip: true,
      },
    },
    'vb-process-local': {
      options: {
        resolveTemplate: {},
      },
    },
    // configure requirejs modules bundling
    'vb-require-bundle': {
      options: {
        transpile: true,
        minify: true,
        bundles: {
          'vb-app-bundle': {
            modules: {
              // Text based files used at run-time that should be included/excluded in the generated optimized bundle
              // CUSTOMIZE ME: Specify below entries for anything needed to be excluded from the optimized bundle relative to what's source
              //               controlled in GIT under <VB app GIT repo root>/webApps/<vbAppID>/ with "!^" expressions in "find" array below.
              //               Examples would be design-time configuration files (private/settings directories) or mock data files that should be excluded.
              find: [
                '.*(.(js|json|html|css))$',
                '!^private',
                '!^resources/mockdata',
                '!^services/businessObjects/service.json',
                '!^settings',
              ],
            },
          },
        },
      },
    },
    copy: {
      cdn: {
        files: [
          // CUSTOMIZE ME: Specify below entries for anything needed to be excluded from the VB app content on CDN relative to what's source
          //               controlled in GIT under <VB app GIT repo root>/webApps/<vbAppID>/ with "!" expressions in "src" array below.
          //               Examples would be design-time configuration files (private/settings directories) or mock data files that should be excluded.
          {
            expand: true,
            cwd: 'build/optimized/webApps/' + grunt.option('vbAppID') + '/',
            src: [
              '**',
              '!private/**',
              '!resources/mockdata/**',
              '!services/businessObjects/service.json',
              '!settings/**',
            ],
            dest:
              'build/cdn/'
              + grunt.option('vbAppID')
              + '/'
              + grunt.option('vbAppVer')
              + '/',
          },
        ],
      },
    },
  });

  /// ///////////////////////////////////////////////////////////////////////
  // Internal implementations begin
  /// ///////////////////////////////////////////////////////////////////////

  // Reference: https://www.npmjs.com/package/replace-in-file#synchronous-replacement
  const replace = require('replace-in-file');

  grunt.registerTask('vb-post-prepare', () => {
    //
    // CUSTOMIZE ME: Review this function and adjust as necessary to transform VB app artifacts from what's source controlled
    //               in GIT to what's needed for the VB app to deploy & serve from FA monolith (Weblogic based environment)
    //

    const editJsonFile = require('edit-json-file');

    // Transform app-flow.json for Weblogic deployment
    var appflow = editJsonFile(
      './build/optimized/webApps/' + grunt.option('vbAppID') + '/app-flow.json',
    );
    var userConfig = {
      type: 'fnd-actions/security/FndSecurityProvider',
      configuration: {
        url: '/fscmRestApi/applcoreApi/v1/fndvbcsuishell/userinfo',
      },
    };
    appflow.set('userConfig', userConfig);

    appflow.set(
      'requirejs.paths.faImages',
      "{{(window.FAEndPoints) ? (window.FAEndPoints['ORA_FSCM_UI'] + 'images') : ''}}",
    );
    appflow.set(
      'requirejs.paths.faResourceBundle',
      "{{(window.FAEndPoints && window.vbInitConfig['BASE_URL_TOKEN']) ? (window.FAEndPoints['ORA_FSCM_UI'] + 'strings' + '/' + window.vbInitConfig['BASE_URL_TOKEN']) : (window.FAEndPoints && (window.FAEndPoints['ORA_FSCM_UI']) ? (window.FAEndPoints['ORA_FSCM_UI'] + 'strings') : 'http://<host>:<port>/<context-root>/strings')}}",
    );
    appflow.save();

    // Transform index.html for Weblogic deployment.

    // Workaround for VB DT limitation https://bug.oraclecorp.com/pls/bug/webbug_edit.edit_info_top?rptno=30159483
    const options = {
      files:
        './build/optimized/webApps/' + grunt.option('vbAppID') + '/index.html',
      from: /<html>/g,
      to: '<html lang="<!-- locale -->" dir="<!-- dir -->">',
    };
    replace.sync(options);
  });

  // Public task for creating content ready to be packaged & publish to CDN
  grunt.registerTask('fa-cdn', () => {
    if (
      grunt.option('vbAppID') === undefined
      || grunt.option('vbAppVer') === undefined
      || grunt.option('url:ce') === undefined
    ) {
      grunt.fail.fatal(
        "Must provide options '--vbAppID=<VB app name under webApps/ in GIT> --vbAppVer=<version> --url:ce=<Exchange URL>'",
      );
    }

    grunt.option('mode', 'fa');
    grunt.option('fa-indexHtml-resolveVariables', false);

    grunt.task.run(['vb-clean', 'vb-process-local', 'vb-package', 'copy:cdn']);
  });
};
