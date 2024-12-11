# F1 API Reference

## Endpoints

### Drivers

#### GET /api/drivers

Returns a paginated list of F1 drivers.

**Query Parameters:**

- `page` (optional): Page number (default: 1)
- `limit` (optional): Items per page (default: 10)
- `nationality` (optional): Filter by nationality
- `search` (optional): Search in name
- `sortBy` (optional): Field to sort by
- `order` (optional): Sort order (asc/desc)

**Response Example:**

```json
{
  "success": true,
  "data": {
    "drivers": [...],
    "page": 1,
    "totalPages": 10,
    "total": 100
  }
}
```
