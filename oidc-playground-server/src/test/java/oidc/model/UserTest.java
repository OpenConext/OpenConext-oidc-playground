package oidc.model;

import oidc.TestUtils;
import org.junit.Test;

import java.io.IOException;

import static org.junit.Assert.assertEquals;
import static org.junit.Assert.assertNotEquals;

public class UserTest implements TestUtils {

    @Test
    public void hashCodeEquals() throws IOException {
        User user1 = readUser();
        User user2 = readUser();
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());

        user1.setId("id");
        assertEquals(user1, user2);
        assertEquals(user1.hashCode(), user2.hashCode());

        user1.getAttributes().put("preferred_username", "changed");
        assertNotEquals(user1, user2);
        assertNotEquals(user1.hashCode(), user2.hashCode());
    }

    private User readUser() throws IOException {
        return objectMapper.readValue(readFile("data/user.json").getBytes(), User.class);
    }


}