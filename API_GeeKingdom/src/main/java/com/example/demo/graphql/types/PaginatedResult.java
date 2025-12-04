// src/main/java/com/example/demo/graphql/types/PaginatedResult.java

package com.example.demo.graphql.types;

import lombok.Data;
import org.springframework.data.domain.Page;

import java.util.List;

@Data
public class PaginatedResult<T> {
    private List<T> content;
    private PageInfo pageInfo;

    public PaginatedResult(Page<T> page) {
        this.content = page.getContent();
        this.pageInfo = new PageInfo(
                (int) page.getTotalElements(),
                page.getTotalPages(),
                page.getNumber(),
                page.getSize(),
                page.hasNext(),
                page.hasPrevious()
        );
    }

    public PaginatedResult(List<T> content, int totalElements, int currentPage, int pageSize) {
        this.content = content;
        int totalPages = (int) Math.ceil((double) totalElements / pageSize);
        this.pageInfo = new PageInfo(
                totalElements,
                totalPages,
                currentPage,
                pageSize,
                currentPage < totalPages - 1,
                currentPage > 0
        );
    }

    @Data
    public static class PageInfo {
        private Integer totalElements;
        private Integer totalPages;
        private Integer currentPage;
        private Integer pageSize;
        private Boolean hasNext;
        private Boolean hasPrevious;

        public PageInfo(Integer totalElements, Integer totalPages, Integer currentPage,
                        Integer pageSize, Boolean hasNext, Boolean hasPrevious) {
            this.totalElements = totalElements;
            this.totalPages = totalPages;
            this.currentPage = currentPage;
            this.pageSize = pageSize;
            this.hasNext = hasNext;
            this.hasPrevious = hasPrevious;
        }
    }
}