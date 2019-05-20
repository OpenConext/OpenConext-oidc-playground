package playground.api;

import java.util.HashMap;

public class FluentMap extends HashMap<String, Object> {

    public FluentMap p(String key, Object value) {
        super.put(key, value);
        return this;
    }
}
