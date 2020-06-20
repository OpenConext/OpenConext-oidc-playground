package playground.api;

import com.github.tomakehurst.wiremock.junit.WireMockRule;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.oauth2.sdk.ResponseType;
import com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod;
import io.restassured.http.ContentType;
import io.restassured.mapper.TypeRef;
import io.restassured.response.Response;
import org.apache.commons.codec.binary.Base64;
import org.junit.Rule;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.util.UriComponentsBuilder;
import playground.AbstractIntegrationTest;

import java.io.IOException;
import java.text.ParseException;
import java.util.ArrayList;
import java.util.HashMap;
import java.util.Map;
import java.util.stream.Collectors;

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse;
import static com.github.tomakehurst.wiremock.client.WireMock.post;
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor;
import static com.github.tomakehurst.wiremock.client.WireMock.urlPathMatching;
import static com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod.S256;
import static io.restassured.RestAssured.given;
import static java.util.Arrays.asList;
import static java.util.Collections.singletonList;
import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertTrue;
import static playground.api.Oidc.mapTypeReference;

public class OidcTest extends AbstractIntegrationTest {

    private TypeRef<Map<String, Object>> mapTypeRef = new TypeRef<Map<String, Object>>() {
    };

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(8093);

    @Test
    public void discovery() throws IOException {
        Map<String, Object> result = given()
                .header("Content-type", "application/json")
                .get("oidc/api/discovery")
                .as(mapTypeRef);
        Map<String, Object> expected = objectMapper.readValue(new ClassPathResource("discovery_endpoint.json").getInputStream(), mapTypeReference);
        expected.put("remote_client_id", "playground_client");
        expected.put("redirect_uri", "http://localhost:3000/redirect");

        assertEquals(expected, result);
    }

    @Test
    public void authorize() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "code")
                .p("scope", asList("openid", "groups"))
                .p("claims", asList("email", "edumember_is_member_of"))
                .p("nonce", "some_nonce")
                .p("forceAuthentication", true)
                .p("forceConsent", true);

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid groups")
                .p("claims", "{\"id_token\":{\"edumember_is_member_of\":null,\"email\":null}}")
                .p("response_type", "code")
                .p("response_mode", "query")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground_client")
                .p("nonce", "some_nonce")
                .p("prompt", "login consent");

        assertEquals(expected, queryParams);
    }

    @Test
    public void authorizeWithSignedJWT() throws ParseException {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "code")
                .p("scope", singletonList("openid"))
                .p("claims", asList("email", "edumember_is_member_of"))
                .p("nonce", "some_nonce")
                .p("forceAuthentication", true)
                .p("signedJWT", true);

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        SignedJWT signedJWT = SignedJWT.parse(queryParams.get("request"));
        String serialize = signedJWT.serialize();

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid")
                .p("response_type", "code")
                .p("nonce", "some_nonce")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground_client")
                .p("request", serialize);

        assertEquals(expected, queryParams);
    }

    @Test
    public void implicit() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "implicit")
                .p("scope", asList("openid", "groups"))
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
    public void implicitFormPostRequiresDifferentRedirectUri() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "implicit")
                .p("response_mode", "form_post")
                .p("scope", asList("openid"));

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid")
                .p("response_type", "implicit")
                .p("response_mode", "form_post")
                .p("redirect_uri", "http://localhost:3000/oidc/api/redirect")
                .p("client_id", "playground_client");

        assertEquals(expected, queryParams);
    }

    @Test
    public void pkce() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "code")
                .p("scope", singletonList("openid"))
                .p("pkce", true)
                .p("code_challenge", "123456")
                .p("code_challenge_method", "plain")
                .p("nonce", "some_nonce");

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid")
                .p("response_type", "code")
                .p("response_mode", "query")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground_client")
                .p("code_challenge", "123456")
                .p("code_challenge_method", "plain")
                .p("nonce", "some_nonce");

        assertEquals(expected, queryParams);
    }

    @Test
    public void emptyScope() {
        Map<String, Object> body = new FluentMap()
                .p("authorization_endpoint", "http://localhost:8093/authorize")
                .p("response_type", "code")
                .p("scope", new ArrayList<String>())
                .p("nonce", null);

        Map<String, String> queryParams = doPostForAuthorize(body, "authorization_code");

        Map<String, Object> expected = new FluentMap()
                .p("response_type", "code")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("response_mode", "query")
                .p("client_id", "playground_client");

        assertEquals(expected, queryParams);
    }

    @Test
    public void publishClientJwk() {
        Map certs = given()
                .header("Content-type", "application/json")
                .accept(ContentType.JSON)
                .get("/oidc/api/certs")
                .as(mapTypeRef);
        assertEquals(1, certs.size());
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
        doToken("refresh_token", "refresh_token");
    }

    @Test
    public void introspect() {
        doForwardPost("/introspect", "introspect_endpoint");
    }

    @Test
    public void userinfo() {
        doForwardPost("/userinfo", "userinfo_endpoint");
    }

    private void doForwardPost(String path, String endpoint) {
        stubFor(post(urlPathMatching(path))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody("{}")));

        Map<String, Object> body = new HashMap<>();
        body.put(endpoint, "http://localhost:8093" + path);
        given()
                .accept(ContentType.JSON)
                .header("Content-type", "application/json")
                .body(body)
                .post("/oidc/api" + path)
                .then()
                .statusCode(200);
    }

    @SuppressWarnings("unchecked")
    private void doToken(String grantType, String path) throws IOException {
        Map<String, Object> body = new FluentMap()
                .p("token_endpoint", "http://localhost:8093/token")
                .p("grant_type", grantType)
                .p("scope", asList("openid", "groups"))
                .p("state", "example");

        if (grantType.equals("authorization_code")) {
            body.put("redirect_uri", "http://localhost:3000/redirect");
        }

        Map<String, Object> map = doToken(path, body);

        assertTrue(map.containsKey("request_body"));
        assertTrue(map.containsKey("request_headers"));
        assertTrue(map.containsKey("request_url"));

        Map<String, Object> result = (Map<String, Object>) map.get("result");
        assertTrue(result.containsKey("access_token"));
    }

    private Map<String, Object> doToken(String path, Map<String, Object> body) throws IOException {
        stubFor(post(urlPathMatching("/token"))
                .willReturn(aResponse()
                        .withHeader("Content-Type", "application/json")
                        .withBody(readFile("oidc_response.json"))));

        return given()
                .accept(ContentType.JSON)
                .header("Content-type", "application/json")
                .body(body)
                .post("/oidc/api/" + path)
                .as(mapTypeRef);
    }

    @Test
    public void decodeJwtToken() throws IOException {
        Map<String, Object> map = objectMapper.readValue(new ClassPathResource("oidc_response.json").getInputStream(), mapTypeReference);
        String idToken = (String) map.get("id_token");

        Map<String, Object> result = given()
                .accept(ContentType.JSON)
                .queryParam("jwt", idToken)
                .get("oidc/api/decode_jwt")
                .as(new TypeRef<Map<String, Object>>() {
                });

        Map<String, Object> header = (Map<String, Object>) result.get("header");
        assertEquals("oidc", header.get("kid"));

        assertEquals("SIGNED", result.get("state"));

        Map<String, Object> payload = (Map<String, Object>) result.get("payload");
        assertEquals("playground_client", payload.get("aud"));
    }

    @Test
    public void decodeNonJwtToken() throws IOException {
        String uuid = "53f9a596-12fd-4a0e-92b8-04cfd60de58d";
        String result = given()
                .accept(ContentType.JSON)
                .queryParam("jwt", uuid)
                .get("oidc/api/decode_jwt")
                .body().asString();

        assertEquals(uuid, result);
    }

    @Test
    public void codeChallenge() {
        Map<String, Object> result = doPost(new HashMap<>(), "code_challenge").as(mapTypeRef);

        assertTrue(Base64.isBase64((String) result.get("codeChallenge")));
        assertEquals(43, ((String) result.get("codeVerifier")).length());
        assertEquals(S256, CodeChallengeMethod.parse((String) result.get("codeChallengeMethod")));
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