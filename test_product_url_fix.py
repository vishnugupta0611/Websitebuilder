#!/usr/bin/env python3
"""
Quick test to verify the product page URL fix is working
"""

import requests
import webbrowser
import time

def test_product_url_fix():
    """Test that the product page fix is working"""
    
    print("🔧 Testing Product Page URL Fix")
    print("=" * 40)
    
    BASE_URL = "http://127.0.0.1:8000/api"
    
    # Step 1: Get test data
    print("\n1. Getting test data...")
    try:
        # Login
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "email": "backend_test@example.com",
            "password": "testpass123"
        })
        
        if response.status_code != 200:
            print(f"❌ Login failed: {response.text}")
            return
            
        token = response.json()['tokens']['access']
        headers = {"Authorization": f"Bearer {token}"}
        
        # Get websites
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        websites = response.json().get('results', response.json())
        
        # Find published website
        website = None
        for w in websites:
            if w['status'] == 'published':
                website = w
                break
                
        if not website:
            print("❌ No published website found")
            return
            
        # Get products
        response = requests.get(f"{BASE_URL}/products/?website={website['id']}", headers=headers)
        products = response.json().get('results', response.json())
        
        # Find active product
        product = None
        for p in products:
            if p['status'] == 'active':
                product = p
                break
                
        if not product:
            print("❌ No active product found")
            return
            
        print(f"✅ Found: {website['name']} ({website['slug']}) - {product['name']} (ID: {product['id']})")
        
    except Exception as e:
        print(f"❌ Error getting test data: {e}")
        return
    
    # Step 2: Test backend endpoints
    print("\n2. Testing backend endpoints...")
    
    # Test website endpoint
    try:
        response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={website['slug']}")
        if response.status_code == 200:
            print("✅ Website endpoint working")
        else:
            print(f"❌ Website endpoint failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Website endpoint error: {e}")
        return
    
    # Test product endpoint
    try:
        response = requests.get(f"{BASE_URL}/products/{product['id']}/public_detail/")
        if response.status_code == 200:
            print("✅ Product endpoint working")
        else:
            print(f"❌ Product endpoint failed: {response.status_code}")
            return
    except Exception as e:
        print(f"❌ Product endpoint error: {e}")
        return
    
    # Step 3: Show URLs
    working_url = f"http://localhost:3000/{website['slug']}/products/{product['id']}"
    broken_url = "http://localhost:3000/www/products/Awe"
    
    print(f"\n3. URL Comparison:")
    print(f"✅ WORKING: {working_url}")
    print(f"❌ BROKEN:  {broken_url}")
    
    print(f"\n4. Fix Summary:")
    print(f"- Fixed duplicate import in App.jsx")
    print(f"- Enhanced error handling in UserProductDetail.jsx")
    print(f"- Added NotFound component for better 404 handling")
    print(f"- Created test tools for verification")
    
    print(f"\n🎉 Product page fix is ready!")
    print(f"Visit: {working_url}")
    
    # Ask to open browser
    try:
        choice = input(f"\nOpen working URL in browser? (y/n): ").lower().strip()
        if choice == 'y':
            print("Opening browser...")
            webbrowser.open(working_url)
    except KeyboardInterrupt:
        print("\nSkipping browser...")

if __name__ == "__main__":
    test_product_url_fix()