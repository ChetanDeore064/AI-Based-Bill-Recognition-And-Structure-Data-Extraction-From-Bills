# CA BillMate — AI OCR Backend Microservice

High-accuracy multi-engine OCR and statutory GST validation backend for **CA BillMate**.

## Architecture & Models

- **OpenCV**: Contrast enhancement (CLAHE), deskewing, and noise removal
- **PaddleOCR v4**: High-accuracy printed text and numeric table recognition
- **TrOCR (microsoft/trocr-base-handwritten)**: Vision transformer for handwritten bills and cash memos
- **LayoutLMv3**: Semantic token classification for B2B invoice layouts
- **FastAPI**: Asynchronous REST API with CORS support

## Quick Start (Windows)

```bash
# 1. Navigate to backend directory
cd backend

# 2. Create virtual environment
python -m venv venv
venv\Scripts\activate

# 3. Install core dependencies
pip install -r requirements.txt

# 4. Start the server
uvicorn app.main:app --reload --port 8000
```

Alternatively, double click `start.bat`.

## API Endpoints

- `GET /api/health` — Connection diagnostic & engine status
- `POST /api/ocr/invoice` — Upload invoice image/PDF and receive structured JSON
- `GET /docs` — Interactive Swagger API documentation
