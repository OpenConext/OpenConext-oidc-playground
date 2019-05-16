package oidc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FOUND)
public class InvalidScopeException extends RuntimeException {
    public InvalidScopeException(String message) {
        super(message);
    }
}
