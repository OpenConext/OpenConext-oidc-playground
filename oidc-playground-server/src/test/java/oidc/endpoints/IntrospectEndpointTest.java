package oidc.endpoints;

import com.nimbusds.oauth2.sdk.GrantType;
import com.nimbusds.oauth2.sdk.ParseException;
import com.nimbusds.oauth2.sdk.TokenIntrospectionRequest;
import com.nimbusds.oauth2.sdk.http.CommonContentTypes;
import com.nimbusds.oauth2.sdk.http.HTTPRequest;
import oidc.AbstractIntegrationTest;
import org.junit.Test;

import java.io.UnsupportedEncodingException;
import java.net.MalformedURLException;
import java.net.URL;
import java.util.Map;

import static com.nimbusds.oauth2.sdk.http.HTTPRequest.Method.POST;
import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;

public class IntrospectEndpointTest extends AbstractIntegrationTest {

    @Test
    //https://bitbucket.org/connect2id/oauth-2.0-sdk-with-openid-connect-extensions/issues/265
    public void introspectContract() throws MalformedURLException, ParseException {
        HTTPRequest request = new HTTPRequest(POST, new URL("http://localhost:8080/introspect"));
        request.setContentType(CommonContentTypes.APPLICATION_URLENCODED);
        request.setQuery("token=123456");
        //https://tools.ietf.org/html/rfc7662 is vague about the authorization requirements, but apparently this is ok
        TokenIntrospectionRequest.parse(request);
    }

    @Test
    public void introspection() throws UnsupportedEncodingException {
        Map<String, Object> result = doIntrospection("http@//mock-sp", "secret");
        assertEquals(true, result.get("active"));
    }

    @Test
    public void introspectionClientCredentials() {
        Map<String, Object> body = doToken(null, "http@//mock-sp", "secret", GrantType.CLIENT_CREDENTIALS);
        String accessToken = (String) body.get("access_token");
        Map<String, Object> result = callIntrospection("http@//mock-sp", accessToken, "secret");
        assertEquals(true, result.get("active"));
        assertEquals("openid,groups", result.get("scope"));
        assertEquals("http@//mock-sp", result.get("sub"));
    }

    @Test
    public void introspectionWithExpiredAccessToken() throws UnsupportedEncodingException {
        String accessToken = getAccessToken();
        expireAccessToken(accessToken);
        Map<String, Object> result = callIntrospection("http@//mock-sp", accessToken, "secret");
        assertEquals(false, result.get("active"));
    }

    @Test
    public void introspectionBadCredentials() throws UnsupportedEncodingException {
        String code = doAuthorize();
        Map<String, Object> body = doToken(code);
        Map<String, Object> result = given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded")
                .formParam("token", body.get("access_token"))
                .post("oidc/introspect")
                .as(mapTypeRef);
        assertEquals("Invalid user / secret", result.get("details"));
    }

    @Test
    public void introspectionNoResourceServer() throws UnsupportedEncodingException {
        Map<String, Object> result = doIntrospection("http@//mock-rp", "secret");
        assertEquals("Requires ResourceServer", result.get("details"));
    }

    @Test
    public void introspectionWrongSecret() throws UnsupportedEncodingException {
        Map<String, Object> result = doIntrospection("http@//mock-sp", "nope");
        assertEquals("Invalid user / secret", result.get("details"));
    }

    private Map<String, Object> doIntrospection(String clientId, String secret) throws UnsupportedEncodingException {
        String accessToken = getAccessToken();
        return callIntrospection(clientId, accessToken, secret);
    }

    private String getAccessToken() throws UnsupportedEncodingException {
        String code = doAuthorize();
        Map<String, Object> body = doToken(code);
        return (String) body.get("access_token");
    }

    private Map<String, Object> callIntrospection(String clientId, String accessToken, String secret) {
        return given()
                .when()
                .header("Content-type", "application/x-www-form-urlencoded")
                .auth()
                .preemptive()
                .basic(clientId, secret)
                .formParam("token", accessToken)
                .post("oidc/introspect")
                .as(mapTypeRef);
    }
}