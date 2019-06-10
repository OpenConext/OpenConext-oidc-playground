package playground.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.mock.web.MockHttpServletRequest;
import org.springframework.web.client.HttpServerErrorException;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Collections;

import static org.junit.Assert.assertEquals;

public class ErrorControllerTest {
    private ObjectMapper objectMapper = new ObjectMapper();
    private ErrorController errorController = new ErrorController(new DefaultErrorAttributes(), objectMapper);


    @Test
    public void error() throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("javax.servlet.error.exception", new IllegalArgumentException());
        assertEquals(400, errorController.error(request).getStatusCodeValue());
    }

    @Test
    public void errorPath() {
        assertEquals("/error", errorController.getErrorPath());
    }

    @Test
    public void errorInternalServerError() throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("javax.servlet.error.exception",
                HttpServerErrorException.create(HttpStatus.INTERNAL_SERVER_ERROR, "Error", new HttpHeaders(),
                        objectMapper.writeValueAsBytes(Collections.singletonMap("key", "value")), Charset.defaultCharset()));
        assertEquals("value", errorController.error(request).getBody().get("key"));
    }
}