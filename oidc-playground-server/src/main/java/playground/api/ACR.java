package playground.api;

import lombok.Getter;
import lombok.Setter;
import org.springframework.boot.context.properties.ConfigurationProperties;

import java.util.List;

@ConfigurationProperties(prefix = "acr")
@Getter
@Setter
public class ACR {

    private List<String> values;

}
