package dev.oudom.gateway_management_service.config;

import com.fasterxml.jackson.databind.ObjectMapper;
import dev.oudom.gateway_management_service.exception.ApiErrorResponse;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.security.core.AuthenticationException;
import org.springframework.security.web.AuthenticationEntryPoint;
import org.springframework.security.web.access.AccessDeniedHandler;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.time.Instant;
import java.util.List;
import java.util.Locale;

@Component
public class ApiSecurityErrorHandlers implements AuthenticationEntryPoint, AccessDeniedHandler {

    private final ObjectMapper objectMapper;

    public ApiSecurityErrorHandlers(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;
    }

    @Override
    public void commence(
        HttpServletRequest request,
        HttpServletResponse response,
        AuthenticationException authException
    ) throws IOException {
        Throwable rootCause = rootCause(authException);
        String rootMessage = rootCause.getMessage() == null ? "" : rootCause.getMessage();
        String normalizedMessage = rootMessage.toLowerCase(Locale.ROOT);

        HttpStatus status = HttpStatus.UNAUTHORIZED;
        String message = "Authentication failed";

        if (normalizedMessage.contains("oauth2/jwks")
            || normalizedMessage.contains("read timed out")
            || normalizedMessage.contains("connection refused")
            || normalizedMessage.contains("i/o error")) {
            status = HttpStatus.SERVICE_UNAVAILABLE;
            message = "IAM server is unavailable or too slow while validating the developer access token";
        }

        writeError(response, request, status, message);
    }

    @Override
    public void handle(
        HttpServletRequest request,
        HttpServletResponse response,
        AccessDeniedException accessDeniedException
    ) throws IOException {
        writeError(response, request, HttpStatus.FORBIDDEN, "You do not have permission to access this resource");
    }

    private void writeError(
        HttpServletResponse response,
        HttpServletRequest request,
        HttpStatus status,
        String message
    ) throws IOException {
        response.setStatus(status.value());
        response.setContentType(MediaType.APPLICATION_JSON_VALUE);

        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            message,
            request.getRequestURI(),
            List.of()
        );

        objectMapper.writeValue(response.getWriter(), body);
    }

    private Throwable rootCause(Throwable throwable) {
        Throwable current = throwable;
        while (current.getCause() != null && current.getCause() != current) {
            current = current.getCause();
        }
        return current;
    }
}
