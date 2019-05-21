package playground;

import org.junit.Test;

import static io.restassured.RestAssured.given;
import static org.apache.http.HttpStatus.SC_NOT_FOUND;
import static org.apache.http.HttpStatus.SC_OK;
import static org.hamcrest.Matchers.equalTo;

public class ApplicationTest extends AbstractIntegrationTest {

    @Test
    public void health() throws Exception {
        given()
                .when()
                .get("/oidc/api/actuator/health")
                .then()
                .statusCode(SC_OK)
                .body("status", equalTo("UP"));
    }

    @Test
    public void notFound() throws Exception {
        given()
                .when()
                .get("/oidc/api/nope")
                .then()
                .statusCode(SC_NOT_FOUND)
                .body("error", equalTo("Not Found"));
    }

}