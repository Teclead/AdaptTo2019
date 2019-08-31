import * as React from 'react';
import * as ReactDOM from 'react-dom';


export const COMPONENT_LOAD_EVENT = 'loadaemreactcomponent';
export const COMPONENT_PLACEHOLDER_CLASS = 'aem-react-component';

interface RegistryInterface {
  [key: string]: () => Promise<{
    default: React.ComponentClass<any> | React.SFC<any>;
  }>;
}

export class Scanner {
  private supportedComponents: string[];
  private registry: RegistryInterface;

  constructor(registry: RegistryInterface) {
    this.registry = registry;
    this.supportedComponents = Object.keys(registry);
    this.setupUnmount();
  }

  onReady = () => {
    window.document.addEventListener(
      COMPONENT_LOAD_EVENT,
      this.scanForComponents
    );
    window.document.removeEventListener('readystatechange', this.onReady);
  };

  // the returned promise resolves when all components are initialized
  init() {
    // wait for document to be ready and listen for dynamically loaded components
    window.document.addEventListener('readystatechange', this.onReady);

    // issue initial scan
    return this.scanForComponents();
  }

  deinit() {
    window.document.removeEventListener('readystatechange', this.onReady);
    window.document.removeEventListener(
      COMPONENT_LOAD_EVENT,
      this.scanForComponents
    );
  }

  setupUnmount() {
    // setup the global array
    if (!(window as any).scanners) {
      (window as any).scanners = [];
    }

    // push the current scanner to the global array
    (window as any).scanners.push(this);

    // check if the reloadFunction hasn't been created by another scanner
    if (!(window as any).reloadReact) {
      // create a function the call unmount on each scanner
      (window as any).reloadReact = () => {
        (window as any).scanners.forEach((scanner: Scanner) => {
          scanner.unmount();
        });
      };
    }
  }

  unmount() {
    // used when edited by authors
    // remove the component
    const components = window.document.getElementsByClassName(
      COMPONENT_PLACEHOLDER_CLASS
    );
    // tslint:disable-next-line:prefer-for-of
    for (const component of components as any) {
      ReactDOM.unmountComponentAtNode(component);
      component.setAttribute('data-is-loaded', 'reload');
    }
    // re render the component
    this.init();
  }

  getComponentLoader(classList: DOMTokenList) {
    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < this.supportedComponents.length; i++) {
      const currentComponentName = this.supportedComponents[i];

      if (classList.contains(currentComponentName)) {
        return this.registry[currentComponentName]().then(mod => {
          return mod.default;
        });
      }
    }

    return undefined;
  }

  scanForComponents = () => {
    const renderings: Array<Promise<void>> = [];
    // all react components
    const reactComponents = document.getElementsByClassName(
      COMPONENT_PLACEHOLDER_CLASS
    );

    // tslint:disable-next-line:prefer-for-of
    for (let i = 0; i < reactComponents.length; i++) {
      const element = reactComponents[i];

      // skip if the component is already loaded
      if (element.getAttribute('data-is-loaded') === 'true') {
        continue;
      }

      const loadComponent = this.getComponentLoader(element.classList);

      if (loadComponent) {
        renderings.push(
          loadComponent.then(Comp => {
            // aem propertys will be injected with data-params from the container div
            let params = {};
            const attributeValue = element.getAttribute('data-params');

            if (attributeValue) {
              try {
                // may throw a SyntaxError if value is not a valid JSON string
                params = JSON.parse(attributeValue);
              } catch (e) {
                // intentionally empty, falls back to empty object
              }
            }

            ReactDOM.render(<Comp {...params} />, element);
            element.setAttribute('data-is-loaded', 'true');
          })
        );
      }
    }

    return Promise.all(renderings);
  };
}
