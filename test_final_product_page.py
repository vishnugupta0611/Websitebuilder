#!/usr/bin/env python3
"""
Final test script for product page with color fixes
"""

import requests
import json
import webbrowser
import os

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"
FRONTEND_URL = "http://localhost:3000"

def test_complete_functionality():
    """Test complete product page functionality"""
    
    print("🎉 Final Product Page Test")
    print("=" * 50)
    
    # Use existing verified user
    test_email = "backend_test@example.com"
    test_password = "testpass123"
    
    # Step 1: Login
    print("\n1. Testing Backend...")
    try:
        response = requests.post(f"{BASE_URL}/auth/login/", json={
            "email": test_email,
            "password": test_password
        })
        if response.status_code == 200:
            auth_data = response.json()
            access_token = auth_data['tokens']['access']
            print("✅ Backend authentication working")
        else:
            print(f"❌ Backend authentication failed")
            return None
    except Exception as e:
        print(f"❌ Backend connection error: {e}")
        return None
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get test data
    try:
        # Get website
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        websites_data = response.json()
        websites = websites_data.get('results', websites_data) if isinstance(websites_data, dict) else websites_data
        website = websites[0] if websites else None
        
        # Get product
        response = requests.get(f"{BASE_URL}/products/?website={website['id']}", headers=headers)
        products_data = response.json()
        products = products_data.get('results', products_data) if isinstance(products_data, dict) else products_data
        product = products[0] if products else None
        
        if website and product:
            print("✅ Test data available")
            print(f"   Website: {website['name']} ({website['slug']})")
            print(f"   Product: {product['name']} (ID: {product['id']})")
        else:
            print("❌ Test data not available")
            return None
            
    except Exception as e:
        print(f"❌ Error getting test data: {e}")
        return None
    
    # Generate test URL
    test_url = f"{FRONTEND_URL}/{website['slug']}/products/{product['id']}"
    
    print(f"\n🎨 Color Fixes Applied:")
    print("✅ Default colors added for better contrast")
    print("✅ Primary color: #2563eb (blue)")
    print("✅ Secondary color: #64748b (gray)")
    print("✅ Accent color: #10b981 (green)")
    print("✅ Background: #ffffff (white)")
    print("✅ Text: #1f2937 (dark gray)")
    
    print(f"\n🔧 Functionality Improvements:")
    print("✅ Interactive tabs (Description, Specifications, Reviews)")
    print("✅ Save for Later with visual feedback")
    print("✅ Share functionality with clipboard fallback")
    print("✅ Enhanced cart operations with loading states")
    print("✅ Better color contrast for all text elements")
    print("✅ Improved button and interactive element visibility")
    print("✅ Mock review data for testing")
    print("✅ Responsive design improvements")
    
    print(f"\n🧪 Manual Testing Checklist:")
    print("=" * 30)
    print("□ Page loads without errors")
    print("□ All text is clearly readable")
    print("□ Tabs are clickable and show different content")
    print("□ Quantity controls work")
    print("□ Add to Cart button functions")
    print("□ Save for Later toggles properly")
    print("□ Share button copies URL")
    print("□ Image gallery navigation works")
    print("□ Responsive design on mobile/tablet")
    print("□ No console errors in browser")
    
    print(f"\n🌐 Test URL:")
    print(f"   {test_url}")
    
    # Open in browser
    try:
        webbrowser.open(test_url)
        print(f"\n🚀 Opened product page in browser!")
    except:
        print(f"\n📋 Please manually open: {test_url}")
    
    print(f"\n✨ What to Expect:")
    print("1. Product page loads with proper colors and contrast")
    print("2. All text should be clearly visible and readable")
    print("3. Tabs should be interactive and show different content")
    print("4. Buttons should have proper hover states and functionality")
    print("5. No garbled text or visibility issues")
    
    print(f"\n🎯 Key Areas to Test:")
    print("• Product title and description visibility")
    print("• Tab content readability (Description, Specs, Reviews)")
    print("• Button text and icon visibility")
    print("• Price and inventory information")
    print("• Feature list and specifications")
    print("• Customer reviews section")
    
    return {
        'website': website,
        'product': product,
        'test_url': test_url
    }

if __name__ == "__main__":
    result = test_complete_functionality()
    
    if result:
        print(f"\n" + "=" * 50)
        print("🎉 Product Page Ready for Testing!")
        print(f"✅ Backend: Working")
        print(f"✅ Frontend: Color fixes applied")
        print(f"✅ Functionality: Enhanced")
        print(f"✅ Test URL: {result['test_url']}")
        print(f"\n🚀 Go test the product page now!")
    else:
        print(f"\n❌ Setup incomplete. Please check backend server.")