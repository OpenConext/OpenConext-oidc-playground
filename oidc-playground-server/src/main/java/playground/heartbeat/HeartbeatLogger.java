package playground.heartbeat;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
public class HeartbeatLogger {
    private static final Logger LOG = LoggerFactory.getLogger(HeartbeatLogger.class);

    @Scheduled(cron = "0 0 * * * *")
    public void mark() {
        LOG.info("MARK");
    }
}
