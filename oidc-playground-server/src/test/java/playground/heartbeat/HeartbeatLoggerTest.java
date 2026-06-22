package playground.heartbeat;

import ch.qos.logback.classic.Level;
import ch.qos.logback.classic.Logger;
import ch.qos.logback.classic.spi.ILoggingEvent;
import ch.qos.logback.core.read.ListAppender;
import org.junit.Test;
import org.slf4j.LoggerFactory;

import java.util.List;

import static org.junit.Assert.assertEquals;

public class HeartbeatLoggerTest {

    @Test
    public void emitsMarkAtInfo() {
        Logger logger = (Logger) LoggerFactory.getLogger(HeartbeatLogger.class);
        ListAppender<ILoggingEvent> appender = new ListAppender<>();
        appender.start();
        logger.addAppender(appender);
        try {
            new HeartbeatLogger().mark();

            List<ILoggingEvent> events = appender.list;
            assertEquals(1, events.size());
            assertEquals(Level.INFO, events.getFirst().getLevel());
            assertEquals("MARK", events.getFirst().getFormattedMessage());
        } finally {
            logger.detachAppender(appender);
        }
    }
}
