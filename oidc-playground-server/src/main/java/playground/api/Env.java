package playground.api;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.InetAddress;
import java.net.UnknownHostException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;

@RestController
public class Env {

    private static final Logger LOG = LoggerFactory.getLogger(Env.class);

    @Value("${gui.disclaimer.background-color}")
    private String disclaimerBackgroundColor;

    @Value("${gui.disclaimer.content}")
    private String disclaimerContent;

    @Autowired
    private ObjectMapper objectMapper;

    @GetMapping("/disclaimer")
    public void disclaimer(HttpServletResponse response) throws IOException {
        response.setContentType("text/css");
        response.getWriter().write("body::after {background: " + disclaimerBackgroundColor + ";content: \"" +
                disclaimerContent + "\";}");
        response.getWriter().flush();

    }

    @PostMapping("/report_error")
    public void error(@RequestBody Map<String, Object> payload) throws
            JsonProcessingException, UnknownHostException {
        payload.put("dateTime", new SimpleDateFormat("yyyyy-mm-dd hh:mm:ss").format(new Date()));
        payload.put("machine", InetAddress.getLocalHost().getHostName());
        String msg = objectMapper.writeValueAsString(payload);
        LOG.error(msg, new IllegalArgumentException(msg));
    }

}
