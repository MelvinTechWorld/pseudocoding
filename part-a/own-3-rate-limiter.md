# Part A1.3: Pagination Parameter Clamp & Validator (`parsePagination`)

## Source Code Reference (from Task 1: `ticketing-api/src/lib/pagination.ts`)
```typescript
interface PaginationQuery {
  limit?: string;
  offset?: string;
}

interface ParsedPagination {
  limit: number;
  offset: number;
}

function parsePagination(query: PaginationQuery): ParsedPagination {
  const rawLimit = query.limit !== undefined ? Number(query.limit) : 20;
  const rawOffset = query.offset !== undefined ? Number(query.offset) : 0;

  if (Number.isNaN(rawLimit) || Number.isNaN(rawOffset)) {
    throw new Error("Pagination parameters must be valid numbers");
  }
  if (rawOffset < 0) {
    throw new Error("Offset cannot be negative");
  }

  const clampedLimit = Math.min(Math.max(rawLimit, 1), 100);
  return { limit: clampedLimit, offset: rawOffset };
}