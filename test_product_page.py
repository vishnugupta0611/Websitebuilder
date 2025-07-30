#!/usr/bin/env python3
"""
Test script to verify product page functionality
"""

import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_product_page():
    """Test the product page functionality"""
    
    print("🧪 Testing Product Page Functionality")
    print("=" * 60)
    
    # Use existing verified user
    test_email = "backend_test@example.com"
    test_password = "testpass123"
    
    # Step 1: Login to get token
    print("\n1. Logging in...")
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
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get user's websites
    print("\n2. Getting user websites...")
    try:
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        print(f"   Response status: {response.status_code}")
        print(f"   Response data: {response.text[:200]}...")
        if response.status_code == 200:
            websites_data = response.json()
            print(f"   Websites data type: {type(websites_data)}")
            
            # Handle both list and paginated response
            if isinstance(websites_data, dict) and 'results' in websites_data:
                websites = websites_data['results']
            else:
                websites = websites_data
                
            if websites:
                website = websites[0]  # Use first website
                print(f"✅ Found website: {website['name']} (slug: {website['slug']})")
            else:
                print("❌ No websites found")
                return
        else:
            print(f"❌ Failed to get websites: {response.text}")
            return
    except Exception as e:
        print(f"❌ Website error: {e}")
        return
    
    # Step 3: Get products for this website
    print("\n3. Getting products...")
    try:
        response = requests.get(f"{BASE_URL}/products/?website={website['id']}", headers=headers)
        if response.status_code == 200:
            products_data = response.json()
            products = products_data.get('results', products_data) if isinstance(products_data, dict) else products_data
            if products:
                product = products[0]  # Use first product
                print(f"✅ Found product: {product['name']} (ID: {product['id']})")
            else:
                print("❌ No products found")
                return
        else:
            print(f"❌ Failed to get products: {response.text}")
            return
    except Exception as e:
        print(f"❌ Product error: {e}")
        return
    
    # Step 4: Test public product endpoint
    print("\n4. Testing public product endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/products/{product['id']}/public_detail/")
        if response.status_code == 200:
            public_product = response.json()
            print(f"✅ Public product endpoint works: {public_product['name']}")
            print(f"   Price: ${public_product['price']}")
            print(f"   Status: {public_product['status']}")
            print(f"   Inventory: {public_product['inventory']}")
        else:
            print(f"❌ Public product endpoint failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Public product error: {e}")
        return
    
    # Step 5: Test website by slug endpoint
    print("\n5. Testing website by slug endpoint...")
    try:
        response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={website['slug']}")
        if response.status_code == 200:
            public_website = response.json()
            print(f"✅ Public website endpoint works: {public_website['name']}")
            print(f"   Status: {public_website['status']}")
        else:
            print(f"❌ Public website endpoint failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Public website error: {e}")
        return
    
    print("\n" + "=" * 60)
    print("🎉 Product page functionality test completed!")
    print(f"\nYou can now test the product page:")
    print(f"1. Visit: http://localhost:3001/{website['slug']}/products/{product['id']}")
    print(f"2. The page should load the product: {product['name']}")
    print(f"3. You should be able to add it to cart")
    print(f"4. Cart functionality should work")
    
    print(f"\nTest data:")
    print(f"- Website: {website['name']} ({website['slug']})")
    print(f"- Product: {product['name']} (ID: {product['id']})")
    print(f"- Price: ${product['price']}")

if __name__ == "__main__":
    test_product_page()