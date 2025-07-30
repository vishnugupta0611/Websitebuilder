#!/usr/bin/env python3
"""
Test script to create sample data and test search functionality
"""

import requests
import json
import random
import string

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def generate_unique_email():
    """Generate a unique email for testing"""
    random_string = ''.join(random.choices(string.ascii_lowercase + string.digits, k=8))
    return f"searchtest{random_string}@example.com"

def create_test_user_and_data():
    """Use existing verified user and create sample websites, products, and blogs"""
    
    print("🧪 Testing Search Functionality")
    print("=" * 60)
    
    # Use existing verified user
    test_email = "backend_test@example.com"
    test_password = "testpass123"
    print(f"Using existing test user: {test_email}")
    
    # Step 1: Login to get token
    print("\n1. Logging in with existing user...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "email": test_email,
            "password": test_password
        })
        if response.status_code == 200:
            auth_data = response.json()
            access_token = auth_data['tokens']['access']
            print("✅ User logged in successfully")
        else:
            print(f"❌ Login failed: {response.text}")
            print("Trying alternative credentials...")
            # Try with a different user
            response = requests.post(f"{BASE_URL}/auth/login/", json={
                "email": "vishnugupta0611@gmail.com",
                "password": "TestPassword123!"
            })
            if response.status_code == 200:
                auth_data = response.json()
                access_token = auth_data['tokens']['access']
                test_email = "vishnugupta0611@gmail.com"
                print("✅ Alternative user logged in successfully")
            else:
                print(f"❌ Alternative login failed: {response.text}")
                return None
    except Exception as e:
        print(f"❌ Login error: {e}")
        return None
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Create sample websites
    print("\n2. Creating sample websites...")
    websites_data = [
        {
            "name": "Tech Solutions Inc",
            "slug": "tech-solutions-inc",
            "description": "Professional technology solutions for modern businesses",
            "category": "business",
            "heroTitle": "Welcome to Tech Solutions",
            "heroDescription": "We provide cutting-edge technology solutions",
            "status": "published"
        },
        {
            "name": "Creative Portfolio",
            "slug": "creative-portfolio",
            "description": "Showcase of creative design and development work",
            "category": "portfolio",
            "heroTitle": "Creative Design Portfolio",
            "heroDescription": "Explore our creative projects and designs",
            "status": "published"
        },
        {
            "name": "E-commerce Store",
            "slug": "ecommerce-store",
            "description": "Online store selling premium products and accessories",
            "category": "ecommerce",
            "heroTitle": "Premium Products Store",
            "heroDescription": "Shop our collection of premium items",
            "status": "published"
        }
    ]
    
    created_websites = []
    for website_data in websites_data:
        try:
            response = requests.post(f"{BASE_URL}/websites/", json=website_data, headers=headers)
            if response.status_code == 201:
                website = response.json()
                created_websites.append(website)
                print(f"✅ Created website: {website['name']}")
            else:
                print(f"❌ Failed to create website: {response.text}")
        except Exception as e:
            print(f"❌ Website creation error: {e}")
    
    # Step 3: Create sample products
    print("\n3. Creating sample products...")
    if created_websites:
        products_data = [
            {
                "website": created_websites[0]['id'],
                "name": "Professional Laptop",
                "slug": "professional-laptop",
                "description": "High-performance laptop for business professionals",
                "shortDescription": "Professional grade laptop with excellent performance",
                "price": "1299.99",
                "category": "Electronics",
                "inventory": 25,
                "sku": "LAPTOP-001",
                "status": "active"
            },
            {
                "website": created_websites[0]['id'],
                "name": "Wireless Mouse",
                "slug": "wireless-mouse",
                "description": "Ergonomic wireless mouse with precision tracking",
                "shortDescription": "Comfortable wireless mouse for productivity",
                "price": "49.99",
                "category": "Accessories",
                "inventory": 100,
                "sku": "MOUSE-001",
                "status": "active"
            },
            {
                "website": created_websites[2]['id'] if len(created_websites) > 2 else created_websites[0]['id'],
                "name": "Premium Headphones",
                "slug": "premium-headphones",
                "description": "High-quality noise-canceling headphones for music lovers",
                "shortDescription": "Premium audio experience with noise cancellation",
                "price": "299.99",
                "category": "Audio",
                "inventory": 50,
                "sku": "HEADPHONES-001",
                "status": "active"
            }
        ]
        
        for product_data in products_data:
            try:
                response = requests.post(f"{BASE_URL}/products/", json=product_data, headers=headers)
                if response.status_code == 201:
                    product = response.json()
                    print(f"✅ Created product: {product['name']}")
                else:
                    print(f"❌ Failed to create product: {response.text}")
            except Exception as e:
                print(f"❌ Product creation error: {e}")
    
    # Step 4: Create sample blog posts
    print("\n4. Creating sample blog posts...")
    if created_websites:
        blogs_data = [
            {
                "website": created_websites[0]['id'],
                "title": "The Future of Technology",
                "slug": "future-of-technology",
                "content": "Technology is rapidly evolving and changing how we work and live. In this post, we explore the latest trends in artificial intelligence, machine learning, and automation.",
                "excerpt": "Exploring the latest trends in AI and automation",
                "author": "Tech Team",
                "tags": ["technology", "AI", "future"],
                "status": "published"
            },
            {
                "website": created_websites[1]['id'] if len(created_websites) > 1 else created_websites[0]['id'],
                "title": "Creative Design Principles",
                "slug": "creative-design-principles",
                "content": "Good design is not just about aesthetics - it's about solving problems and creating meaningful experiences. Learn about the fundamental principles of creative design.",
                "excerpt": "Understanding the fundamentals of creative design",
                "author": "Design Team",
                "tags": ["design", "creativity", "principles"],
                "status": "published"
            },
            {
                "website": created_websites[2]['id'] if len(created_websites) > 2 else created_websites[0]['id'],
                "title": "E-commerce Best Practices",
                "slug": "ecommerce-best-practices",
                "content": "Running a successful online store requires attention to user experience, product presentation, and customer service. Here are the best practices for e-commerce success.",
                "excerpt": "Essential tips for e-commerce success",
                "author": "Business Team",
                "tags": ["ecommerce", "business", "online-store"],
                "status": "published"
            }
        ]
        
        for blog_data in blogs_data:
            try:
                response = requests.post(f"{BASE_URL}/blogs/", json=blog_data, headers=headers)
                if response.status_code == 201:
                    blog = response.json()
                    print(f"✅ Created blog post: {blog['title']}")
                else:
                    print(f"❌ Failed to create blog post: {response.text}")
            except Exception as e:
                print(f"❌ Blog creation error: {e}")
    
    return test_email, access_token

def test_search_api(access_token):
    """Test the search API endpoints"""
    
    print("\n5. Testing search API...")
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Test search queries
    test_queries = [
        "technology",
        "laptop",
        "design",
        "business",
        "premium"
    ]
    
    for query in test_queries:
        try:
            response = requests.get(f"{BASE_URL}/search/?q={query}", headers=headers)
            if response.status_code == 200:
                results = response.json()
                print(f"✅ Search '{query}': {results['total']} results found")
                for result in results['results'][:2]:  # Show first 2 results
                    print(f"   - {result['type']}: {result['title']}")
            else:
                print(f"❌ Search '{query}' failed: {response.text}")
        except Exception as e:
            print(f"❌ Search error for '{query}': {e}")
    
    # Test search suggestions
    print("\n6. Testing search suggestions...")
    try:
        response = requests.get(f"{BASE_URL}/search/suggestions/?q=tech", headers=headers)
        if response.status_code == 200:
            suggestions = response.json()
            print(f"✅ Search suggestions: {suggestions}")
        else:
            print(f"❌ Search suggestions failed: {response.text}")
    except Exception as e:
        print(f"❌ Search suggestions error: {e}")
    
    # Test popular searches
    print("\n7. Testing popular searches...")
    try:
        response = requests.get(f"{BASE_URL}/search/popular/", headers=headers)
        if response.status_code == 200:
            popular = response.json()
            print(f"✅ Popular searches: {len(popular)} items")
            for item in popular[:3]:
                print(f"   - {item['query']} ({item['count']} searches)")
        else:
            print(f"❌ Popular searches failed: {response.text}")
    except Exception as e:
        print(f"❌ Popular searches error: {e}")

def main():
    """Main test function"""
    result = create_test_user_and_data()
    if result:
        test_email, access_token = result
        test_search_api(access_token)
        
        print("\n" + "=" * 60)
        print("🎉 Search functionality test completed!")
        print(f"\nTest user created: {test_email}")
        print("Password: TestPassword123!")
        print("\nYou can now:")
        print("1. Login to the frontend with these credentials")
        print("2. Use the search functionality in the header")
        print("3. Visit /search to test the search page")
        print("4. Search for: technology, laptop, design, business, premium")

if __name__ == "__main__":
    main()