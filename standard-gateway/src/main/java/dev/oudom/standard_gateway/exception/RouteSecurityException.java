package dev.oudom.standard_gateway.exception;

import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;

public class RouteSecurityException extends ResponseStatusException {

    private final String code;
    private final String authType;
    private final String wwwAuthenticate;

    public RouteSecurityException(
        HttpStatus status,
        String message,
        String code,
        String authType,
        String wwwAuthenticate
    ) {
        super(status, message);
        this.code = code;
        this.authType = authType;
        this.wwwAuthenticate = wwwAuthenticate;
    }

    public String getCode() {
        return code;
    }

    public String getAuthType() {
        return authType;
    }

    public String getWwwAuthenticate() {
        return wwwAuthenticate;
    }
}
