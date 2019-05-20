package playground.api;

import java.io.UnsupportedEncodingException;
import java.net.URLDecoder;
import java.net.URLEncoder;
import java.nio.charset.Charset;

public interface URLSupport {

    default String decode(String s) {
        try {
            return URLDecoder.decode(s, Charset.defaultCharset().toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

    default String encode(String s) {
        try {
            return URLEncoder.encode(s, Charset.defaultCharset().toString());
        } catch (UnsupportedEncodingException e) {
            throw new RuntimeException(e);
        }
    }

}
