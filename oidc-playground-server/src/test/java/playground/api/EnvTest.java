package playground.api;

import io.restassured.http.ContentType;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import playground.AbstractIntegrationTest;

import java.util.Collections;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.*;
import static playground.api.Oidc.mapTypeReference;

public class EnvTest extends AbstractIntegrationTest {

    @Test
    public void disclaimer() {
        given()
                .get("oidc/api/disclaimer")
                .then()
                .contentType("text/css");
    }

    @Test
    public void error() {
        given()
                .contentType(ContentType.JSON)
                .body(Collections.singletonMap("error", true))
                .post("oidc/api/report_error")
                .then()
                .statusCode(200);
    }
}