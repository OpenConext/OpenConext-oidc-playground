package playground.api;

import io.restassured.mapper.TypeRef;
import org.apache.commons.io.IOUtils;
import org.junit.Test;
import org.springframework.core.io.ClassPathResource;
import org.springframework.web.util.UriComponentsBuilder;
import playground.AbstractIntegrationTest;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Arrays;
import java.util.Map;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static org.junit.Assert.assertEquals;
import static playground.api.Oidc.mapTypeReference;

public class OidcTest extends AbstractIntegrationTest {

    @Test
    public void discovery() throws IOException {
        Map<String, Object> result = given()
                .header("Content-type", "application/json")
                .get("oidc/api/discovery")
                .as(new TypeRef<Map<String, Object>>() {
                });
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

        Map<String, String> queryParams = doPost(body);

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid groups")
                .p("claims", "{\"id_token\":{\"edumember_is_member_of\":null,\"email\":null}}")
                .p("response_type", "code")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground")
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

        Map<String, String> queryParams = doPost(body);

        Map<String, Object> expected = new FluentMap()
                .p("scope", "openid groups")
                .p("response_type", "implicit")
                .p("response_mode", "fragment")
                .p("redirect_uri", "http://localhost:3000/redirect")
                .p("client_id", "playground")
                .p("state", "example");

        assertEquals(expected, queryParams);
    }

    @Test
    public void decodeJwtToken() throws IOException {
        Map<String, Object> map = objectMapper.readValue(new ClassPathResource("oidc_response.json").getInputStream(), mapTypeReference);
        String idToken = (String) map.get("id_token");

        Map<String, Map<String, Object>> result = given()
                .header("Content-type", "application/json")
                .queryParam("jwt", idToken)
                .get("oidc/api/decode_jwt")
                .as(new TypeRef<Map<String, Map<String, Object>>>() {
                });

        Map<String, Object> header = result.get("header");
        assertEquals("oidc", header.get("kid"));

        Map<String, Object> payload = result.get("payload");
        assertEquals("playground_client", payload.get("aud"));
    }


    private Map<String, String> doPost(Map<String, Object> body) {
        String url = given()
                .header("Content-type", "application/json")
                .body(body)
                .post("oidc/api/authorization_code")
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


}