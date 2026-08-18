package playground;

import org.junit.Test;
import org.springframework.http.HttpStatus;

import static io.restassured.RestAssured.given;
import static org.hamcrest.Matchers.equalTo;

public class ApplicationTest extends AbstractIntegrationTest {

    @Test
    public void health() throws Exception {
        given()
                .when()
                .get("/oidc/api/actuator/health")
                .then()
                .statusCode(HttpStatus.OK.value())
                .body("status", equalTo("UP"));
    }

    @Test
    public void notFound() throws Exception {
        given()
                .when()
                .get("/oidc/api/nope")
                .then()
                .statusCode(HttpStatus.NOT_FOUND.value())
                .body("error", equalTo("Not Found"));
    }

}