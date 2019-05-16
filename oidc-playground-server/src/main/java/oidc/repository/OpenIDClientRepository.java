package oidc.repository;

import oidc.model.OpenIDClient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface OpenIDClientRepository extends MongoRepository<OpenIDClient, String> {

    OpenIDClient findByClientId(String clientId);
}
