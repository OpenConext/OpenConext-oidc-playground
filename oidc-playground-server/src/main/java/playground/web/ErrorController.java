package playground.web;

import com.fasterxml.jackson.databind.ObjectMapper;
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
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.context.request.ServletWebRequest;

import javax.servlet.http.HttpServletRequest;
import java.io.IOException;
import java.util.Map;

import static org.springframework.http.HttpStatus.BAD_REQUEST;

@RestController
public class ErrorController implements org.springframework.boot.web.servlet.error.ErrorController {

    private static final Log LOG = LogFactory.getLog(ErrorController.class);

    private ErrorAttributes errorAttributes;
    private ObjectMapper objectMapper;

    public ErrorController(ErrorAttributes errorAttributes, ObjectMapper objectMapper) {
        this.errorAttributes = errorAttributes;
        this.objectMapper = objectMapper;
    }

    @Override
    public String getErrorPath() {
        return "/error";
    }

    @RequestMapping("/error")
    public ResponseEntity error(HttpServletRequest request) throws IOException {
        ServletWebRequest webRequest = new ServletWebRequest(request);
        Map<String, Object> result = this.errorAttributes.getErrorAttributes(webRequest, false);

        LOG.error("Error has occurred: " + result);

        Throwable error = this.errorAttributes.getError(webRequest);
        boolean hasValidStatus = result.containsKey("status") && !result.get("status").equals(999);
        HttpStatus statusCode = hasValidStatus ? HttpStatus.resolve((Integer) result.get("status")) : BAD_REQUEST;
        if (error != null) {
            LOG.error("Exception in /error: ", error);

            result.put("details", error.getMessage());

            if (error instanceof HttpServerErrorException.InternalServerError) {
                Map map = objectMapper.readValue(((HttpServerErrorException.InternalServerError) error).getResponseBodyAsByteArray(), Map.class);
                return new ResponseEntity<>(map, statusCode);
            }

            ResponseStatus annotation = AnnotationUtils.getAnnotation(error.getClass(), ResponseStatus.class);
            statusCode = annotation != null ? annotation.value() : statusCode;
        }
        return new ResponseEntity<>(result, statusCode);
    }

}
