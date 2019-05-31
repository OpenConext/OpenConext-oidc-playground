package playground.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.oauth2.sdk.ResponseType;
import com.nimbusds.oauth2.sdk.pkce.CodeChallenge;
import com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod;
import com.nimbusds.oauth2.sdk.pkce.CodeVerifier;
import com.nimbusds.oauth2.sdk.util.OrderedJSONObject;
import com.nimbusds.openid.connect.sdk.ClaimsRequest;
import net.minidev.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.text.ParseException;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

import static java.util.Base64.getEncoder;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController()
@RequestMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@SuppressWarnings("unchecked")
public class Oidc implements URLSupport {

    static TypeReference<Map<String, Object>> mapTypeReference = new TypeReference<Map<String, Object>>() {
    };

    static ParameterizedTypeReference<LinkedHashMap<String, Object>> mapResponseType = new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {
    };

    @Value("${oidc.discovery_endpoint}")
    private Resource discoveryEndpoint;

    @Value("${oidc.client_id}")
    private String clientId;

    @Value("${oidc.secret}")
    private String secret;

    @Value("${oidc.redirect_uri}")
    private String redirectUri;

    @Value("${oidc.redirect_uri_form_post}")
    private String redirectUriFormPost;

    @Value("${oidc.client_redirect_uri}")
    private String clientRedirectUri;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate = new RestTemplate();

    @GetMapping("/discovery")
    public Map<String, Object> discovery() throws IOException {
        return objectMapper.readValue(discoveryEndpoint.getInputStream(), mapTypeReference);
    }

    @PostMapping(value = "/code_challenge")
    public Map<String, String> codeChallenge(@RequestBody Map<String, String> body) {
        CodeChallengeMethod method = CodeChallengeMethod.parse(body.getOrDefault("codeChallengeMethod",
                CodeChallengeMethod.S256.getValue()));
        CodeVerifier codeVerifier = new CodeVerifier();
        CodeChallenge codeChallenge = CodeChallenge.compute(method,
                new CodeVerifier(body.getOrDefault("codeVerifier", codeVerifier.getValue())));
        body.put("codeChallenge", codeChallenge.getValue());
        body.put("codeVerifier", codeChallenge.getValue());
        body.put("codeChallengeMethod", method.getValue());
        return body;
    }

    @PostMapping(value = "/redirect", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public void redirectFormPost(@RequestParam MultiValueMap<String,String> form, HttpServletResponse response) throws IOException {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(clientRedirectUri);
        form.forEach((key, value) -> {
            if (!CollectionUtils.isEmpty(value)) {
                builder.queryParam(key, encode(value.get(0)));
            }
        });
        response.sendRedirect(builder.build().toUriString());
    }

    @PostMapping(value = {"/authorization_code", "/implicit"})
    public Map<String, String> authorize(@RequestBody Map<String, Object> body) throws URISyntaxException {
        Map<String, String> parameters = new HashMap<>();

        ResponseType responseType = new ResponseType(((String) body.get("response_type")).split(" "));
        parameters.put("response_type", responseType.toString());
        List<String> scopes = (List<String>) body.get("scope");
        if (!CollectionUtils.isEmpty(scopes)) {
            parameters.put("scope", String.join(" ", scopes));
        }
        String responseMode = (String) body.getOrDefault("response_mode", "fragment");
        if (!responseType.impliesCodeFlow()) {
            parameters.put("response_mode", responseMode);
        }
        List<String> requestedClaims = (List<String>) body.get("claims");
        if (!CollectionUtils.isEmpty(requestedClaims)) {
            parameters.put("claims", claims(requestedClaims));
        }
        parameters.put("client_id", (String) body.getOrDefault("client_id", clientId));

        if (!responseType.impliesCodeFlow() && responseMode.equals("form_post")) {
            parameters.put("redirect_uri", redirectUriFormPost);
        } else {
            parameters.put("redirect_uri", redirectUri);
        }

        parameters.put("nonce", (String) body.get("nonce"));
        parameters.put("state", (String) body.get("state"));
        parameters.put("code_challenge", (String) body.get("code_challenge"));
        parameters.put("code_challenge_method", (String) body.get("code_challenge_method"));
        parameters.put("acr_values", (String) body.get("acr_values"));


        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString((String) body.get("authorization_endpoint"));
        parameters.forEach((key, value) -> {
            if (StringUtils.hasText(value)) {
                builder.queryParam(key, encode(value));
            }
        });
        return Collections.singletonMap("url", builder.build().toUriString());
    }

    @PostMapping(value = {"/token"})
    public Map<String, Object> token(@RequestBody Map<String, Object> body) throws URISyntaxException {
        body.put("redirect_uri", redirectUri);
        return doToken(body, "authorization_code");
    }

    @PostMapping("/client_credentials")
    public Map<String, Object> clientCredentials(@RequestBody Map<String, Object> body) throws URISyntaxException {
        return doToken(body, "client_credentials");
    }

    @PostMapping("/refresh_token")
    public Map<String, Object> refreshToken(@RequestBody Map<String, Object> body) throws URISyntaxException {
        return doToken(body, "refresh_token");
    }

    @PostMapping("/introspect")
    public Map<String, Object> introspect(@RequestBody Map<String, Object> body) throws URISyntaxException {
        return doPost(body, Collections.singletonMap("token", (String) body.get("token")), (String) body.get("introspect_endpoint"));
    }

    @PostMapping("/userinfo")
    public Map<String, Object> userinfo(@RequestBody Map<String, Object> body) throws URISyntaxException {
        return doPost(body, Collections.singletonMap("token", (String) body.get("token")), (String) body.get("userinfo_endpoint"));
    }

    @GetMapping("/proxy")
    public Map proxy(@RequestParam("uri") String uri) {
        return restTemplate.getForEntity(uri, Map.class).getBody();
    }

    @GetMapping("/decode_jwt")
    public String decodeJwtToken(@RequestParam("jwt") String jwt) throws ParseException {
        SignedJWT signedJWT = SignedJWT.parse(jwt);
        JSONObject result = new OrderedJSONObject();
        result.put("header", signedJWT.getHeader().toJSONObject());
        result.put("payload", signedJWT.getJWTClaimsSet().toJSONObject());

        return result.toJSONString();
    }


    private Map<String, Object> doToken(Map<String, Object> body, String grantType) throws URISyntaxException {
        HashMap<String, String> requestBody = new HashMap<>();
        requestBody.put("grant_type", grantType);

        if (body.containsKey("scope")) {
            List<String> scopes = (List<String>) body.get("scope");
            if (!CollectionUtils.isEmpty(scopes)) {
                requestBody.put("scope", String.join(" ", (List<String>) body.get("scope")));
            }
        }
        return doPost(body, requestBody, (String) body.get("token_endpoint"));
    }

    private Map<String, Object> doPost(Map<String, Object> body, Map<String, String> requestBody, String endpoint) throws URISyntaxException {
        String clientIdToUse = (String) body.getOrDefault("client_id", clientId);
        String secretToUse = (String) body.getOrDefault("client_secret", secret);
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED);

        String authMethod = (String) body.getOrDefault("token_endpoint_auth_method", "client_secret_basic");
        if (authMethod.equals("client_secret_basic")) {
            builder.header(AUTHORIZATION, "Basic " +
                    new String(getEncoder().encode(String.format("%s:%s", clientIdToUse, secretToUse).getBytes())));
        } else {
            requestBody.put("client_id", clientIdToUse);
            requestBody.put("client_secret", secretToUse);
        }

        LinkedMultiValueMap form = new LinkedMultiValueMap();
        requestBody.forEach((k,v)-> form.set(k,v));
        RequestEntity<LinkedMultiValueMap> requestEntity = builder.body(form);

        Map<String, Object> result = new HashMap();
        result.put("result", restTemplate.exchange(requestEntity, mapResponseType).getBody());
        result.put("request_body", sanitizeRequestBody(requestBody));
        result.put("request_url", endpoint);
        result.put("request_headers", sanitizeHeaders(requestEntity.getHeaders().toSingleValueMap()));
        return result;
    }

    private Map<String, String> sanitizeRequestBody(Map<String, String> requestBody) {
        List<String> sensitiveParams = Arrays.asList("client_id", "client_secret");
        sensitiveParams.forEach(param -> requestBody.replace(param, "XXX"));
        return requestBody;
    }

    private Map<String, String> sanitizeHeaders(Map<String, String> headers) {
        //headers are unmodifiable
        Map<String, String> result = new HashMap<>(headers);
        List<String> sensitiveHeaders = Arrays.asList(AUTHORIZATION);
        sensitiveHeaders.forEach(header -> result.replace(header, "XXX"));
        return result;
    }

    private String claims(List<String> requestedClaims) {
        ClaimsRequest claimsRequest = new ClaimsRequest();
        requestedClaims.forEach(claimsRequest::addIDTokenClaim);
        return claimsRequest.toString();
    }

}
