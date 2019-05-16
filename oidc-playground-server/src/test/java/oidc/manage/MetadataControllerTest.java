package oidc.manage;

import oidc.AbstractIntegrationTest;
import oidc.model.OpenIDClient;
import org.junit.Ignore;
import org.junit.Test;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.test.context.ActiveProfiles;

import java.io.IOException;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

import static io.restassured.RestAssured.given;
import static oidc.manage.ServiceProviderTranslation.translateServiceProviderEntityId;
import static org.junit.Assert.assertEquals;

@SuppressWarnings("unchecked")
@ActiveProfiles(value = "nope", inheritProfiles = false)
public class MetadataControllerTest extends AbstractIntegrationTest {

    @Test
    public void connections() throws IOException {
        mongoTemplate.remove(new Query(), OpenIDClient.class);

        postConnections(serviceProviders());
        assertEquals(2L, mongoTemplate.count(new Query(), OpenIDClient.class));

        List<Map<String, Object>> serviceProviders = serviceProviders();
        Map<String, Object> mockSp = serviceProviders.get(0);
        ((Map) mockSp.get("data")).put("entityid", "changed");

        Map<String, Object> mockRp = serviceProviders.get(1);
        ((Map) Map.class.cast(mockRp.get("data")).get("metaDataFields")).put("name:en", "changed");

        postConnections(serviceProviders);

        assertEquals(2L, mongoTemplate.count(new Query(), OpenIDClient.class));

        OpenIDClient openIDClient = mongoTemplate.find(Query.query(Criteria.where("clientId").is("changed")), OpenIDClient.class).get(0);
        assertEquals("changed", openIDClient.getClientId());

        openIDClient = mongoTemplate.find(Query.query(Criteria.where("clientId")
                .is(translateServiceProviderEntityId("http://mock-rp"))), OpenIDClient.class).get(0);
        assertEquals("changed", openIDClient.getName());
    }

    @Test
    @Ignore
    public void rollback() throws IOException {
        List<Map<String, Object>> serviceProviders = new ArrayList<>();
        doPostConnections(serviceProviders, 500);

        List<String> clientIds = mongoTemplate.find(new Query(), OpenIDClient.class).stream().map(OpenIDClient::getClientId).collect(Collectors.toList());
        clientIds.sort(String::compareTo);
        assertEquals(Arrays.asList("http@//mock-rp", "http@//mock-sp"), clientIds);
    }

    private void postConnections(List<Map<String, Object>> serviceProviders) throws IOException {
        doPostConnections(serviceProviders, 201);
    }

    private void doPostConnections(List<Map<String, Object>> serviceProviders, int expectedStatusCode) {
        String forceError = expectedStatusCode == 500 ? "?forceError=true" : "";
        given()
                .when()
                .header("Content-type", "application/json")
                .auth()
                .preemptive()
                .basic("manage", "secret")
                .body(serviceProviders)
                .post("manage/connections" + forceError)
                .then()
                .statusCode(expectedStatusCode);
    }

}