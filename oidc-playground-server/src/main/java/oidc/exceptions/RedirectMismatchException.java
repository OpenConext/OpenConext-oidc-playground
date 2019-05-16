package oidc.exceptions;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.ResponseStatus;

@ResponseStatus(value = HttpStatus.FOUND)
public class RedirectMismatchException extends RuntimeException {
    public RedirectMismatchException(String message) {
        super(message);
    }
}
