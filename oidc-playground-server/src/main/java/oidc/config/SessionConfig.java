package oidc.config;

import com.fasterxml.jackson.databind.Module;
import com.fasterxml.jackson.databind.module.SimpleModule;
import oidc.model.User;
import oidc.user.OidcSamlAuthentication;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.jackson2.CoreJackson2Module;
import org.springframework.session.data.mongo.JacksonMongoSessionConverter;
import org.springframework.session.data.mongo.config.annotation.web.http.EnableMongoHttpSession;
import org.springframework.session.web.context.AbstractHttpSessionApplicationInitializer;
import org.springframework.session.web.http.CookieSerializer;
import org.springframework.session.web.http.DefaultCookieSerializer;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;

@Configuration
@EnableMongoHttpSession
public class SessionConfig extends AbstractHttpSessionApplicationInitializer {

    @Bean
    CookieSerializer cookieSerializer() {
        DefaultCookieSerializer defaultCookieSerializer = new DefaultCookieSerializer();
        defaultCookieSerializer.setSameSite(null);
        return defaultCookieSerializer;
    }

    @Bean
    JacksonMongoSessionConverter mongoSessionConverter() {
        SimpleModule module = new CoreJackson2Module() {
            @Override
            public void setupModule(SetupContext context) {
                super.setupModule(context);
                context.setMixInAnnotations(OidcSamlAuthentication.class, OidcSamlAuthenticationMixin.class);
                context.setMixInAnnotations(HashSet.class, HashSetMixin.class);
                context.setMixInAnnotations(User.class, UserMixin.class);
            }
        };

        List<Module> modules = new ArrayList<>();
        modules.add(module);

        return new JacksonMongoSessionConverter(modules);
    }

    private static class OidcSamlAuthenticationMixin {
    }

    private static class HashSetMixin {
    }

    private static class UserMixin {
    }


}
