# FindIt AI Backend

This is the Python Flask backend for FindIt AI with AI/ML capabilities.

## Features

- RESTful API for item management
- YOLOv8 object detection
- Natural language query processing
- SQLite database for local storage
- Image upload and management

## Setup

### 1. Create Virtual Environment

```bash
cd backend
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Dependencies

```bash
pip install -r requirements.txt
```

### 3. Run the Server

```bash
python app.py
```

The server will start on `http://localhost:5000`

## API Endpoints

### Health Check
- **GET** `/api/health`
- Returns server status

### Add Item
- **POST** `/api/add_item`
- Body: `multipart/form-data`
  - `item_name` (required): Name of the item
  - `location` (required): Location description
  - `image` (optional): Image file
- Returns: Created item details

### Find Item
- **POST** `/api/find_item`
- Body: `application/json`
  ```json
  {
    "query": "Where are my keys?"
  }
  ```
- Returns: Item details if found

### Get All Items
- **GET** `/api/get_all_items`
- Returns: List of all stored items

### Delete Item
- **DELETE** `/api/delete_item/<id>`
- Returns: Success confirmation

## AI Models

### Object Detection (YOLOv8)
- Automatically detects objects in uploaded images
- Uses YOLOv8 nano model for fast inference
- Confidence threshold: 30%

### NLP Processor
- Extracts keywords from natural language queries
- Handles synonyms and common variations
- Filters out stop words

## Database Schema

```sql
CREATE TABLE items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    item_name TEXT NOT NULL,
    location TEXT NOT NULL,
    image_path TEXT,
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);
```

## Error Handling

All endpoints return appropriate HTTP status codes:
- 200: Success
- 201: Created
- 400: Bad Request
- 404: Not Found
- 500: Internal Server Error

## Testing

Test individual components:

```bash
# Test object detector
python models/object_detector.py

# Test NLP processor
python models/nlp_processor.py
```
