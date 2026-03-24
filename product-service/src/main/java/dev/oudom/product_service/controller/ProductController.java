package dev.oudom.product_service.controller;

import dev.oudom.product_service.dto.ProductResponse;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;

import java.util.List;

import static org.springframework.http.HttpStatus.NOT_FOUND;

@RestController
@RequestMapping("/products")
public class ProductController {

    private static final List<ProductResponse> PRODUCTS = List.of(
        new ProductResponse("p-100", "Mechanical Keyboard", "accessories", 89.99),
        new ProductResponse("p-200", "4K Monitor", "display", 299.00),
        new ProductResponse("p-300", "USB-C Dock", "accessories", 129.50)
    );

    @GetMapping
    public List<ProductResponse> products(@RequestParam(required = false) String category) {
        if (category == null || category.isBlank()) {
            return PRODUCTS;
        }

        return PRODUCTS.stream()
            .filter(product -> product.category().equalsIgnoreCase(category))
            .toList();
    }

    @GetMapping("/{id}")
    public ProductResponse productById(@PathVariable String id) {
        return PRODUCTS.stream()
            .filter(product -> product.id().equalsIgnoreCase(id))
            .findFirst()
            .orElseThrow(() -> new ResponseStatusException(NOT_FOUND, "Product not found: " + id));
    }

    @GetMapping("/featured")
    public ProductResponse featuredProduct() {
        return PRODUCTS.getFirst();
    }
}
