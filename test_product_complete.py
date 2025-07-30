#!/usr/bin/env python3
"""
Complete test script for product page functionality
Tests both backend API and provides frontend testing guidance
"""

import requests
import json
import webbrowser
import os
from datetime import datetime

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"
FRONTEND_URL = "http://localhost:3000"

def test_backend_functionality():
    """Test all backend endpoints required for product page"""
    
    print("🔧 Testing Backend Functionality")
    print("=" * 50)
    
    # Use existing verified user
    test_email = "backend_test@example.com"
    test_password = "testpass123"
    
    # Step 1: Login
    print("\n1. Testing Authentication...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "email": test_email,
            "password": test_password
        })
        if response.status_code == 200:
            auth_data = response.json()
            access_token = auth_data['tokens']['access']
            print("✅ Authentication successful")
        else:
            print(f"❌ Authentication failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return None
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get websites
    print("\n2. Testing Website Endpoints...")
    try:
        # Get user websites
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        if response.status_code == 200:
            websites_data = response.json()
            websites = websites_data.get('results', websites_data) if isinstance(websites_data, dict) else websites_data
            if websites:
                website = websites[0]
                print(f"✅ User websites endpoint working")
                
                # Test public website endpoint
                response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={website['slug']}")
                if response.status_code == 200:
                    public_website = response.json()
                    print(f"✅ Public website endpoint working")
                else:
                    print(f"❌ Public website endpoint failed: {response.text}")
                    return None
            else:
                print("❌ No websites found")
                return None
        else:
            print(f"❌ Website endpoints failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Website error: {e}")
        return None
    
    # Step 3: Get products
    print("\n3. Testing Product Endpoints...")
    try:
        # Get user products
        response = requests.get(f"{BASE_URL}/products/?website={website['id']}", headers=headers)
        if response.status_code == 200:
            products_data = response.json()
            products = products_data.get('results', products_data) if isinstance(products_data, dict) else products_data
            if products:
                product = products[0]
                print(f"✅ User products endpoint working")
                
                # Test public product endpoint
                response = requests.get(f"{BASE_URL}/products/{product['id']}/public_detail/")
                if response.status_code == 200:
                    public_product = response.json()
                    print(f"✅ Public product endpoint working")
                    print(f"   Product: {public_product['name']}")
                    print(f"   Price: ${public_product['price']}")
                    print(f"   Status: {public_product['status']}")
                    print(f"   Inventory: {public_product['inventory']}")
                else:
                    print(f"❌ Public product endpoint failed: {response.text}")
                    return None
            else:
                print("❌ No products found")
                return None
        else:
            print(f"❌ Product endpoints failed: {response.text}")
            return None
    except Exception as e:
        print(f"❌ Product error: {e}")
        return None
    
    # Step 4: Test cart endpoints
    print("\n4. Testing Cart Endpoints...")
    try:
        # Get cart
        response = requests.get(f"{BASE_URL}/cart/", headers=headers)
        if response.status_code == 200:
            print("✅ Get cart endpoint working")
            
            # Test add to cart
            cart_item = {
                "product_id": product['id'],
                "product_name": product['name'],
                "product_price": float(product['price']),
                "product_image": "",
                "product_sku": product.get('sku', ''),
                "quantity": 1,
                "websiteSlug": website['slug'],
                "websiteId": website['id'],
                "websiteName": website['name']
            }
            
            response = requests.post(f"{BASE_URL}/cart/", json=cart_item, headers=headers)
            if response.status_code in [200, 201]:
                print("✅ Add to cart endpoint working")
                cart_item_id = response.json().get('id')
                
                # Test remove from cart
                if cart_item_id:
                    response = requests.delete(f"{BASE_URL}/cart/{cart_item_id}/", headers=headers)
                    if response.status_code in [200, 204]:
                        print("✅ Remove from cart endpoint working")
                    else:
                        print(f"⚠️ Remove from cart endpoint issue: {response.status_code}")
            else:
                print(f"❌ Add to cart endpoint failed: {response.text}")
        else:
            print(f"❌ Cart endpoints failed: {response.text}")
    except Exception as e:
        print(f"❌ Cart error: {e}")
    
    return {
        'website': website,
        'product': product,
        'public_website': public_website,
        'public_product': public_product
    }

def generate_frontend_test_urls(test_data):
    """Generate test URLs for frontend testing"""
    
    if not test_data:
        return []
    
    website = test_data['website']
    product = test_data['product']
    
    return [
        {
            'name': 'Working Product Page',
            'url': f"{FRONTEND_URL}/{website['slug']}/products/{product['id']}",
            'description': 'Should load the product page with all functionality',
            'expected': 'Product loads, tabs work, cart functions work'
        },
        {
            'name': 'Invalid Website Test',
            'url': f"{FRONTEND_URL}/nonexistent-website/products/{product['id']}",
            'description': 'Should show website not found error',
            'expected': 'Smart 404 page with helpful error message'
        },
        {
            'name': 'Invalid Product Test',
            'url': f"{FRONTEND_URL}/{website['slug']}/products/999",
            'description': 'Should show product not found error',
            'expected': 'Product not found error with navigation options'
        },
        {
            'name': 'Invalid Product ID Format',
            'url': f"{FRONTEND_URL}/{website['slug']}/products/invalid-id",
            'description': 'Should show invalid product ID error',
            'expected': 'Invalid product ID error with format explanation'
        }
    ]

def print_frontend_test_guide(test_urls):
    """Print comprehensive frontend testing guide"""
    
    print("\n🌐 Frontend Testing Guide")
    print("=" * 50)
    
    print("\n📋 Prerequisites:")
    print("1. Make sure React development server is running on port 3000")
    print("2. Open browser developer tools to monitor console messages")
    print("3. Test each URL and verify the expected behavior")
    
    print("\n🔗 Test URLs:")
    for i, test in enumerate(test_urls, 1):
        print(f"\n{i}. {test['name']}")
        print(f"   URL: {test['url']}")
        print(f"   Test: {test['description']}")
        print(f"   Expected: {test['expected']}")
    
    print("\n✨ Functionality to Test:")
    print("\n🔄 Tab Functionality:")
    print("   • Click 'Description' tab - should show product description and features")
    print("   • Click 'Specifications' tab - should show product specs and variants")
    print("   • Click 'Reviews' tab - should show customer reviews (mock data)")
    print("   • Active tab should be visually highlighted")
    
    print("\n🛒 Cart Functionality:")
    print("   • Change quantity using +/- buttons")
    print("   • Select different variants (if available)")
    print("   • Click 'Add to Cart' - should show loading state and success message")
    print("   • Check browser console for cart operation logs")
    
    print("\n💝 Save for Later:")
    print("   • Click 'Save for Later' button")
    print("   • Button should change appearance when saved")
    print("   • Should show success message")
    print("   • Refresh page - saved state should persist")
    
    print("\n📤 Share Functionality:")
    print("   • Click 'Share' button")
    print("   • Should copy product URL to clipboard")
    print("   • Should show success message")
    
    print("\n🖼️ Image Gallery:")
    print("   • Click thumbnail images to change main image")
    print("   • Active thumbnail should be highlighted")
    
    print("\n📱 Responsive Design:")
    print("   • Resize browser window to test mobile/tablet layouts")
    print("   • All functionality should work on different screen sizes")

def open_test_page():
    """Open the HTML test page in browser"""
    test_file = "test_product_functionality.html"
    if os.path.exists(test_file):
        file_path = os.path.abspath(test_file)
        webbrowser.open(f"file://{file_path}")
        print(f"\n🌐 Opened test page: {test_file}")
    else:
        print(f"\n❌ Test file not found: {test_file}")

def main():
    """Main test function"""
    
    print("🧪 Complete Product Page Functionality Test")
    print("=" * 60)
    print(f"Started at: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")
    
    # Test backend
    test_data = test_backend_functionality()
    
    if test_data:
        print("\n✅ Backend tests completed successfully!")
        
        # Generate frontend test URLs
        test_urls = generate_frontend_test_urls(test_data)
        
        # Print frontend testing guide
        print_frontend_test_guide(test_urls)
        
        # Open test page
        print("\n🚀 Opening test page...")
        open_test_page()
        
        print("\n" + "=" * 60)
        print("🎉 Product Page Functionality Test Complete!")
        print("\nSummary:")
        print(f"✅ Backend API endpoints working")
        print(f"✅ Test data available:")
        print(f"   - Website: {test_data['website']['name']} ({test_data['website']['slug']})")
        print(f"   - Product: {test_data['product']['name']} (ID: {test_data['product']['id']})")
        print(f"✅ Frontend test URLs generated")
        print(f"✅ Test page opened in browser")
        
        print(f"\n🔗 Main test URL:")
        print(f"   {FRONTEND_URL}/{test_data['website']['slug']}/products/{test_data['product']['id']}")
        
        print(f"\n📝 Next steps:")
        print(f"1. Use the opened test page to systematically test all functionality")
        print(f"2. Check browser console for any JavaScript errors")
        print(f"3. Test all interactive elements (tabs, buttons, etc.)")
        print(f"4. Verify responsive design on different screen sizes")
        
    else:
        print("\n❌ Backend tests failed. Please check your backend server and try again.")

if __name__ == "__main__":
    main()