require('raf/polyfill');
const jsdom = require('jsdom');
const Adapter = require('enzyme-adapter-react-16');
const chai = require('chai');
const chaiSinon = require('sinon-chai');
const chaiEnzyme = require('chai-enzyme');
const configure = require('enzyme').configure;
const { JSDOM } = jsdom;

chai.use(chaiEnzyme());
chai.use(chaiSinon);
//global.expect = chai.expect;

const documentHTML = '<!doctype html><html><body></body></html>';
const dom = new JSDOM(documentHTML);

global.window = dom.window;
global.document = dom.window.document;

global.navigator = {
    userAgent: 'node.js'
};

const resizeEvent = document.createEvent('Event');
resizeEvent.initEvent('resize', true, true);

global.window.resizeTo = (width, height) => {
  global.window.innerWidth = width || global.window.innerWidth;
  global.window.innerHeight = height || global.window.innerHeight;
  global.window.dispatchEvent(resizeEvent);
}

global.documentRef = document;

configure({ adapter: new Adapter() });
