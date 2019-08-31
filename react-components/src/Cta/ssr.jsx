import 'core-js/es6/map';
import 'core-js/es6/set';
import React from 'react';
import ReactDOMServer from 'react-dom/server';
import Cta from './Cta';

// properties is injected from AEM
let title = properties;


var json = JSON.parse(title);

renderedHtml = ReactDOMServer.renderToString(<Cta {...json}></Cta>);
