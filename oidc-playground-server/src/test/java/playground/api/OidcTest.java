package playground.api;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod;
import io.restassured.http.ContentType;
import io.restassured.mapper.TypeRef;
import io.restassured.response.Response;
import org.apache.commons.codec.binary.Base64;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.http.MediaType;
import org.springframework.web.util.UriComponentsBuilder;
import playground.AbstractIntegrationTest;

import java.io.IOException;
import java.util.Arrays;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching;
import static com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod.S256;
import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static playground.api.Oidc.mapTypeReference;

public class OidcTest extends AbstractIntegrationTest {

    private TypeRef<Map<String, Object>> mapTypeRef = new TypeRef<Map<String, Object>>() {
    };

    @Rule
    public WireMockRule wireMockRule = new WireMockRule();

    @Test
    public void discovery() throws IOException {
        Map<String, Object> result = given()
                .header("Content-type", "application/json")
                .get("oidc/api/discovery")
                .as(mapTypeRef);
        Map<String, Object> expected = objectMapper.readValue(new ClassPathResource("discovery_endpoint.json").getInputStream(), mapTypeReference);
        assertEquals(expected, result);
    }

    @Test
    public void authorize() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8080/authorize")
                .p("response_type", "code")
                .p("scope", Arrays.asList("openid", "groups"))
                .p("claims", Arrays.asList("email", "edumember_is_member_of"))
                .p("nonce", "some_nonce");

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid groups")
                .p("claims", "{\"id_token\":{\"edumember_is_member_of\":null,\"email\":null}}")
                .p("response_type", "code")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground_client")
                .p("nonce", "some_nonce");

        assertEquals(expected, queryParams);
    }

    @Test
    public void implicit() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8080/authorize")
                .p("response_type", "implicit")
                .p("scope", Arrays.asList("openid", "groups"))
                .p("state", "example");

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid groups")
                .p("response_type", "implicit")
                .p("response_mode", "fragment")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground_client")
                .p("state", "example");

        assertEquals(expected, queryParams);
    }

    @Test
    public void clientCredentials() throws IOException {
        doToken("client_credentials", "client_credentials");
    }

    @Test
    public void token() throws IOException {
        doToken("authorization_code", "token");
    }

    @Test
    public void refreshToken() throws IOException {
        doToken("refresh_token", "token");
    }

    private void doToken(String grantType, String path) throws IOException {
        Map<String, Object> body = new FluentMap()
                .p("token_endpoint", "http://localhost:8080/token")
                .p("grant_type", grantType)
                .p("scope", Arrays.asList("openid", "groups"))
                .p("state", "example");


        stubFor(post(urlPathMatching("/token"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(readFile("oidc_response.json"))));

        Map<String, Object> map = given()
                .accept(ContentType.JSON)
                .header("Content-type", "application/json")
                .body(body)
                .post("/oidc/api/" + path)
                .as(mapTypeRef);

        assertTrue(map.containsKey("request_body"));
        assertTrue(map.containsKey("request_headers"));
        assertTrue(map.containsKey("request_url"));

        Map<String, Object> result = (Map<String, Object>) map.get("result");
        assertTrue(result.containsKey("access_token"));
    }

    @Test
    public void decodeJwtToken() throws IOException {
        Map<String, Object> map = objectMapper.readValue(new ClassPathResource("oidc_response.json").getInputStream(), mapTypeReference);
        String idToken = (String) map.get("id_token");

        Map<String, Map<String, Object>> result = given()
                .accept(ContentType.JSON)
                .queryParam("jwt", idToken)
                .get("oidc/api/decode_jwt")
                .as(new TypeRef<Map<String, Map<String, Object>>>() {
                });

        Map<String, Object> header = result.get("header");
        assertEquals("oidc", header.get("kid"));

        Map<String, Object> payload = result.get("payload");
        assertEquals("playground_client", payload.get("aud"));
    }

    @Test
    public void codeChallenge() {
        Map<String, Object> result = doPost(new HashMap<>(), "code_challenge").as(mapTypeRef);

        assertTrue(Base64.isBase64((String) result.get("codeChallenge")));
        assertEquals(43, ((String) result.get("codeVerifier")).length());
        assertEquals(S256, CodeChallengeMethod.parse((String) result.get("codeChallengeMethod")));
    }

    @Test
    public void redirect() {
        given().redirects().follow(false)
                .header("Content-type", MediaType.APPLICATION_FORM_URLENCODED_VALUE)
                .formParams(new FluentMap().p("state", "value").p("code", "123456"))
                .post("/oidc/api/redirect")
                .then()
                .header("Location", "http://localhost:3000/redirect?code=123456&state=value");

    }

    private Map<String, String> doPostForAuthorize(Map<String, Object> body, String path) {
        String url = doPost(body, path)
                .then()
                .extract()
                .path("url");

        return UriComponentsBuilder.fromUriString(url)
                .build()
                .getQueryParams()
                .toSingleValueMap()
                .entrySet()
                .stream()
                .collect(Collectors.toMap(e -> e.getKey(), e -> decode(e.getValue())));
    }

    private Response doPost(Map<String, Object> body, String path) {
        return given()
                .header("Content-type", "application/json")
                .accept(ContentType.JSON)
                .body(body)
                .post("/oidc/api/" + path);

    }


}