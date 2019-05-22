package playground.api;


import com.nimbusds.jose.JWSHeader;
import com.nimbusds.jwt.JWTClaimsSet;
import com.nimbusds.jwt.SignedJWT;

import java.text.ParseException;
import java.util.HashMap;
import java.util.Map;

// Not thread-safe. Instantiate for every verify action
public class JWKVerifier {

    private final SignedJWT signedJWT;

    /*
     * The specified string representing a JSON Web Key (JWK) set.
     */
    public JWKVerifier(String token) throws ParseException {
        this.signedJWT = SignedJWT.parse(token);
    }

    public JWSHeader header() {
        return signedJWT.getHeader();
    }

    public JWTClaimsSet claims() throws ParseException {
        return signedJWT.getJWTClaimsSet();
    }

    public Map<String, Map<String, Object>> toMap() throws ParseException {
        JWSHeader header = header();

        Map<String, Object> headerMap = new HashMap<>();
        headerMap.put("kid", header.getKeyID());
        headerMap.put("alg", header.getAlgorithm().getName());

        Map<String, Object> claims = claims().getClaims();

        Map<String, Map<String, Object>> result = new HashMap<>();
        result.put("header", headerMap);
        result.put("payload", claims);

        return result;
    }
}
