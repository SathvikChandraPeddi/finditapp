from pathlib import Path
import re

class ObjectDetector:
    """
    Computer Vision model for detecting objects in images
    Uses filename and basic heuristics for demo purposes
    """
    
    def __init__(self):
        """Initialize object detector"""
        print("✅ Object Detector initialized (using fallback mode)")
        self.common_objects = [
            'keys', 'key', 'wallet', 'phone', 'mobile', 'glasses', 'watch',
            'remote', 'charger', 'headphones', 'earbuds', 'laptop', 'tablet',
            'passport', 'card', 'book', 'bag', 'bottle', 'umbrella'
        ]
    
    def detect(self, image_path):
        """
        Detect the primary object in an image
        Uses filename analysis as fallback
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            str: Name of the detected object, or None if detection fails
        """
        try:
            filename = Path(image_path).stem.lower()
            filename = re.sub(r'img_|image_|photo_|pic_|\d+', '', filename)
            
            for obj in self.common_objects:
                if obj in filename:
                    print(f"🔍 Detected: {obj} (from filename)")
                    return obj.capitalize()
            
            print("ℹ️  Could not detect object, will use user input")
            return None
            
        except Exception as e:
            print(f"❌ Detection error: {e}")
            return None
    
    def detect_multiple(self, image_path, threshold=0.3):
        """
        Detect multiple objects in an image (fallback mode)
        
        Args:
            image_path (str): Path to the image file
            threshold (float): Confidence threshold (not used in fallback)
            
        Returns:
            list: List of detected objects
        """
        detected = self.detect(image_path)
        if detected:
            return [{'object': detected, 'confidence': 0.85}]
        return []

if __name__ == "__main__":
    detector = ObjectDetector()
    print("Object Detector initialized and ready!")
