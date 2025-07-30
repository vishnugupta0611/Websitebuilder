#!/usr/bin/env python3
"""
Test script to verify the product page fix
"""

import requests
import webbrowser
import time

def test_product_fix():
    """Test the product page fix"""
    
    print("🔧 Testing Product Page Fix")
    print("=" * 50)
    
    # Backend URL
    BASE_URL = "http://127.0.0.1:8000/api"
    
    # Step 1: Login to get token
    print("\n1. Getting test data...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "email": "backend_test@example.com",
            "password": "testpass123"
        })
        if response.status_code == 200:
            auth_data = response.json()
            access_token = auth_data['tokens']['access']
            print("✅ Logged in successfully")
        else:
            print(f"❌ Login failed: {response.text}")
            return
    except Exception as e:
        print(f"❌ Login error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get a published website with active products
    try:
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        if response.status_code == 200:
            websites_data = response.json()
            websites = websites_data.get('results', websites_data)
            
            # Find a published website
            published_website = None
            for website in websites:
                if website['status'] == 'published':
                    published_website = website
                    break
            
            if not published_website:
                print("❌ No published websites found")
                return
                
            print(f"✅ Found published website: {published_website['name']} ({published_website['slug']})")
            
        else:
            print(f"❌ Failed to get websites: {response.text}")
            return
    except Exception as e:
        print(f"❌ Website error: {e}")
        return
    
    # Step 3: Get active products for this website
    try:
        response = requests.get(f"{BASE_URL}/products/?website={published_website['id']}", headers=headers)
        if response.status_code == 200:
            products_data = response.json()
            products = products_data.get('results', products_data)
            
            # Find an active product
            active_product = None
            for product in products:
                if product['status'] == 'active':
                    active_product = product
                    break
            
            if not active_product:
                print("❌ No active products found")
                return
                
            print(f"✅ Found active product: {active_product['name']} (ID: {active_product['id']})")
            
        else:
            print(f"❌ Failed to get products: {response.text}")
            return
    except Exception as e:
        print(f"❌ Product error: {e}")
        return
    
    # Step 4: Test the endpoints
    print("\n2. Testing backend endpoints...")
    
    # Test website endpoint
    try:
        response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={published_website['slug']}")
        if response.status_code == 200:
            print("✅ Website endpoint working")
        else:
            print(f"❌ Website endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Website endpoint error: {e}")
    
    # Test product endpoint
    try:
        response = requests.get(f"{BASE_URL}/products/{active_product['id']}/public_detail/")
        if response.status_code == 200:
            print("✅ Product endpoint working")
        else:
            print(f"❌ Product endpoint failed: {response.status_code}")
    except Exception as e:
        print(f"❌ Product endpoint error: {e}")
    
    # Step 5: Generate test URLs
    print("\n3. Test URLs:")
    print("=" * 50)
    
    # Working URL
    working_url = f"http://localhost:3000/{published_website['slug']}/products/{active_product['id']}"
    print(f"✅ WORKING URL:")
    print(f"   {working_url}")
    
    # Broken URLs (examples)
    print(f"\n❌ BROKEN URLs (for comparison):")
    print(f"   http://localhost:3000/www/products/Awe  (invalid website + invalid product ID)")
    print(f"   http://localhost:3000/{published_website['slug']}/products/999  (valid website + invalid product ID)")
    print(f"   http://localhost:3000/invalid-slug/products/{active_product['id']}  (invalid website + valid product ID)")
    
    print(f"\n4. Frontend test page:")
    print(f"   Open: http://localhost:3000/test_product_frontend.html")
    
    print(f"\n5. Instructions:")
    print(f"   1. Make sure your React dev server is running on port 3000")
    print(f"   2. Make sure your Django backend is running on port 8000")
    print(f"   3. Visit the working URL above")
    print(f"   4. The product page should load correctly")
    print(f"   5. You should be able to add the product to cart")
    
    # Ask if user wants to open the URLs
    try:
        choice = input(f"\nWould you like to open the working URL in your browser? (y/n): ").lower().strip()
        if choice == 'y':
            print("Opening working URL...")
            webbrowser.open(working_url)
            time.sleep(2)
            
            choice2 = input("Would you like to open the test page too? (y/n): ").lower().strip()
            if choice2 == 'y':
                print("Opening test page...")
                webbrowser.open("http://localhost:3000/test_product_frontend.html")
    except KeyboardInterrupt:
        print("\nSkipping browser opening...")
    
    print(f"\n🎉 Product page fix test completed!")
    print(f"Summary:")
    print(f"- Website: {published_website['name']} ({published_website['slug']})")
    print(f"- Product: {active_product['name']} (ID: {active_product['id']})")
    print(f"- Working URL: {working_url}")

if __name__ == "__main__":
    test_product_fix()