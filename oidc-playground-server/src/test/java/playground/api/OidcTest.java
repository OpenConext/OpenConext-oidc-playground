package playground.api;

import io.restassured.mapper.TypeRef;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import playground.AbstractIntegrationTest;

import java.io.IOException;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;
import static playground.api.Oidc.mapTypeReference;

public class OidcTest extends AbstractIntegrationTest {

    @Test
    public void discovery() throws IOException {
        Map<String, Object> result = given()
                .when()
                .header("Content-type", "application/json")
                .get("oidc/api/discovery")
                .as(new TypeRef<Map<String, Object>>() {
                });
        Map<String, Object> expected = objectMapper.readValue(new ClassPathResource("discovery_endpoint.json").getInputStream(), mapTypeReference);
        assertEquals(expected, result);

    }
}