package playground;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.audit.AuditAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.endpoint.jmx.JmxEndpointAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.metrics.JvmMetricsAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.metrics.MetricsAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.metrics.export.simple.SimpleMetricsExportAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.trace.http.HttpTraceAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import playground.api.ACR;

@SpringBootApplication(exclude = {AuditAutoConfiguration.class, HttpTraceAutoConfiguration.class,
        JmxAutoConfiguration.class, JmxEndpointAutoConfiguration.class,
        JvmMetricsAutoConfiguration.class, MetricsAutoConfiguration.class, SimpleMetricsExportAutoConfiguration.class,
})
@EnableConfigurationProperties(ACR.class)
public class PlaygroundServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlaygroundServerApplication.class, args);
    }

}
