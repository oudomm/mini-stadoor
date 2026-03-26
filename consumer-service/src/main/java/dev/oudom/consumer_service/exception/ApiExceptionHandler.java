package dev.oudom.consumer_service.exception;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.support.WebExchangeBindException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.server.ServerWebInputException;
import org.springframework.web.server.ServerWebExchange;

import java.time.Instant;
import java.util.List;

@RestControllerAdvice
public class ApiExceptionHandler {

    @ExceptionHandler(WebExchangeBindException.class)
    public ResponseEntity<ApiErrorResponse> handleValidation(
        WebExchangeBindException exception,
        ServerWebExchange exchange
    ) {
        List<ApiErrorResponse.FieldValidationError> fieldErrors = exception.getFieldErrors()
            .stream()
            .map(this::toFieldError)
            .toList();

        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Request validation failed",
            exchange.getRequest().getPath().value(),
            fieldErrors
        );

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ServerWebInputException.class)
    public ResponseEntity<ApiErrorResponse> handleInput(
        ServerWebInputException exception,
        ServerWebExchange exchange
    ) {
        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            HttpStatus.BAD_REQUEST.value(),
            HttpStatus.BAD_REQUEST.getReasonPhrase(),
            "Malformed request",
            exchange.getRequest().getPath().value(),
            List.of()
        );

        return ResponseEntity.badRequest().body(body);
    }

    @ExceptionHandler(ResponseStatusException.class)
    public ResponseEntity<ApiErrorResponse> handleResponseStatus(
        ResponseStatusException exception,
        ServerWebExchange exchange
    ) {
        HttpStatus status = HttpStatus.valueOf(exception.getStatusCode().value());
        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            status.value(),
            status.getReasonPhrase(),
            exception.getReason() == null ? "Request failed" : exception.getReason(),
            exchange.getRequest().getPath().value(),
            List.of()
        );

        return ResponseEntity.status(status).body(body);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<ApiErrorResponse> handleUnexpected(
        Exception exception,
        ServerWebExchange exchange
    ) {
        ApiErrorResponse body = new ApiErrorResponse(
            Instant.now(),
            HttpStatus.INTERNAL_SERVER_ERROR.value(),
            HttpStatus.INTERNAL_SERVER_ERROR.getReasonPhrase(),
            "Unexpected server error",
            exchange.getRequest().getPath().value(),
            List.of()
        );

        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body);
    }

    private ApiErrorResponse.FieldValidationError toFieldError(FieldError fieldError) {
        return new ApiErrorResponse.FieldValidationError(
            fieldError.getField(),
            fieldError.getDefaultMessage() == null ? "Invalid value" : fieldError.getDefaultMessage()
        );
    }
}
