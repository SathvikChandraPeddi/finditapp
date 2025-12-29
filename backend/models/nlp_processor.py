import re
from collections import Counter

class NLPProcessor:
    """
    Simple NLP processor for extracting item keywords from natural language queries
    """
    
    def __init__(self):
        """Initialize NLP processor with common stop words and item synonyms"""
        
        # Common stop words to filter out
        self.stop_words = {
            'where', 'are', 'my', 'is', 'the', 'a', 'an', 'i', 'me', 'you', 
            'he', 'she', 'it', 'we', 'they', 'this', 'that', 'these', 'those',
            'am', 'was', 'were', 'been', 'being', 'have', 'has', 'had', 'do',
            'does', 'did', 'will', 'would', 'should', 'could', 'may', 'might',
            'can', 'find', 'looking', 'for', 'search', 'locate', 'put', 'kept',
            'stored', 'placed', 'left', 'see', 'know', 'remember'
        }
        
        # Common item synonyms/variations
        self.synonyms = {
            'phone': ['mobile', 'cell', 'cellphone', 'smartphone', 'iphone', 'android'],
            'keys': ['key', 'keychain', 'car key', 'house key', 'bike key'],
            'wallet': ['purse', 'billfold', 'card holder'],
            'glasses': ['spectacles', 'eyeglasses', 'specs', 'sunglasses', 'shades'],
            'remote': ['tv remote', 'remote control', 'controller'],
            'charger': ['cable', 'charging cable', 'power cord', 'adapter'],
            'headphones': ['earphones', 'earbuds', 'headset', 'airpods'],
            'watch': ['wristwatch', 'smartwatch', 'timepiece']
        }
        
        print("✅ NLP Processor initialized")
    
    def extract_keywords(self, query):
        """
        Extract relevant item keywords from a natural language query
        
        Args:
            query (str): User's search query
            
        Returns:
            list: List of extracted keywords
        """
        if not query:
            return []
        
        # Convert to lowercase
        query = query.lower().strip()
        
        # Remove punctuation except apostrophes (for contractions)
        query = re.sub(r'[^\w\s\']', ' ', query)
        
        # Split into words
        words = query.split()
        
        # Filter out stop words
        keywords = [word for word in words if word not in self.stop_words and len(word) > 1]
        
        # Expand keywords with synonyms
        expanded_keywords = []
        for keyword in keywords:
            expanded_keywords.append(keyword)
            # Check if this keyword is a synonym for something
            for main_term, synonyms in self.synonyms.items():
                if keyword in synonyms:
                    expanded_keywords.append(main_term)
                elif keyword == main_term:
                    expanded_keywords.extend(synonyms)
        
        # Remove duplicates while preserving order
        seen = set()
        unique_keywords = []
        for keyword in expanded_keywords:
            if keyword not in seen:
                seen.add(keyword)
                unique_keywords.append(keyword)
        
        print(f"🔍 Query: '{query}' → Keywords: {unique_keywords}")
        return unique_keywords
    
    def fuzzy_match(self, query, stored_items):
        """
        Perform fuzzy matching between query and stored items
        
        Args:
            query (str): User's search query
            stored_items (list): List of stored item names
            
        Returns:
            str: Best matching item name, or None if no good match
        """
        keywords = self.extract_keywords(query)
        
        if not keywords:
            return None
        
        # Score each stored item
        best_match = None
        best_score = 0
        
        for item in stored_items:
            item_lower = item.lower()
            score = 0
            
            # Check how many keywords appear in this item
            for keyword in keywords:
                if keyword in item_lower:
                    score += 1
            
            # Bonus for exact match
            if any(keyword == item_lower for keyword in keywords):
                score += 2
            
            if score > best_score:
                best_score = score
                best_match = item
        
        # Only return if we have at least some match
        if best_score > 0:
            print(f"✅ Best match: '{best_match}' (score: {best_score})")
            return best_match
        
        return None
    
    def extract_location_keywords(self, description):
        """
        Extract location-related keywords from a description
        
        Args:
            description (str): Location description
            
        Returns:
            list: List of location keywords
        """
        # Common location indicators
        location_words = [
            'kitchen', 'bedroom', 'living room', 'bathroom', 'garage', 'office',
            'drawer', 'cabinet', 'shelf', 'counter', 'table', 'desk', 'closet',
            'near', 'on', 'in', 'under', 'above', 'below', 'beside', 'next to'
        ]
        
        description_lower = description.lower()
        found_locations = [word for word in location_words if word in description_lower]
        
        return found_locations

# Test the NLP processor
if __name__ == "__main__":
    nlp = NLPProcessor()
    
    # Test queries
    test_queries = [
        "Where are my keys?",
        "Find my phone",
        "Where did I put my wallet?",
        "Can you locate my car keys?",
        "I'm looking for my sunglasses"
    ]
    
    print("\n🧪 Testing NLP Processor:\n")
    for query in test_queries:
        keywords = nlp.extract_keywords(query)
        print(f"Query: '{query}'")
        print(f"Keywords: {keywords}\n")
