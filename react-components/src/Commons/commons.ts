export const COMPONENT_GROUP = 'AdaptTo() React';
export const COMPONENTPATH = './../ui.apps/src/main/content/jcr_root/apps/react-apps/components/';


export const getComponentPath = (appName: string) => `${COMPONENTPATH}${appName}React`
enum TemplateConfig {
    JavaPath = 'adaptTo.core.components.LoaderComponent',
    Data = '${a.allProperties}'
}
// this very simple template is only used for demo purposes
export const getReactTemplate = (appName: string) => `
<sly data-sly-use.a="${TemplateConfig.JavaPath}">
    <div class="aem-react-component ${appName}" data-params="${TemplateConfig.Data}">
    </div>
    <script>
        (function () {
            var event = document.createEvent('Event');
            event.initEvent('loadaemreactcomponent', true, true);
            document.dispatchEvent(event);
        }());
    </script>
</sly>

<!-- demo purposes only, this should be intergrated in clientlibs or dynamic loading -->
<script src="/apps/settings/wcm/designs/adapt-to/react-components/js/${appName.toLowerCase()}.hash.js"></script>`