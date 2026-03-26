package dev.oudom.gateway_management_service.security;

import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.oauth2.jwt.Jwt;
import org.springframework.stereotype.Component;
import org.springframework.web.server.ResponseStatusException;

import static org.springframework.http.HttpStatus.UNAUTHORIZED;

@Component
public class DeveloperIdentityResolver {

    public DeveloperIdentity currentDeveloper() {
        Authentication authentication = SecurityContextHolder.getContext().getAuthentication();
        if (authentication == null || !(authentication.getPrincipal() instanceof Jwt jwt)) {
            throw new ResponseStatusException(UNAUTHORIZED, "Missing authenticated developer");
        }

        String userUuid = stringClaim(jwt, "uuid", jwt.getSubject());
        String username = stringClaim(jwt, "username", jwt.getSubject());
        String email = stringClaim(jwt, "email", username + "@mini-stadoor.local");

        return new DeveloperIdentity(userUuid, username, email);
    }

    private String stringClaim(Jwt jwt, String claimName, String fallback) {
        String value = jwt.getClaimAsString(claimName);
        return value != null && !value.isBlank() ? value : fallback;
    }
}
