package playground.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.springframework.boot.web.error.ErrorAttributeOptions;
import org.springframework.boot.web.servlet.error.ErrorAttributes;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    private static final Log LOG = LogFactory.getLog(ErrorController.class);

    private final ErrorAttributes errorAttributes;
    private final ObjectMapper objectMapper;

    public ErrorController(ErrorAttributes errorAttributes, ObjectMapper objectMapper) {
        this.errorAttributes = errorAttributes;
        this.objectMapper = objectMapper;
    }

    @RequestMapping("/error")
    public ResponseEntity<Map> error(HttpServletRequest request) throws IOException {
        ServletWebRequest webRequest = new ServletWebRequest(request);

        Map<String, Object> result = errorAttributes.getErrorAttributes(webRequest, ErrorAttributeOptions.defaults());

        Throwable error = errorAttributes.getError(webRequest);

        LOG.error("Error has occurred: " + result);

        boolean hasValidStatus = result.containsKey("status") && !result.get("status").equals(999);
        HttpStatus statusCode = hasValidStatus ? HttpStatus.resolve((Integer) result.get("status")) : BAD_REQUEST;
        if (error != null) {
            LOG.error("Exception in /error: ", error);

            result.put("details", error.getMessage());

            if (error instanceof HttpServerErrorException) {
                Map map = objectMapper.readValue(((HttpServerErrorException) error).getResponseBodyAsByteArray(), Map.class);
                if (map.containsKey("status")) {
                    statusCode = HttpStatus.resolve((Integer) map.get("status"));
                }
                return new ResponseEntity<>(map, statusCode);
            }
        }
        return new ResponseEntity<>(result, statusCode);
    }

}
