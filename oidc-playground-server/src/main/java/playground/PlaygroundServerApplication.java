package playground;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.actuate.autoconfigure.audit.AuditAutoConfiguration;
import org.springframework.boot.actuate.autoconfigure.endpoint.jmx.JmxEndpointAutoConfiguration;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.boot.autoconfigure.jmx.JmxAutoConfiguration;
import org.springframework.boot.context.properties.EnableConfigurationProperties;
import org.springframework.boot.micrometer.metrics.autoconfigure.MetricsAutoConfiguration;
import org.springframework.boot.micrometer.metrics.autoconfigure.export.simple.SimpleMetricsExportAutoConfiguration;
import org.springframework.boot.micrometer.metrics.autoconfigure.jvm.JvmMetricsAutoConfiguration;
import org.springframework.scheduling.annotation.EnableScheduling;
import playground.api.ACR;

@SpringBootApplication(exclude = {AuditAutoConfiguration.class,
        JmxAutoConfiguration.class, JmxEndpointAutoConfiguration.class,
        JvmMetricsAutoConfiguration.class, MetricsAutoConfiguration.class, SimpleMetricsExportAutoConfiguration.class,
})
@EnableConfigurationProperties(ACR.class)
@EnableScheduling
public class PlaygroundServerApplication {

    public static void main(String[] args) {
        SpringApplication.run(PlaygroundServerApplication.class, args);
    }

}
