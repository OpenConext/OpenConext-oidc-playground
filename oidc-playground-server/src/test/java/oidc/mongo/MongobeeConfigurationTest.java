package oidc.mongo;

import oidc.AbstractIntegrationTest;
import oidc.model.AuthorizationCode;
import org.junit.Test;

public class MongobeeConfigurationTest extends AbstractIntegrationTest {

    private MongobeeConfiguration subject = new MongobeeConfiguration();

    @Test
    public void createCollections() {
        mongoTemplate.dropCollection(AuthorizationCode.class);
        mongoTemplate.dropCollection("dbchangelog");
        subject.createCollections(mongoTemplate);
    }
}