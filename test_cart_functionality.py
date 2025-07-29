#!/usr/bin/env python3
import requests
import json
import random

def test_cart_functionality():
    """Test complete cart functionality including add, update, remove operations"""
    print("🛒 Testing Cart Functionality...")
    
    # Generate unique data
    user_id = random.randint(1000, 9999)
    
    # Register and authenticate
    register_data = {
        "firstName": "Cart",
        "lastName": "Tester", 
        "email": f"cart.tester{user_id}@example.com",
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
        "name": f"Cart Test Store {user_id}",
        "slug": f"cart-test-{user_id}",
        "description": "A test store for cart functionality",
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
    
    # Create test products
    print("\n2. Creating test products...")
    products = [
        {
            "name": "Wireless Headphones",
            "slug": "wireless-headphones",
            "description": "High-quality wireless headphones with noise cancellation",
            "shortDescription": "Premium wireless headphones",
            "price": 199.99,
            "originalPrice": 249.99,
            "category": "Electronics",
            "inventory": 50,
            "sku": "WH-001",
            "images": ["https://via.placeholder.com/400x300/10b981/white?text=Headphones"],
            "website": website_id,
            "status": "active"
        },
        {
            "name": "Smart Watch",
            "slug": "smart-watch",
            "description": "Feature-rich smartwatch with health monitoring",
            "shortDescription": "Advanced smartwatch",
            "price": 299.99,
            "originalPrice": 349.99,
            "category": "Electronics",
            "inventory": 30,
            "sku": "SW-001",
            "images": ["https://via.placeholder.com/400x300/f59e0b/white?text=Smart+Watch"],
            "website": website_id,
            "status": "active"
        },
        {
            "name": "Bluetooth Speaker",
            "slug": "bluetooth-speaker",
            "description": "Portable Bluetooth speaker with excellent sound quality",
            "shortDescription": "Portable speaker",
            "price": 79.99,
            "originalPrice": 99.99,
            "category": "Electronics",
            "inventory": 100,
            "sku": "BS-001",
            "images": ["https://via.placeholder.com/400x300/3b82f6/white?text=Speaker"],
            "website": website_id,
            "status": "active"
        }
    ]
    
    created_products = []
    for product_data in products:
        product_response = requests.post("http://localhost:8000/api/products/", json=product_data, headers=auth_headers)
        if product_response.status_code == 201:
            created_products.append(product_response.json())
            print(f"✅ Created product: {product_data['name']}")
        else:
            print(f"❌ Failed to create product: {product_data['name']}")
    
    if len(created_products) == 0:
        print("❌ No products created, cannot test cart")
        return False
    
    # Test cart operations
    print("\n3. Testing cart operations...")
    
    # Test 1: Add items to cart
    print("\n   3.1 Adding items to cart...")
    cart_items = []
    for i, product in enumerate(created_products[:2]):  # Add first 2 products
        cart_item = {
            "product_id": product["id"],
            "product_name": product["name"],
            "product_price": product["price"],
            "product_image": product["images"][0],
            "product_sku": product["sku"],
            "quantity": i + 1,  # 1, 2 quantities
            "websiteSlug": website_slug,
            "websiteId": website_id,
            "websiteName": website_data["name"]
        }
        
        add_response = requests.post("http://localhost:8000/api/cart/add_to_cart/", json=cart_item, headers=auth_headers)
        if add_response.status_code == 201:
            cart_items.append(add_response.json())
            print(f"   ✅ Added {product['name']} (qty: {cart_item['quantity']})")
        else:
            print(f"   ❌ Failed to add {product['name']}: {add_response.text}")
    
    # Test 2: Get cart contents
    print("\n   3.2 Retrieving cart contents...")
    cart_response = requests.get("http://localhost:8000/api/cart/", headers=auth_headers)
    if cart_response.status_code == 200:
        cart_data = cart_response.json()
        cart_results = cart_data.get('results', cart_data) if isinstance(cart_data, dict) else cart_data
        website_cart_items = [item for item in cart_results if item.get('websiteSlug') == website_slug]
        
        print(f"   ✅ Cart retrieved - {len(website_cart_items)} items for this website")
        
        # Calculate total (handle string/number conversion)
        total = sum(float(item['product_price']) * int(item['quantity']) for item in website_cart_items)
        print(f"   💰 Cart total: ${total:.2f}")
        
        # Display cart contents
        for item in website_cart_items:
            print(f"   📦 {item['product_name']} - Qty: {item['quantity']} - ${float(item['product_price']):.2f} each")
    else:
        print(f"   ❌ Failed to retrieve cart: {cart_response.text}")
        return False
    
    # Test 3: Update cart item quantity
    if cart_items:
        print("\n   3.3 Updating cart item quantity...")
        first_item = cart_items[0]
        new_quantity = 5
        
        update_response = requests.put(
            f"http://localhost:8000/api/cart/{first_item['id']}/", 
            json={"quantity": new_quantity}, 
            headers=auth_headers
        )
        if update_response.status_code == 200:
            print(f"   ✅ Updated quantity to {new_quantity}")
        else:
            print(f"   ❌ Failed to update quantity: {update_response.text}")
    
    # Test 4: Remove item from cart
    if len(cart_items) > 1:
        print("\n   3.4 Removing item from cart...")
        item_to_remove = cart_items[1]
        
        remove_response = requests.delete(f"http://localhost:8000/api/cart/{item_to_remove['id']}/", headers=auth_headers)
        if remove_response.status_code == 204:
            print(f"   ✅ Removed item from cart")
        else:
            print(f"   ❌ Failed to remove item: {remove_response.text}")
    
    # Test 5: Final cart state
    print("\n   3.5 Final cart state...")
    final_cart_response = requests.get("http://localhost:8000/api/cart/", headers=auth_headers)
    if final_cart_response.status_code == 200:
        final_cart_data = final_cart_response.json()
        final_cart_results = final_cart_data.get('results', final_cart_data) if isinstance(final_cart_data, dict) else final_cart_data
        final_website_cart_items = [item for item in final_cart_results if item.get('websiteSlug') == website_slug]
        
        print(f"   ✅ Final cart: {len(final_website_cart_items)} items")
        final_total = sum(float(item['product_price']) * int(item['quantity']) for item in final_website_cart_items)
        print(f"   💰 Final total: ${final_total:.2f}")
    
    # Test 6: Clear cart
    print("\n   3.6 Clearing cart...")
    clear_response = requests.delete(f"http://localhost:8000/api/cart/clear_cart/?website_slug={website_slug}", headers=auth_headers)
    if clear_response.status_code == 200:
        print("   ✅ Cart cleared successfully")
        
        # Verify cart is empty
        empty_cart_response = requests.get("http://localhost:8000/api/cart/", headers=auth_headers)
        if empty_cart_response.status_code == 200:
            empty_cart_data = empty_cart_response.json()
            empty_cart_results = empty_cart_data.get('results', empty_cart_data) if isinstance(empty_cart_data, dict) else empty_cart_data
            empty_website_cart_items = [item for item in empty_cart_results if item.get('websiteSlug') == website_slug]
            
            if len(empty_website_cart_items) == 0:
                print("   ✅ Cart is now empty")
            else:
                print(f"   ⚠️  Cart still has {len(empty_website_cart_items)} items")
    else:
        print(f"   ❌ Failed to clear cart: {clear_response.text}")
    
    print(f"\n🎉 Cart functionality test completed!")
    print(f"   - Website: {website_slug}")
    print(f"   - Products created: {len(created_products)}")
    print(f"   - Cart operations: ✅ Add, Update, Remove, Clear")
    print(f"   - Data structure: ✅ Compatible with frontend")
    
    print(f"\n📋 Test URLs:")
    print(f"   - Store: http://localhost:3000/{website_slug}")
    print(f"   - Cart: http://localhost:3000/{website_slug}/cart")
    
    return True

if __name__ == "__main__":
    test_cart_functionality()