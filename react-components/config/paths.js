'use strict';

const path = require('path');
const fs = require('fs');
const url = require('url');
const registry = require('../src/appRegistry');
const envPublicUrl = process.env.PUBLIC_URL || '/apps/settings/wcm/designs/adapt-to/react-components/';
const appPath = '../ui.apps/src/main/content/jcr_root' + envPublicUrl;

// Make sure any symlinks in the project folder are resolved:
// https://github.com/facebookincubator/create-react-app/issues/637
const appDirectory = fs.realpathSync(process.cwd());
const resolveApp = relativePath => path.resolve(appDirectory, relativePath);



function ensureSlash(path, needsSlash) {
  const hasSlash = path.endsWith('/');
  if (hasSlash && !needsSlash) {
    return path.substr(path, path.length - 1);
  } else if (!hasSlash && needsSlash) {
    return `${path}/`;
  } else {
    return path;
  }
}

const clearReactFiles = (folder) => {
  try {
    fs.readdirSync(folder).forEach((file) => {
      fs.unlinkSync(folder + '/' + file);
    })
  } catch (e) { };
};

function clearFiles() {
  clearReactFiles(resolveApp(appPath + '/js'));
  clearReactFiles(resolveApp(appPath + '/css'));
}




const getAllApps = () => {
  const config = {};
  Object.keys(registry).forEach((appName) => {
    if (typeof registry[appName] == 'string') {
      config[appName] = resolveApp(`src/${registry[appName]}/index.ts`);
    } else {
      config[appName] = registry[appName].map((e) => resolveApp(`src/${e}/index.ts`))
    }
  });
  return config;
}

const getAllServerSideApps = () => {
  const config = {};
  Object.keys(registry).forEach((appName) => {
    if (typeof registry[appName] == 'string') {
      config[appName] = resolveApp(`src/${registry[appName]}/ssr.jsx`);
    } else {
      config[appName] = registry[appName].map((e) => resolveApp(`src/${e}/ssr.jsx`))
    }
  });

  // check if ssr files exist
  // remove app from object when ssr file is missing
  Object.keys(registry).forEach((appName) => {
    const ssrFileExist = fs.existsSync(config[appName]);
    if (!ssrFileExist) {
      delete config[appName];
    }
  })

  return config;
}




const getPublicUrl = appPackageJson =>
  envPublicUrl || require(appPackageJson).homepage;

function getServedPath(appPackageJson) {
  const publicUrl = getPublicUrl(appPackageJson);
  const servedUrl =
    envPublicUrl || (publicUrl ? url.parse(publicUrl).pathname : '/');
  return ensureSlash(servedUrl, true);
}
// config after eject: we're in ./config/
module.exports = {
  dotenv: resolveApp('.env'),
  appBuild: resolveApp(appPath),
  appPublic: resolveApp('public'),
  appHtml: resolveApp('public/index.html'),
  appIndexJs: resolveApp('src/index.ts'),
  appPackageJson: resolveApp('package.json'),
  appSrc: resolveApp('src'),
  yarnLockFile: resolveApp('yarn.lock'),
  testsSetup: resolveApp('src/setupTests.ts'),
  appNodeModules: resolveApp('node_modules'),
  appTsConfig: resolveApp('tsconfig.json'),
  publicUrl: getPublicUrl(resolveApp('package.json')),
  servedPath: getServedPath(resolveApp('package.json')),
  appRegistry: getAllApps(),
  ssrRegistry: getAllServerSideApps(),
  authorLibs: resolveApp('src/AuthorClientLibs'),
  clearFiles: clearFiles
};
