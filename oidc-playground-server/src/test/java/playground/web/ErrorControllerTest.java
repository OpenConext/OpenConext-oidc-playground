package playground.web;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.junit.Test;
import org.springframework.boot.web.servlet.error.DefaultErrorAttributes;
import org.springframework.mock.web.MockHttpServletRequest;

import java.io.IOException;

import static org.junit.Assert.assertEquals;

public class ErrorControllerTest {

    private ErrorController errorController = new ErrorController(new DefaultErrorAttributes(), new ObjectMapper());

    @Test
    public void error() throws IOException {
        MockHttpServletRequest request = new MockHttpServletRequest();
        request.setAttribute("javax.servlet.error.exception", new IllegalArgumentException());
        assertEquals(400, errorController.error(request).getStatusCodeValue());
    }
}