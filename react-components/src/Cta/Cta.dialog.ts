import { AEMTouchUIDialog, TouchUIField } from '@teclead/aem-generator/models';
import {
  TouchUIXMLGenerator
} from '@teclead/aem-generator';
import { COMPONENT_GROUP, getReactTemplate, getComponentPath } from '../Commons/commons';

const appName = 'cta';
const dropDownOptions = [];
for (let i = 0; i <= 10; i++) {
  dropDownOptions.push({ value: 'val ' + i, name: 'Label ' + i })
}

export const ctaDialog: AEMTouchUIDialog = {
  componentPath: getComponentPath(appName),
  sightlyTemplate: getReactTemplate(appName),
  componentName: 'Button-React',
  componentGroup: COMPONENT_GROUP,
  componentDescription: 'AdaptTo() Demo Component for a React Button',
  tabs: [{
    title: 'My first Tab',
    fields: [
      { label: 'Text field', databaseName: 'text', type: TouchUIField.Text },
      { label: 'Text Area', databaseName: 'textArea', type: TouchUIField.TextArea },
      { label: 'Dropdown field', databaseName: 'dropdown', type: TouchUIField.Dropwdown, options: dropDownOptions },
      { label: 'Pathfield', databaseName: 'path', type: TouchUIField.Path, },
      { label: 'Checkbox', databaseName: 'check', type: TouchUIField.Checkbox, },
      { label: 'Image', databaseName: 'img', type: TouchUIField.Imagefield }
    ]
  }]
};

new TouchUIXMLGenerator(ctaDialog).writeFilesToAEM();
