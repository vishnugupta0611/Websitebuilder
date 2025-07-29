#!/usr/bin/env python3
import requests
import json
import random

def test_cart_page_direct():
    """Test cart page directly by creating a website and adding products"""
    print("🛒 Testing Cart Page Direct Access...")
    
    # Generate unique data
    user_id = random.randint(1000, 9999)
    
    # Register and authenticate
    register_data = {
        "firstName": "CartPage",
        "lastName": "Tester", 
        "email": f"cartpage.tester{user_id}@example.com",
        "phone": "1234567890",
        "password": "MyStr0ngP@ssw0rd123!",
        "confirmPassword": "MyStr0ngP@ssw0rd123!"
    }
    
    headers = {"Content-Type": "application/json"}
    
    print("\n1. Setting up test user and website...")
    register_response = requests.post("http://localhost:8000/api/auth/register/", json=register_data, headers=headers)
    if register_response.status_code != 201:
        print(f"❌ Registration failed: {register_response.text}")
        return False
    
    # Verify OTP
    otp_data = {"email": register_data["email"], "otp": "123456"}
    otp_response = requests.post("http://localhost:8000/api/auth/verify-otp/", json=otp_data, headers=headers)
    if otp_response.status_code != 200:
        print(f"❌ OTP verification failed: {otp_response.text}")
        return False
    
    otp_result = otp_response.json()
    access_token = otp_result['tokens']['access']
    auth_headers = {
        "Content-Type": "application/json",
        "Authorization": f"Bearer {access_token}"
    }
    
    # Create website
    website_data = {
        "name": f"Cart Page Test {user_id}",
        "slug": f"cart-page-test-{user_id}",
        "description": "A test store for cart page functionality",
        "category": "ecommerce",
        "status": "published",
        "customizations": {
            "colors": {
                "primary": "#10b981",
                "secondary": "#6b7280",
                "accent": "#f59e0b",
                "background": "#ffffff",
                "text": "#111827"
            },
            "typography": {
                "headingFont": "Inter",
                "bodyFont": "Inter"
            }
        }
    }
    
    website_response = requests.post("http://localhost:8000/api/websites/", json=website_data, headers=auth_headers)
    if website_response.status_code != 201:
        print(f"❌ Website creation failed: {website_response.text}")
        return False
    
    website_result = website_response.json()
    website_slug = website_result['slug']
    website_id = website_result['id']
    print(f"✅ Website created: {website_slug}")
    
    # Create a test product
    print("\n2. Creating test product...")
    product_data = {
        "name": "Test Product for Cart",
        "slug": "test-product-cart",
        "description": "A test product for cart page testing",
        "shortDescription": "Test product",
        "price": 99.99,
        "originalPrice": 129.99,
        "category": "Test",
        "inventory": 10,
        "sku": "TEST-001",
        "images": ["https://via.placeholder.com/400x300/10b981/white?text=Test+Product"],
        "website": website_id,
        "status": "active"
    }
    
    product_response = requests.post("http://localhost:8000/api/products/", json=product_data, headers=auth_headers)
    if product_response.status_code != 201:
        print(f"❌ Product creation failed: {product_response.text}")
        return False
    
    product_result = product_response.json()
    print(f"✅ Product created: {product_result['name']}")
    
    # Add product to cart
    print("\n3. Adding product to cart...")
    cart_item = {
        "product_id": product_result["id"],
        "product_name": product_result["name"],
        "product_price": product_result["price"],
        "product_image": product_result["images"][0],
        "product_sku": product_result["sku"],
        "quantity": 2,
        "websiteSlug": website_slug,
        "websiteId": website_id,
        "websiteName": website_data["name"]
    }
    
    add_response = requests.post("http://localhost:8000/api/cart/add_to_cart/", json=cart_item, headers=auth_headers)
    if add_response.status_code == 201:
        print(f"✅ Product added to cart (qty: 2)")
    else:
        print(f"❌ Failed to add to cart: {add_response.text}")
        return False
    
    # Verify cart contents
    print("\n4. Verifying cart contents...")
    cart_response = requests.get("http://localhost:8000/api/cart/", headers=auth_headers)
    if cart_response.status_code == 200:
        cart_data = cart_response.json()
        cart_results = cart_data.get('results', cart_data) if isinstance(cart_data, dict) else cart_data
        website_cart_items = [item for item in cart_results if item.get('websiteSlug') == website_slug]
        
        if len(website_cart_items) > 0:
            print(f"✅ Cart has {len(website_cart_items)} items")
            for item in website_cart_items:
                print(f"   📦 {item['product_name']} - Qty: {item['quantity']} - ${float(item['product_price']):.2f}")
        else:
            print("❌ Cart is empty")
            return False
    else:
        print(f"❌ Failed to get cart: {cart_response.text}")
        return False
    
    # Test website API access (for cart page)
    print("\n5. Testing website API access...")
    website_api_response = requests.get(f"http://localhost:8000/api/websites/by_slug/?slug={website_slug}")
    if website_api_response.status_code == 200:
        website_api_data = website_api_response.json()
        print(f"✅ Website API accessible: {website_api_data['name']}")
    else:
        print(f"❌ Website API failed: {website_api_response.text}")
        return False
    
    print(f"\n🎉 Cart page test setup completed!")
    print(f"   - Website: {website_slug}")
    print(f"   - Product in cart: {product_result['name']} (qty: 2)")
    print(f"   - Cart total: ${float(product_result['price']) * 2:.2f}")
    
    print(f"\n📋 Test URLs:")
    print(f"   - Website: http://localhost:3000/{website_slug}")
    print(f"   - Cart Page: http://localhost:3000/{website_slug}/cart")
    print(f"   - Expected: Cart should show 1 product with quantity 2")
    
    print(f"\n🔍 Debug Info:")
    print(f"   - Website ID: {website_id}")
    print(f"   - Product ID: {product_result['id']}")
    print(f"   - Cart items for website: {len(website_cart_items)}")
    
    return True

if __name__ == "__main__":
    test_cart_page_direct()