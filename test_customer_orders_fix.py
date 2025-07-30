#!/usr/bin/env python3

import requests
import json

def test_customer_orders_endpoint():
    """Test the new customer orders endpoint"""
    
    base_url = "http://localhost:8000/api"
    
    print("🧪 Testing Customer Orders Endpoint")
    print("=" * 50)
    
    # Test the customer orders endpoint
    test_email = "customer@example.com"  # Replace with actual customer email
    test_website_slug = "newsite"
    
    try:
        # Test the new customer orders endpoint
        response = requests.get(
            f"{base_url}/orders/customer_orders/",
            params={
                'email': test_email,
                'website_slug': test_website_slug
            }
        )
        
        print(f"📡 Testing endpoint: /orders/customer_orders/")
        print(f"   Email: {test_email}")
        print(f"   Website Slug: {test_website_slug}")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 200:
            orders = response.json()
            print(f"✅ Endpoint working! Found {len(orders)} orders")
            
            if orders:
                print("\n📦 Sample Order Data:")
                sample_order = orders[0]
                print(f"   Order ID: {sample_order.get('id')}")
                print(f"   Customer: {sample_order.get('customerName')}")
                print(f"   Email: {sample_order.get('customerEmail')}")
                print(f"   Total: ${sample_order.get('total')}")
                print(f"   Status: {sample_order.get('status')}")
                print(f"   Items: {len(sample_order.get('items', []))}")
                print(f"   Created: {sample_order.get('createdAt')}")
            else:
                print("📝 No orders found for this customer/website combination")
                
        else:
            print(f"❌ Endpoint failed: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error testing endpoint: {e}")
    
    print("\n" + "=" * 50)
    print("🔍 TESTING SUMMARY:")
    print("1. Added customer_orders endpoint to OrderViewSet")
    print("2. Updated orderService.getCustomerOrders() method")
    print("3. Modified CustomerOrders component to use real data")
    print("4. Fixed order item display to handle real data structure")
    
    print("\n💡 NEXT STEPS:")
    print("- Create some test orders to verify the functionality")
    print("- Test the frontend customer orders page")
    print("- Verify order data displays correctly")

def create_test_order():
    """Create a test order for testing purposes"""
    
    base_url = "http://localhost:8000/api"
    
    test_order_data = {
        "websiteSlug": "newsite",
        "websiteName": "new site",
        "customerName": "Test Customer",
        "customerEmail": "customer@example.com",
        "customerPhone": "123-456-7890",
        "customerAddress": "123 Test Street",
        "customerCity": "Test City",
        "customerZipCode": "12345",
        "items": [
            {
                "product_name": "Test Product 1",
                "product_price": 29.99,
                "quantity": 2,
                "product_id": "test-product-1"
            },
            {
                "product_name": "Test Product 2", 
                "product_price": 49.99,
                "quantity": 1,
                "product_id": "test-product-2"
            }
        ]
    }
    
    try:
        response = requests.post(
            f"{base_url}/orders/create_order/",
            json=test_order_data,
            headers={'Content-Type': 'application/json'}
        )
        
        print(f"\n🛒 Creating Test Order...")
        print(f"   Status Code: {response.status_code}")
        
        if response.status_code == 201:
            order = response.json()
            print(f"✅ Test order created successfully!")
            print(f"   Order ID: {order.get('id')}")
            print(f"   Total: ${order.get('total')}")
        else:
            print(f"❌ Failed to create test order: {response.text}")
            
    except Exception as e:
        print(f"❌ Error creating test order: {e}")

if __name__ == "__main__":
    test_customer_orders_endpoint()
    create_test_order()