
package adaptTo.core.components;

import com.adobe.cq.sightly.WCMUsePojo;
import com.google.gson.JsonObject;
import com.google.gson.JsonArray;
import org.apache.sling.api.resource.Resource;
import org.apache.sling.api.resource.ValueMap;
import java.util.*;
import java.util.stream.StreamSupport;

public class LoaderComponent extends WCMUsePojo {

    @Override
    public void activate() {

    }

    public String getTest() {
        return "test";
    }

    /**
     * This method does the same like getAllProperties(), but returns the values as
     * a JsonObject instead of a String.
     *
     * @return JsonObject
     */
    public String getAllProperties() {
        return this.resourceToJson(getComponentContext().getResource()).toString();
    }

    protected JsonObject resourceToJson(Resource resource) {

        JsonObject json = new JsonObject();
        ValueMap valueMap = resource.getValueMap();

        for (Map.Entry<String, Object> e : valueMap.entrySet()) {

            String key = e.getKey();
            String val = e.getValue().toString();

            boolean valIsArray = String[].class.equals(e.getValue().getClass());

            // without standard jcr: values
            if (key.contains("jcr:")) {
                continue;
            }

            /*
             * nested Models like bild.url = '/image.jpg' bild.name = 'Testsiegel'
             */
            if (key.contains(".")) {
                String[] splitKey = key.split("\\.");
                boolean hasNestedJson = json.getAsJsonObject(splitKey[0]) != null
                        && json.getAsJsonObject(splitKey[0]).isJsonObject();

                if (hasNestedJson) {
                    // update the existing nested json
                    json.getAsJsonObject(splitKey[0]).addProperty(splitKey[1], val);
                } else {
                    // create a new nested json
                    JsonObject nestedJson = new JsonObject();
                    nestedJson.addProperty(splitKey[1], val);
                    json.add(splitKey[0], nestedJson);
                }

            } else {
                if (valIsArray) {
                    json.add(key, getJsonArray(e.getValue()));
                } else {
                    json.addProperty(key, val);
                }
            }
        }

        for (Resource child : resource.getChildren()) {
            // if a child has children it should be like an Array of Objects
            // otherwise a child is an Object
            if (getChildrenCount(child) >= 1) {
                JsonArray jsonArray = new JsonArray();
                for (Resource nestedChild : child.getChildren()) {
                    jsonArray.add(resourceToJson(nestedChild));
                }
                json.add(child.getName(), jsonArray);
            } else {
                json.add(child.getName(), resourceToJson(child));
            }
        }
        return json;
    }

    public long getChildrenCount(Resource resource) {
        return StreamSupport.stream(resource.getChildren().spliterator(), false).count();
    }

    protected JsonArray getJsonArray(Object arrayAsObject) {
        try {
            JsonArray jsonArray = new JsonArray();
            for (String e : (String[].class).cast(arrayAsObject)) {
                jsonArray.add(e);
            }
            return jsonArray;
        } catch (Exception e) {

            return null;
        }

    }
}
