package playground.web;

import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.core.annotation.AnnotationUtils;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.ResponseStatus;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.UnsupportedEncodingException;
import java.net.URISyntaxException;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    private static final Log LOG = LogFactory.getLog(ErrorController.class);

    private ErrorAttributes errorAttributes;

    @Autowired
    public ErrorController(ErrorAttributes errorAttributes) {
        this.errorAttributes = errorAttributes;
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }

    @RequestMapping("/error")
    public ResponseEntity error(HttpServletRequest request) throws UnsupportedEncodingException, URISyntaxException {
        ServletWebRequest webRequest = new ServletWebRequest(request);
        Map<String, Object> result = this.errorAttributes.getErrorAttributes(webRequest, false);

        LOG.error("Error has occurred: " + result);

        Throwable error = this.errorAttributes.getError(webRequest);
        boolean status = result.containsKey("status") && !result.get("status").equals(999);
        HttpStatus statusCode = status ? HttpStatus.resolve((Integer) result.get("status")) : BAD_REQUEST;
        if (error != null) {
            LOG.error("Exception in /error: ", error);

            result.put("details", error.getMessage());
            ResponseStatus annotation = AnnotationUtils.getAnnotation(error.getClass(), ResponseStatus.class);
            statusCode = annotation != null ? annotation.value() : statusCode;
        }
        HttpHeaders headers = new HttpHeaders();
        return new ResponseEntity<>(result, headers, statusCode);
    }

}
