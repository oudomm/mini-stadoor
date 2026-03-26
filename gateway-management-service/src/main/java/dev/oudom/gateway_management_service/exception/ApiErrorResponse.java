package dev.oudom.gateway_management_service.exception;

import java.time.Instant;
import java.util.List;

public record ApiErrorResponse(
    Instant timestamp,
    int status,
    String error,
    String message,
    String path,
    List<FieldValidationError> fieldErrors
) {
    public record FieldValidationError(String field, String message) {
    }
}
