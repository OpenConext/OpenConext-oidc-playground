package oidc.endpoints;

import com.nimbusds.oauth2.sdk.GrantType;
import io.restassured.response.Response;
import io.restassured.specification.RequestSpecification;
import oidc.AbstractIntegrationTest;
import org.junit.Test;

import java.io.UnsupportedEncodingException;
import java.util.Map;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

public class UserInfoEndpointTest extends AbstractIntegrationTest {

    @Test
    public void getUserInfo() throws UnsupportedEncodingException {
        userInfo("GET");
        userInfoWithAuthorizationHeader();
    }

    @Test
    public void postUserInfo() throws UnsupportedEncodingException {
        userInfo("POST");
    }

    @Test
    public void userInfoExpired() throws UnsupportedEncodingException {
        String token = getAccessToken();
        expireAccessToken(token);

        Map<String, Object> body = given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded")
                .formParam("access_token", token)
                .post("oidc/userinfo")
                .as(mapTypeRef);
        assertEquals("Access token expired", body.get("message"));
    }

    @Test
    public void userInfoClientCredentials() throws UnsupportedEncodingException {
        String token = getClientCredentialsAccessToken();

        Map<String, Object> body = given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded")
                .formParam("access_token", token)
                .post("oidc/userinfo")
                .as(mapTypeRef);
        assertEquals("UserEndpoint not allowed for Client Credentials", body.get("message"));
    }

    private void userInfo(String method) throws UnsupportedEncodingException {
        String accessToken = getAccessToken();
        RequestSpecification header = given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded");

        Response response = method.equals("POST") ? header
                .formParam("access_token", accessToken)
                .post("oidc/userinfo") :
                header.queryParams("access_token", accessToken).get("oidc/userinfo");
        assertResponse(response);
    }

    private void userInfoWithAuthorizationHeader() throws UnsupportedEncodingException {
        String accessToken = getAccessToken();
        Response response = given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded")
                .header("Authorization", "Bearer " + accessToken)
                .get("oidc/userinfo");
        assertResponse(response);
    }

    private String getAccessToken() throws UnsupportedEncodingException {
        String code = doAuthorize();
        Map<String, Object> body = doToken(code);
        return (String) body.get("access_token");
    }

    private String getClientCredentialsAccessToken() throws UnsupportedEncodingException {
        Map<String, Object> body = doToken(null, "http@//mock-sp", "secret", GrantType.CLIENT_CREDENTIALS);
        return (String) body.get("access_token");
    }

    private void assertResponse(Response response) {
        Map<String, Object> result = response.as(mapTypeRef);
        assertEquals("john.doe@example.org", result.get("email"));
        assertEquals(true, result.containsKey("sub"));
    }
}