package playground.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.JOSEException;
import com.nimbusds.jose.JOSEObjectType;
import com.nimbusds.jose.JWSAlgorithm;
import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jose.JWSSigner;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.oauth2.sdk.ResponseType;
import com.nimbusds.oauth2.sdk.pkce.CodeChallenge;
import com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod;
import com.nimbusds.oauth2.sdk.pkce.CodeVerifier;
import com.nimbusds.oauth2.sdk.util.OrderedJSONObject;
import com.nimbusds.openid.connect.sdk.ClaimsRequest;
import net.minidev.json.JSONObject;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
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
import java.security.KeyPair;
import java.security.KeyPairGenerator;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.Security;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.Arrays;
import java.util.Base64;
import java.util.Collections;
import java.util.Date;
import java.util.HashMap;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.regex.Pattern;

import static org.springframework.http.HttpHeaders.AUTHORIZATION;

@RestController()
@RequestMapping(produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
@SuppressWarnings("unchecked")
public class Oidc implements URLSupport {

    static TypeReference<Map<String, Object>> mapTypeReference = new TypeReference<Map<String, Object>>() {
    };

    static ParameterizedTypeReference<LinkedHashMap<String, Object>> mapResponseType = new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {
    };

    private Pattern uuidPattern = Pattern.compile("([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}");

    @Value("${oidc.discovery_endpoint}")
    private Resource discoveryEndpoint;

    @Value("${oidc.client_id}")
    private String clientId;

    @Value("${oidc.secret}")
    private String secret;

    @Value("${oidc.resource_server_id}")
    private String resourceServerId;

    @Value("${oidc.resource_server_secret}")
    private String resourceServerSecret;

    @Value("${oidc.redirect_uri}")
    private String redirectUri;

    @Value("${oidc.redirect_uri_form_post}")
    private String redirectUriFormPost;

    @Value("${oidc.client_redirect_uri}")
    private String clientRedirectUri;

    @Autowired
    private ObjectMapper objectMapper;

    private RestTemplate restTemplate = new RestTemplate();

    private String rsaKeyId = "play_key_id";

    private RSAKey rsaKey;

    public Oidc() throws NoSuchProviderException, NoSuchAlgorithmException {
        Security.addProvider(new BouncyCastleProvider());
        this.rsaKey = generateRsaKey();
    }

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
        body.put("codeVerifier", codeVerifier.getValue());
        body.put("codeChallengeMethod", method.getValue());
        return body;
    }

    @PostMapping(value = "/redirect", consumes = {MediaType.APPLICATION_FORM_URLENCODED_VALUE})
    public void redirectFormPost(@RequestParam MultiValueMap<String, String> form, HttpServletResponse response) throws IOException {
        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString(clientRedirectUri);
        form.forEach((key, value) -> {
            if (!CollectionUtils.isEmpty(value)) {
                builder.queryParam(key, encode(value.get(0)));
            }
        });
        response.sendRedirect(builder.build().toUriString());
    }

    @PostMapping(value = {"/authorization_code", "/implicit"})
    public Map<String, String> authorize(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
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

        if ((boolean) body.getOrDefault("forceAuthentication", false)) {
            parameters.put("prompt", "login");
        }

        parameters.put("nonce", (String) body.get("nonce"));
        parameters.put("state", (String) body.get("state"));

        if ((boolean) body.getOrDefault("pkce", false)) {
            parameters.put("code_challenge", (String) body.get("code_challenge"));
            parameters.put("code_challenge_method", (String) body.get("code_challenge_method"));
        }
        parameters.put("acr_values", (String) body.get("acr_values"));

        if ((boolean)body.getOrDefault("signedJWT", false)) {
            parameters.put("request", signedJWT(parameters).serialize());
            List<String> toRemove = Arrays.asList("response_mode", "claims", "nonce", "state", "code_challenge", "code_challenge_method", "acr_values");
            parameters.keySet().removeIf(key -> toRemove.contains(key));
        }

        UriComponentsBuilder builder = UriComponentsBuilder.fromUriString((String) body.get("authorization_endpoint"));
        parameters.forEach((key, value) -> {
            if (StringUtils.hasText(value)) {
                builder.queryParam(key, encode(value));
            }
        });
        return Collections.singletonMap("url", builder.build().toUriString());
    }

    @PostMapping("/token")
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
        body.put("client_id", "resource-server-playground-client");
        body.put("client_secret", secret);

        return doPost(body, Collections.singletonMap("token", (String) body.get("token")), (String) body.get("introspect_endpoint"));
    }

    @PostMapping("/userinfo")
    public Map<String, Object> userinfo(@RequestBody Map<String, Object> body) throws URISyntaxException {
        String endpoint = (String) body.get("userinfo_endpoint");
        String token = (String) body.get("token");
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON_UTF8)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization", "Bearer " + token);

        Map<String, String> requestBody = Collections.singletonMap("access_token", token);
        return callPostEndpoint(requestBody, (String) body.get("userinfo_endpoint"), builder);
    }

    @GetMapping("/proxy")
    public Map proxy(@RequestParam("uri") String uri, @RequestParam("access_token") String access_token) {
        HttpHeaders headers = new HttpHeaders();
        headers.add("Authorization", "bearer " + access_token);
        HttpEntity<Map> requestEntity = new HttpEntity<>(headers);
        return restTemplate.exchange(uri, HttpMethod.GET, requestEntity, Map.class).getBody();
    }

    @GetMapping("/decode_jwt")
    public String decodeJwtToken(@RequestParam("jwt") String jwt) throws ParseException {
        if (uuidPattern.matcher(jwt).matches()) {
            return jwt;
        }
        SignedJWT signedJWT = SignedJWT.parse(jwt);
        JSONObject result = new OrderedJSONObject();
        result.put("header", signedJWT.getHeader().toJSONObject());
        result.put("payload", signedJWT.getJWTClaimsSet().toJSONObject());

        return result.toJSONString();
    }

    @GetMapping(value = {"/certs"}, produces = MediaType.APPLICATION_JSON_UTF8_VALUE)
    public String publishClientJwk() throws NoSuchProviderException, NoSuchAlgorithmException {
        return new JWKSet(this.rsaKey.toPublicJWK()).toJSONObject().toString();
    }


    private Map<String, Object> doToken(Map<String, Object> body, String grantType) throws URISyntaxException {
        HashMap<String, String> requestBody = new HashMap<>();
        requestBody.put("grant_type", grantType);
        if (body.containsKey("code")) {
            requestBody.put("code", (String) body.get("code"));
        }
        if (body.containsKey("scope")) {
            List<String> scopes = (List<String>) body.get("scope");
            if (!CollectionUtils.isEmpty(scopes)) {
                requestBody.put("scope", String.join(" ", (List<String>) body.get("scope")));
            }
        }
        if ((boolean) body.getOrDefault("pkce", false)) {
            requestBody.put("code_verifier", (String) body.get("code_verifier"));
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
        boolean codeVerifier = requestBody.containsKey("code_verifier");
        if (!codeVerifier) {
            if (authMethod.equals("client_secret_basic")) {
                builder.header(AUTHORIZATION, "Basic " +
                        new String(Base64.getEncoder().encode((clientIdToUse + ":" + secretToUse).getBytes())));
            } else {
                requestBody.put("client_id", clientIdToUse);
                requestBody.put("client_secret", secretToUse);
            }
        } else {
            requestBody.put("client_id", clientIdToUse);
        }

        return callPostEndpoint(requestBody, endpoint, builder);
    }

    private Map<String, Object> callPostEndpoint(Map<String, String> requestBody, String endpoint, RequestEntity.BodyBuilder builder) {
        LinkedMultiValueMap form = new LinkedMultiValueMap();
        requestBody.forEach((k, v) -> form.set(k, v));
        RequestEntity<LinkedMultiValueMap> requestEntity = builder.body(form);

        Map<String, Object> result = new HashMap();
        result.put("result", restTemplate.exchange(requestEntity, mapResponseType).getBody());
        result.put("request_body", sanitizeInformation(requestBody));
        result.put("request_url", endpoint);
        result.put("request_headers", sanitizeInformation(requestEntity.getHeaders().toSingleValueMap()));
        return result;
    }

    private Map<String, String> sanitizeInformation(Map<String, String> headers) {
        Map<String, String> result = new HashMap<>(headers);
        List<String> sensitiveHeaders = Arrays.asList("client_id", "client_secret", AUTHORIZATION);
        sensitiveHeaders.forEach(header -> result.replace(header, "XXX"));
        return result;
    }

    private String claims(List<String> requestedClaims) {
        ClaimsRequest claimsRequest = new ClaimsRequest();
        requestedClaims.forEach(claimsRequest::addIDTokenClaim);
        return claimsRequest.toString();
    }

    private RSAKey generateRsaKey() throws NoSuchAlgorithmException, NoSuchProviderException {
        KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA", "BC");
        kpg.initialize(2048);
        KeyPair keyPair = kpg.generateKeyPair();
        RSAPrivateKey privateKey = (RSAPrivateKey) keyPair.getPrivate();
        RSAPublicKey publicKey = (RSAPublicKey) keyPair.getPublic();
        return new RSAKey.Builder(publicKey)
                .privateKey(privateKey)
                .algorithm(JWSAlgorithm.RS256)
                .keyID(rsaKeyId)
                .build();
    }

    private SignedJWT signedJWT(Map<String, String> form) throws JOSEException {
        Instant now = Instant.now();
        JWTClaimsSet.Builder builder = new JWTClaimsSet.Builder()
                .audience("audience")
                .expirationTime(Date.from(now.plus(3600, ChronoUnit.SECONDS)))
                .jwtID(UUID.randomUUID().toString())
                .issuer(this.clientId)
                .issueTime(Date.from(now))
                .subject(this.clientId)
                .notBeforeTime(new Date(System.currentTimeMillis()));

        form.forEach((key, value) -> builder.claim(key, value));

        JWTClaimsSet claimsSet = builder.build();
        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256).type(JOSEObjectType.JWT).keyID(rsaKeyId).build();
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        JWSSigner jswsSigner = new RSASSASigner(this.rsaKey.toPrivateKey());
        signedJWT.sign(jswsSigner);
        return signedJWT;
    }

}
