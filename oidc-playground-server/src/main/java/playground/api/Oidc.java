package playground.api;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.nimbusds.jose.*;
import com.nimbusds.jose.crypto.RSASSASigner;
import com.nimbusds.jose.jwk.JWKSet;
import com.nimbusds.jose.jwk.RSAKey;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;
import com.nimbusds.oauth2.sdk.GrantType;
import com.nimbusds.oauth2.sdk.ResponseType;
import com.nimbusds.oauth2.sdk.auth.ClientSecretJWT;
import com.nimbusds.oauth2.sdk.auth.JWTAuthentication;
import com.nimbusds.oauth2.sdk.auth.PrivateKeyJWT;
import com.nimbusds.oauth2.sdk.auth.Secret;
import com.nimbusds.oauth2.sdk.id.ClientID;
import com.nimbusds.oauth2.sdk.pkce.CodeChallenge;
import com.nimbusds.oauth2.sdk.pkce.CodeChallengeMethod;
import com.nimbusds.oauth2.sdk.pkce.CodeVerifier;
import com.nimbusds.oauth2.sdk.util.OrderedJSONObject;
import com.nimbusds.openid.connect.sdk.ClaimsRequest;
import lombok.SneakyThrows;
import net.minidev.json.JSONObject;
import org.apache.commons.logging.Log;
import org.apache.commons.logging.LogFactory;
import org.apache.http.client.HttpClient;
import org.apache.http.impl.NoConnectionReuseStrategy;
import org.apache.http.impl.client.HttpClientBuilder;
import org.bouncycastle.jce.provider.BouncyCastleProvider;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.ParameterizedTypeReference;
import org.springframework.core.io.Resource;
import org.springframework.http.MediaType;
import org.springframework.http.RequestEntity;
import org.springframework.http.client.HttpComponentsClientHttpRequestFactory;
import org.springframework.util.CollectionUtils;
import org.springframework.util.LinkedMultiValueMap;
import org.springframework.util.MultiValueMap;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import javax.servlet.http.HttpServletResponse;
import java.io.IOException;
import java.net.URI;
import java.net.URISyntaxException;
import java.security.*;
import java.security.interfaces.RSAPrivateKey;
import java.security.interfaces.RSAPublicKey;
import java.text.ParseException;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.*;
import java.util.regex.Pattern;

import static com.nimbusds.oauth2.sdk.ResponseMode.*;
import static com.nimbusds.oauth2.sdk.auth.JWTAuthentication.CLIENT_ASSERTION_TYPE;
import static java.util.stream.Collectors.toMap;
import static org.springframework.http.HttpHeaders.AUTHORIZATION;
import static org.springframework.http.HttpHeaders.CONTENT_TYPE;

@RestController()
@RequestMapping(produces = MediaType.APPLICATION_JSON_VALUE)
@SuppressWarnings("unchecked")
public class Oidc implements URLSupport {

    static TypeReference<Map<String, Object>> mapTypeReference = new TypeReference<>() {
    };

    private static final ParameterizedTypeReference<LinkedHashMap<String, Object>> mapResponseType = new ParameterizedTypeReference<LinkedHashMap<String, Object>>() {
    };

    private static final Log LOG = LogFactory.getLog(Oidc.class);

    private final Pattern uuidPattern = Pattern.compile("([a-fA-F0-9]{8}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{4}-[a-fA-F0-9]{12}){1}");

    private final String clientId;

    private final String secret;

    private final String jwtSecret;

    private final String resourceServerId;

    private final String resourceServerSecret;

    private final String redirectUri;

    private final String redirectUriFormPost;

    private final String clientRedirectUri;

    private final ObjectMapper objectMapper;

    private final Resource discoveryEndpoint;

    private final RestTemplate restTemplate;

    private final String rsaKeyId = "play_key_id";

    private final RSAKey rsaKey;

    private Map<String, Object> wellKnownConfiguration;

    private final ACR acr;

    @Autowired
    public Oidc(@Value("${oidc.discovery_endpoint}") Resource discoveryEndpoint,
                @Value("${oidc.client_id}") String clientId,
                @Value("${oidc.secret}") String secret,
                @Value("${oidc.jwt_secret}") String jwtSecret,
                @Value("${oidc.resource_server_id}") String resourceServerId,
                @Value("${oidc.resource_server_secret}") String resourceServerSecret,
                @Value("${oidc.redirect_uri}") String redirectUri,
                @Value("${oidc.redirect_uri_form_post}") String redirectUriFormPost,
                @Value("${oidc.client_redirect_uri}") String clientRedirectUri,
                ObjectMapper objectMapper,
                ACR acr
    ) throws NoSuchProviderException, NoSuchAlgorithmException {
        Security.addProvider(new BouncyCastleProvider());
        this.clientId = clientId;
        this.secret = secret;
        this.jwtSecret = jwtSecret;
        this.resourceServerId = resourceServerId;
        this.resourceServerSecret = resourceServerSecret;
        this.redirectUri = redirectUri;
        this.redirectUriFormPost = redirectUriFormPost;
        this.clientRedirectUri = clientRedirectUri;
        this.objectMapper = objectMapper;
        this.discoveryEndpoint = discoveryEndpoint;
        this.rsaKey = generateRsaKey();
        this.acr = acr;
        this.restTemplate = new RestTemplate();
        HttpClient httpClient = HttpClientBuilder.create()
                .setRetryHandler((exception, executionCount, context) -> false)
                .setConnectionReuseStrategy(new NoConnectionReuseStrategy())
                .build();
        this.restTemplate.setRequestFactory(new HttpComponentsClientHttpRequestFactory(httpClient));
    }

    private Map<String, Object> readWellKnownConfiguration() {
        if (CollectionUtils.isEmpty(this.wellKnownConfiguration)) {
            try {
                this.wellKnownConfiguration = objectMapper.readValue(discoveryEndpoint.getInputStream(), mapTypeReference);
            } catch (IOException e) {
                LOG.error("Error reading well known configuration at " + this.discoveryEndpoint.getDescription(), e);
                return Collections.EMPTY_MAP;
            }
            this.wellKnownConfiguration.put("remote_client_id", clientId);
            this.wellKnownConfiguration.put("redirect_uri", redirectUri);
            this.wellKnownConfiguration.put("acr_values_supported", this.acr.getValues());
        }
        return this.wellKnownConfiguration;
    }

    @GetMapping("/discovery")
    public Map<String, Object> discovery() {
        return readWellKnownConfiguration();
    }

    @PostMapping(value = "/code_challenge")
    public Map<String, Object> codeChallenge(@RequestBody Map<String, Object> body) {
        sanitizeMap(body);
        CodeChallengeMethod method = CodeChallengeMethod.parse((String) body.getOrDefault("codeChallengeMethod",
                CodeChallengeMethod.S256.getValue()));
        CodeVerifier codeVerifier = new CodeVerifier();
        CodeChallenge codeChallenge = CodeChallenge.compute(method,
                new CodeVerifier((String) body.getOrDefault("codeVerifier", codeVerifier.getValue())));
        body.put("codeChallenge", codeChallenge.getValue());
        body.put("codeVerifier", codeVerifier.getValue());
        body.put("codeChallengeMethod", method.getValue());
        return body;
    }

    @PostMapping(value = {"/authorization_code", "/implicit"})
    public Map<String, String> authorize(@RequestBody Map<String, Object> body) throws JOSEException {
        sanitizeMap(body);
        Map<String, String> parameters = new HashMap<>();

        ResponseType responseType = new ResponseType(((String) body.get("response_type")).split(" "));
        parameters.put("response_type", responseType.toString());

        addScopeValues(body, parameters);

        String responseMode = (String) body.getOrDefault("response_mode",
                responseType.impliesCodeFlow() ? QUERY.getValue() : FRAGMENT.getValue());
        parameters.put("response_mode", responseMode);

        List<String> requestedClaims = (List<String>) body.get("claims");
        if (!CollectionUtils.isEmpty(requestedClaims)) {
            parameters.put("claims", claims(requestedClaims));
        }

        parameters.put("client_id", (String) body.getOrDefault("client_id", clientId));

        parameters.put("redirect_uri", determineRedirectUri(responseMode));

        addPromptValues(body, parameters);

        parameters.put("nonce", (String) body.get("nonce"));
        parameters.put("state", (String) body.get("state"));

        if ((boolean) body.getOrDefault("pkce", false)) {
            parameters.put("code_challenge", (String) body.get("code_challenge"));
            parameters.put("code_challenge_method", (String) body.get("code_challenge_method"));
        }

        parameters.put("login_hint", (String) body.get("login_hint"));
        parameters.put("acr_values", (String) body.get("acr_values"));

        if ((boolean) body.getOrDefault("signedJWT", false)) {
            parameters.put("request", signedJWT(parameters).serialize());
            List<String> toRemove =
                    Arrays.asList("response_mode", "claims", "prompt", "state", "code_challenge", "code_challenge_method", "acr_values");
            parameters.keySet().removeIf(toRemove::contains);
        }

        UriComponentsBuilder builder = UriComponentsBuilder
                .fromUriString((String) readWellKnownConfiguration().get("authorization_endpoint"));
        parameters.forEach((key, value) -> {
            if (StringUtils.hasText(value)) {
                builder.queryParam(key, encode(value));
            }
        });
        return mutableMap("url", builder.build().toUriString());
    }

    private void addPromptValues(Map<String, Object> body, Map<String, String> parameters) {
        List<String> prompt = new ArrayList<>();
        if ((boolean) body.getOrDefault("forceAuthentication", false)) {
            prompt.add("login");
        }
        if ((boolean) body.getOrDefault("forceConsent", false)) {
            prompt.add("consent");
        }
        if (!prompt.isEmpty()) {
            parameters.put("prompt", String.join(" ", prompt));
        }
    }

    @PostMapping(value = {"/urn:ietf:params:oauth:grant-type:device_code"})
    public Map<String, Object> deviceFlow(@RequestBody Map<String, Object> body) throws URISyntaxException {
        sanitizeMap(body);

        Map<String, String> parameters = new HashMap<>();

        parameters.put("client_id", (String) body.getOrDefault("client_id", clientId));
        parameters.put("acr_values", (String) body.get("acr_values"));

        String loginHint = (String) body.get("login_hint");
        if (StringUtils.hasText(loginHint)) {
            parameters.put("login_hint", loginHint);
        }

        addPromptValues(body, parameters);
        addScopeValues(body, parameters);

        String endpoint = (String) readWellKnownConfiguration().get("device_authorization_endpoint");
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED);

        return callPostEndpoint(parameters, endpoint, builder);
    }

    @PostMapping("/token")
    public Map<String, Object> token(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
        String responseTypeParam = (String) body.getOrDefault("response_type", ResponseType.getDefault().toString());
        ResponseType responseType = new ResponseType(responseTypeParam.split(" "));
        String responseMode = (String) body.getOrDefault("response_mode",
                responseType.impliesCodeFlow() ? QUERY.getValue() : FRAGMENT.getValue());

        body.put("redirect_uri", determineRedirectUri(responseMode));
        return doToken(body, "authorization_code");
    }

    @PostMapping("/client_credentials")
    public Map<String, Object> clientCredentials(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
        return doToken(body, "client_credentials");
    }

    @PostMapping("/refresh_token")
    public Map<String, Object> refreshToken(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
        return doToken(body, "refresh_token");
    }

    @PostMapping("/introspect")
    public Map<String, Object> introspect(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
        String clientId = (String) body.get("client_id");
        if (!StringUtils.hasText(clientId)) {
            body.put("client_id", resourceServerId);
            body.put("client_secret", resourceServerSecret);
        }
        //always basic auth for introspection
        body.put("token_endpoint_auth_method", "client_secret_basic");
        return doPost(body,
                mutableMap("token", (String) body.get("token")),
                (String) readWellKnownConfiguration().get("introspect_endpoint"));
    }

    @PostMapping("/userinfo")
    public Map<String, Object> userinfo(@RequestBody Map<String, Object> body) throws URISyntaxException {
        String endpoint = (String) readWellKnownConfiguration().get("userinfo_endpoint");
        String token = (String) body.get("token");
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED)
                .header("Authorization", "Bearer " + token);

        Map<String, String> requestBody = mutableMap("access_token", token);
        return callPostEndpoint(requestBody, (String) readWellKnownConfiguration().get("userinfo_endpoint"), builder);
    }

    @PostMapping("/poll_device_authorization")
    public Map<String, Object> pollDeviceAuthorization(@RequestBody Map<String, Object> body) throws URISyntaxException, JOSEException {
        String endpoint = (String) readWellKnownConfiguration().get("token_endpoint");
        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED);
        String clientIdToUse = (String) body.get("client_id");
        clientIdToUse = StringUtils.hasText(clientIdToUse) ? clientIdToUse : clientId;

        Map<String, String> requestBody = Map.of(
                "client_id", clientIdToUse,
                "grant_type", GrantType.DEVICE_CODE.getValue(),
                "device_code", (String) body.get("device_code")
        );
        return callPostEndpoint(requestBody, endpoint, builder);
    }

    @GetMapping("/decode_jwt")
    public String decodeJwtToken(@RequestParam("jwt") String jwt) throws ParseException {
        if (uuidPattern.matcher(jwt).matches()) {
            return jwt;
        }
        SignedJWT signedJWT = SignedJWT.parse(jwt);
        JSONObject result = new OrderedJSONObject();
        result.put("header", sortMap(signedJWT.getHeader().toJSONObject().entrySet()));
        result.put("state", signedJWT.getState());
        result.put("payload", sortMap(signedJWT.getJWTClaimsSet().toJSONObject().entrySet()));

        return result.toJSONString();
    }

    @PostMapping("/apicall")
    public Object apiCall(@RequestBody Map<String, String> body) throws URISyntaxException {
        String apiUrl = body.get("apiUrl");
        String accessToken = body.get("accessToken");
        RequestEntity<Void> requestEntity = RequestEntity
                .get(new URI(apiUrl))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON)
                .header("Authorization", "Bearer " + accessToken).build();

        Map<String, Object> result = new HashMap();
        result.put("result", restTemplate.exchange(requestEntity, Object.class).getBody());
        result.put("request_url", apiUrl);
        result.put("request_headers", requestEntity.getHeaders().toSingleValueMap());
        return result;
    }

    private <K, V> Map<K, V> sortMap(Set<Map.Entry<K, V>> entrySet) {
        return entrySet
                .stream()
                .sorted(Comparator.comparing(e -> e.getKey().toString()))
                .collect(toMap(Map.Entry::getKey, Map.Entry::getValue, (e1, e2) -> e2, LinkedHashMap::new));
    }

    @GetMapping(value = {"/certs"}, produces = MediaType.APPLICATION_JSON_VALUE)
    public Map<String, Object> publishClientJwk() throws NoSuchProviderException, NoSuchAlgorithmException {
        return new JWKSet(this.rsaKey.toPublicJWK()).toJSONObject();
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

    private Map<String, Object> doToken(Map<String, Object> body, String grantType) throws URISyntaxException, JOSEException {
        HashMap<String, String> requestBody = new HashMap<>();
        requestBody.put("grant_type", grantType);

        Arrays.asList("code", "redirect_uri", "refresh_token").forEach(k -> {
            if (body.containsKey(k)) {
                requestBody.put(k, (String) body.get(k));
            }
        });

        List<String> scopes = (List<String>) body.get("scope");
        if (!CollectionUtils.isEmpty(scopes)) {
            requestBody.put("scope", String.join(" ", (List<String>) body.get("scope")));
        }

        if ((boolean) body.getOrDefault("pkce", false)) {
            requestBody.put("code_verifier", (String) body.get("code_verifier"));
        }
        return doPost(body, requestBody, (String) readWellKnownConfiguration().get("token_endpoint"));
    }

    private Map<String, Object> doPost(Map<String, Object> body, Map<String, String> requestBody, String endpoint) throws URISyntaxException, JOSEException {
        sanitizeMap(body);
        String clientIdToUse = (String) body.get("client_id");
        clientIdToUse = StringUtils.hasText(clientIdToUse) ? clientIdToUse : clientId;

        String secretToUse = (String) body.get("client_secret");
        secretToUse = StringUtils.hasText(secretToUse) ? secretToUse : secret;

        String jwtSecretToUse = (String) body.get("jwt_client_secret");
        jwtSecretToUse = StringUtils.hasText(jwtSecretToUse) ? jwtSecretToUse : jwtSecret;

        RequestEntity.BodyBuilder builder = RequestEntity
                .post(new URI(endpoint))
                .accept(MediaType.APPLICATION_JSON, MediaType.APPLICATION_JSON)
                .contentType(MediaType.APPLICATION_FORM_URLENCODED);

        String authMethod = (String) body.getOrDefault("token_endpoint_auth_method", "client_secret_basic");
        boolean omitAuthentication = (boolean) body.getOrDefault("omitAuthentication", false);
        if (!omitAuthentication) {
            tokenEndpointAuthMethod(requestBody, clientIdToUse, secretToUse, jwtSecretToUse, builder, authMethod);
        } else {
            requestBody.put("client_id", clientIdToUse);
        }

        return callPostEndpoint(requestBody, endpoint, builder);
    }

    private void tokenEndpointAuthMethod(Map<String, String> requestBody, String clientIdToUse, String secretToUse,
                                         String jwtSecretToUse,
                                         RequestEntity.BodyBuilder builder, String authMethod) throws JOSEException {
        switch (authMethod) {
            case "client_secret_basic": {
                //The client_id and client_secret has to be percent encoded. See https://tools.ietf.org/html/rfc6749#section-2.3.1
                String headerValueEncoded = encode(clientIdToUse) + ":" + encode(secretToUse);
                builder.header(AUTHORIZATION, "Basic " + new String(Base64.getEncoder().encode(headerValueEncoded.getBytes())));
                break;
            }
            case "client_secret_post": {
                requestBody.put("client_id", clientIdToUse);
                requestBody.put("client_secret", secretToUse);
                break;
            }
            case "client_secret_jwt": {
                ClientSecretJWT clientSecretJWT = new ClientSecretJWT(
                        new ClientID(clientIdToUse),
                        URI.create((String) readWellKnownConfiguration().get("token_endpoint")),
                        JWSAlgorithm.HS256,
                        new Secret(jwtSecretToUse));
                addClientJWTAssertion(requestBody, builder, clientSecretJWT);
                break;
            }
            case "private_key_jwt": {
                PrivateKeyJWT privateKeyJWT = new PrivateKeyJWT(
                        new ClientID(clientIdToUse),
                        URI.create((String) readWellKnownConfiguration().get("token_endpoint")),
                        JWSAlgorithm.RS256,
                        this.rsaKey.toRSAPrivateKey(),
                        this.rsaKeyId,
                        null);
                addClientJWTAssertion(requestBody, builder, privateKeyJWT);
                break;
            }
            default: {
                throw new IllegalArgumentException("Not supported token_endpoint_auth_method: " + authMethod);
            }
        }
    }

    private void addClientJWTAssertion(Map<String, String> requestBody, RequestEntity.BodyBuilder builder, JWTAuthentication jwtAuthentication) {
        builder.header(CONTENT_TYPE, "application/x-www-form-urlencoded");
        requestBody.put("client_assertion_type", CLIENT_ASSERTION_TYPE);
        requestBody.put("client_assertion", jwtAuthentication.getClientAssertion().serialize());
    }

    @SneakyThrows
    private Map<String, Object> callPostEndpoint(Map<String, String> requestBody,
                                                 String endpoint,
                                                 RequestEntity.BodyBuilder builder) {
        LinkedMultiValueMap<String, String> form = new LinkedMultiValueMap<>();
        requestBody.forEach(form::set);
        RequestEntity<LinkedMultiValueMap<String, String>> requestEntity = builder.body(form);

        Map<String, Object> result = new HashMap();
        Map<String, Object> body;
        try {
            body = restTemplate.exchange(requestEntity, mapResponseType).getBody();
        } catch (HttpClientErrorException e) {
            String responseBodyAsString = e.getResponseBodyAsString();
            body = objectMapper.readValue(responseBodyAsString, Map.class);
        }
        result.put("result", body);
        result.put("request_body", anonymizeInformation(requestBody));
        result.put("request_url", endpoint);
        result.put("request_headers", anonymizeInformation(requestEntity.getHeaders().toSingleValueMap()));
        return result;
    }

    private void sanitizeMap(Map<String, Object> body) {
        body.values().removeIf(val -> {
            if (val == null) {
                return true;
            }
            if (val instanceof List) {
                return CollectionUtils.isEmpty((List) val);
            }
            if (val instanceof String) {
                return !StringUtils.hasText((String) val);
            }
            return false;
        });
    }

    private Map<String, String> anonymizeInformation(Map<String, String> headers) {
        Map<String, String> result = new HashMap<>(headers);
        List<String> sensitiveHeaders = Arrays.asList("client_secret", AUTHORIZATION);
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

        form.forEach(builder::claim);

        JWTClaimsSet claimsSet = builder.build();
        JWSHeader header = new JWSHeader.Builder(JWSAlgorithm.RS256).type(JOSEObjectType.JWT).keyID(rsaKeyId).build();
        SignedJWT signedJWT = new SignedJWT(header, claimsSet);
        JWSSigner jswsSigner = new RSASSASigner(this.rsaKey.toPrivateKey());
        signedJWT.sign(jswsSigner);
        return signedJWT;
    }


    private void addScopeValues(Map<String, Object> body, Map<String, String> parameters) {
        List<String> scopes = (List<String>) body.get("scope");
        if (!CollectionUtils.isEmpty(scopes)) {
            parameters.put("scope", String.join(" ", scopes));
        }
    }

    private String determineRedirectUri(String responseMode) {
        return responseMode.equals(FORM_POST.getValue()) ? redirectUriFormPost : redirectUri;
    }

    private Map<String, String> mutableMap(String key, String value) {
        Map<String, String> res = new HashMap<>();
        res.put(key, value);
        return res;
    }

}
