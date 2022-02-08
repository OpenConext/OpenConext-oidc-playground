package playground.web;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RestController;

import java.net.URI;
import java.net.URISyntaxException;

@RestController
public class RedirectController {

    private final String contextPath;

    public RedirectController(@Value("${server.servlet.context-path}") String contextPath) {
        this.contextPath = contextPath;
    }

    @GetMapping("/actuator/health")
    public ResponseEntity health() throws URISyntaxException {
        URI location = new URI(String.format("%s/internal/health", contextPath));
        return ResponseEntity.status(HttpStatus.PERMANENT_REDIRECT).location(location).build();
    }

    @GetMapping("/actuator/info")
    public ResponseEntity info() throws URISyntaxException {
        URI location = new URI(String.format("%s/internal/info", contextPath));
        return ResponseEntity.status(HttpStatus.PERMANENT_REDIRECT).location(location).build();
    }
}
