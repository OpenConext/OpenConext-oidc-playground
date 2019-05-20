package playground.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.oauth2.sdk.ResponseType;
import com.nimbusds.openid.connect.sdk.ClaimsRequest;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.ResponseEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.io.IOException;
import java.io.UnsupportedEncodingException;
import java.net.URI;
import java.net.URISyntaxException;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@SuppressWarnings("unchecked")
public class Oidc {

    static final ParameterizedTypeReference<Map<String, Object>> mapParameterizedTypeReference = new ParameterizedTypeReference<Map<String, Object>>() {
    };
    static TypeReference<Map<String, Object>> mapTypeReference = new TypeReference<Map<String, Object>>() {
    };

    @Value("${oidc.discovery_endpoint}")
    private Resource discoveryEndpoint;

    @Value("${oidc.client_id}")
    private String clientId;

    @Value("${oidc.secret}")
    private String secret;

    @Value("${oidc.redirect_uri}")
    private String redirectUri;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/oidc/api/discovery")
    public Map<String, Object> discovery() throws IOException {
        return objectMapper.readValue(discoveryEndpoint.getInputStream(), mapTypeReference);
    }

    @PostMapping(value = {"/oidc/api/authorization_code", "/oidc/api/implicit"})
    public Map<String, String> authorize(@RequestBody Map<String, Object> body) throws URISyntaxException {
        Map<String, String> parameters = new HashMap<>();

        ResponseType responseType = new ResponseType(((String) body.get("response_type")).split(" "));
        parameters.put("response_type", responseType.toString());
        List<String> scopes = (List<String>) body.get("scope");
        if (!CollectionUtils.isEmpty(scopes)) {
            parameters.put("scope", " ".join(" ", scopes));
        }
        if (!responseType.impliesCodeFlow()) {
            parameters.put("response_mode", (String) body.getOrDefault("response_mode", "fragment"));
        }
        List<String> requestedClaims = (List<String>) body.get("claims");
        if (!CollectionUtils.isEmpty(requestedClaims)) {
            parameters.put("claims", claims(requestedClaims));
        }
        parameters.put("redirect_uri", redirectUri);
        parameters.put("nonce", (String) body.get("nonce"));
        parameters.put("code_challenge", (String) body.get("code_challenge"));
        parameters.put("code_challenge_method", (String) body.get("code_challenge_method"));
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString((String) body.get("authorization_endpoint"));
        parameters.forEach((key, value) -> {
            if (value != null) {
                builder.queryParam(key, value);
            }
        });
        return Collections.singletonMap("url", builder.build().toString());
    }

    @PostMapping("oidc/api/token")
    public Map<String, Object> token(@RequestBody Map<String, String> body) throws URISyntaxException {
        body.put("redirect_uri", redirectUri);
        return doToken(body, "authorization_code");
    }

    @PostMapping("/oidc/api/client_credentials")
    public Map<String, Object> clientCredentials(@RequestBody Map<String, String> body) throws UnsupportedEncodingException, URISyntaxException {
        return doToken(body, "client_credentials");
    }

    @PostMapping("/oidc/api/refresh_token")
    public Map<String, Object> refreshToken(@RequestBody Map<String, String> body) throws UnsupportedEncodingException, URISyntaxException {

        return doToken(body, "refresh_token");
    }

    @PostMapping("oidc/api/introspect")
    public Map<String, Object> introspect(@RequestBody Map<String, String> body) throws URISyntaxException {
        return doPost(body, Collections.singletonMap("token", body.get("token")), body.get("introspect_endpoint"));
    }

    @PostMapping("oidc/api/userinfo")
    public Map<String, Object> userinfo(@RequestBody Map<String, String> body) throws URISyntaxException {
        return doPost(body, Collections.singletonMap("token", body.get("token")), body.get("userinfo_endpoint"));
    }

    private Map<String, Object> doToken(Map<String, String> body, String grantType) throws URISyntaxException {
        HashMap<String, String> requestBody = new HashMap<>();
        requestBody.put("grant_type", grantType);

        if (body.containsKey("scope")) {
            requestBody.put("scope", body.get("scope"));
        }
        return doPost(body, requestBody, body.get("token_endpoint"));
    }

    private Map<String, Object> doPost(Map<String, String> body, Map<String, String> requestBody, String endpoint) throws URISyntaxException {
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .contentType(MediaType.APPLICATION_FORM_URLENCODED);

        String authMethod = body.getOrDefault("token_endpoint_auth_method", "client_secret_basic");
        if (authMethod.equals("client_secret_post")) {
            builder.header(HttpHeaders.AUTHORIZATION, new String(Base64.getEncoder().encode(String.format("%s:%s", clientId, secret).getBytes())));
        } else {
            requestBody.put("client_id", clientId);
            requestBody.put("client_secret", secret);
        }
        RequestEntity<Map<String, String>> requestEntity = builder.body(requestBody);

        ResponseEntity<Map<String, Object>> responseEntity = restTemplate.exchange(requestEntity, mapParameterizedTypeReference);
        return responseEntity.getBody();
    }

    private String claims(List<String> requestedClaims) {
        ClaimsRequest claimsRequest = new ClaimsRequest();
        requestedClaims.forEach(claimsRequest::addIDTokenClaim);
        return claimsRequest.toString();
    }

}
