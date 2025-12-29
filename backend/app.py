from flask import Flask, request, jsonify, send_from_directory
from flask_cors import CORS
import os
from datetime import datetime
from models.object_detector import ObjectDetector
from models.nlp_processor import NLPProcessor
from werkzeug.utils import secure_filename

app = Flask(__name__)
CORS(app)

# Configuration
UPLOAD_FOLDER = 'uploads'
ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'webp'}

app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['MAX_CONTENT_LENGTH'] = 16 * 1024 * 1024  # 16MB max file size

# Ensure upload folder exists
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

# Initialize AI models
detector = ObjectDetector()
nlp = NLPProcessor()

# In-memory storage for items
items_store = []
item_id_counter = 1

def allowed_file(filename):
    """Check if file extension is allowed"""
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

# Routes
@app.route('/api/add_item', methods=['POST'])
def add_item():
    """Add a new item with optional image"""
    try:
        global item_id_counter
        
        item_name = request.form.get('item_name')
        location = request.form.get('location')
        
        if not item_name or not location:
            return jsonify({'error': 'Item name and location are required'}), 400
        
        image_path = None
        detected_object = None
        
        # Handle image upload
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(f"{datetime.now().timestamp()}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = filepath
                
                # Detect object in image
                detected_object = detector.detect(filepath)
                if detected_object and not item_name:
                    item_name = detected_object
        
        # Store in memory
        item = {
            'id': item_id_counter,
            'item_name': item_name,
            'location': location,
            'image_path': image_path,
            'timestamp': datetime.now().isoformat()
        }
        items_store.append(item)
        item_id = item_id_counter
        item_id_counter += 1
        
        return jsonify({
            'success': True,
            'id': item_id,
            'item_name': item_name,
            'detected_object': detected_object,
            'message': 'Item added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/find_item', methods=['POST'])
def find_item():
    """Find an item by natural language query"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Extract item name from query using NLP
        item_keywords = nlp.extract_keywords(query)
        
        if not item_keywords:
            return jsonify({'error': 'Could not understand the query'}), 400
        
        # Search in memory
        for item in reversed(items_store):  # Search from most recent
            for keyword in item_keywords:
                if keyword.lower() in item['item_name'].lower():
                    return jsonify({
                        'id': item['id'],
                        'item_name': item['item_name'],
                        'location': item['location'],
                        'image_path': item['image_path'],
                        'timestamp': item['timestamp']
                    }), 200
        
        return jsonify({'error': 'Item not found'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/get_all_items', methods=['GET'])
def get_all_items():
    """Get all stored items"""
    try:
        # Return items in reverse chronological order
        sorted_items = sorted(items_store, key=lambda x: x['timestamp'], reverse=True)
        return jsonify({'items': sorted_items}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/delete_item/<int:item_id>', methods=['DELETE'])
def delete_item(item_id):
    """Delete an item by ID"""
    try:
        global items_store
        
        # Find item in memory
        item_to_delete = None
        for item in items_store:
            if item['id'] == item_id:
                item_to_delete = item
                break
        
        if not item_to_delete:
            return jsonify({'error': 'Item not found'}), 404
        
        # Delete image file if exists
        if item_to_delete['image_path']:
            try:
                os.remove(item_to_delete['image_path'])
            except:
                pass
        
        # Remove from memory
        items_store = [item for item in items_store if item['id'] != item_id]
        
        return jsonify({'success': True, 'message': 'Item deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/uploads/<filename>')
def uploaded_file(filename):
    """Serve uploaded images"""
    return send_from_directory(app.config['UPLOAD_FOLDER'], filename)

@app.route('/api/health', methods=['GET'])
def health_check():
    """Health check endpoint"""
    return jsonify({'status': 'healthy', 'message': 'FindIt AI Backend is running'}), 200

# =====================================================
# IMPORTANT DOCUMENTS - Separate Module
# =====================================================

# In-memory storage for documents (separate from items)
documents_store = []
document_id_counter = 1

@app.route('/api/documents/add', methods=['POST'])
def add_document():
    """Add a new important document with image reference"""
    try:
        global document_id_counter
        
        document_name = request.form.get('document_name')
        document_type = request.form.get('document_type')  # e.g., 'ID', 'Certificate', 'Receipt', 'Contract', 'Other'
        description = request.form.get('description', '')
        tags = request.form.get('tags', '')  # Comma-separated tags for text-based search
        
        if not document_name or not document_type:
            return jsonify({'error': 'Document name and type are required'}), 400
        
        image_path = None
        
        # Handle image upload (stored for reference only, no OCR/learning)
        if 'image' in request.files:
            file = request.files['image']
            if file and file.filename and allowed_file(file.filename):
                filename = secure_filename(f"doc_{datetime.now().timestamp()}_{file.filename}")
                filepath = os.path.join(app.config['UPLOAD_FOLDER'], filename)
                file.save(filepath)
                image_path = filepath
        
        # Store document in memory (separate from items)
        document = {
            'id': document_id_counter,
            'document_name': document_name,
            'document_type': document_type,
            'description': description,
            'tags': tags,
            'image_path': image_path,
            'timestamp': datetime.now().isoformat()
        }
        documents_store.append(document)
        doc_id = document_id_counter
        document_id_counter += 1
        
        return jsonify({
            'success': True,
            'id': doc_id,
            'document_name': document_name,
            'message': 'Document added successfully'
        }), 201
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/find', methods=['POST'])
def find_document():
    """Find a document by text-based search (name, type, description, tags)"""
    try:
        data = request.get_json()
        query = data.get('query', '').strip().lower()
        
        if not query:
            return jsonify({'error': 'Query is required'}), 400
        
        # Text-based search across all document fields
        results = []
        for doc in reversed(documents_store):
            searchable_text = f"{doc['document_name']} {doc['document_type']} {doc['description']} {doc['tags']}".lower()
            if query in searchable_text:
                results.append(doc)
        
        if results:
            return jsonify({'documents': results}), 200
        
        return jsonify({'error': 'No documents found matching your search'}), 404
            
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/all', methods=['GET'])
def get_all_documents():
    """Get all stored documents"""
    try:
        # Return documents in reverse chronological order
        sorted_docs = sorted(documents_store, key=lambda x: x['timestamp'], reverse=True)
        return jsonify({'documents': sorted_docs}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

@app.route('/api/documents/delete/<int:doc_id>', methods=['DELETE'])
def delete_document(doc_id):
    """Delete a document by ID"""
    try:
        global documents_store
        
        # Find document in memory
        doc_to_delete = None
        for doc in documents_store:
            if doc['id'] == doc_id:
                doc_to_delete = doc
                break
        
        if not doc_to_delete:
            return jsonify({'error': 'Document not found'}), 404
        
        # Delete image file if exists
        if doc_to_delete['image_path']:
            try:
                os.remove(doc_to_delete['image_path'])
            except:
                pass
        
        # Remove from memory
        documents_store = [doc for doc in documents_store if doc['id'] != doc_id]
        
        return jsonify({'success': True, 'message': 'Document deleted successfully'}), 200
        
    except Exception as e:
        return jsonify({'error': str(e)}), 500

if __name__ == '__main__':
    print("🚀 FindIt AI Backend Server Starting...")
    print("🤖 AI models loaded")
    print("🌐 Server running on http://localhost:5002")
    app.run(debug=True, host='0.0.0.0', port=5002)
