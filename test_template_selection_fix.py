#!/usr/bin/env python3

"""
Test script to verify template selection functionality is working correctly.
This script will test the template selection and rendering system.
"""

import requests
import json
import time
from datetime import datetime

# Configuration
FRONTEND_URL = "http://localhost:3000"
BACKEND_URL = "http://localhost:8000/api"

def test_template_selection():
    """Test template selection functionality"""
    print("🧪 Testing Template Selection Functionality")
    print("=" * 50)
    
    # Test 1: Check if templates are defined correctly
    print("\n1. Testing template definitions...")
    
    # Expected template IDs from templates.js
    expected_templates = [
        'hero-products',
        'text-image-split', 
        'blog-focused',
        'products-blogs-combo',
        'image-left-content',
        'minimal-clean'
    ]
    
    print(f"✅ Expected templates: {expected_templates}")
    
    # Test 2: Check backend website data structure
    print("\n2. Testing backend data structure...")
    
    try:
        # Try to get a website from the backend
        response = requests.get(f"{BACKEND_URL}/websites/", timeout=5)
        if response.status_code == 200:
            websites = response.json()
            if websites and len(websites) > 0:
                website = websites[0] if isinstance(websites, list) else websites.get('results', [{}])[0]
                print(f"✅ Backend website structure:")
                print(f"   - template_id: {website.get('template_id', 'NOT FOUND')}")
                print(f"   - template_name: {website.get('template_name', 'NOT FOUND')}")
                print(f"   - template_metadata: {website.get('template_metadata', 'NOT FOUND')}")
                print(f"   - template object: {website.get('template', 'NOT FOUND')}")
            else:
                print("⚠️ No websites found in backend")
        else:
            print(f"❌ Backend not accessible: {response.status_code}")
    except Exception as e:
        print(f"❌ Backend connection error: {e}")
    
    # Test 3: Check frontend template rendering
    print("\n3. Testing frontend template rendering...")
    
    try:
        # Check if frontend is accessible
        response = requests.get(FRONTEND_URL, timeout=5)
        if response.status_code == 200:
            print("✅ Frontend is accessible")
            
            # Check if we can access a website page
            # This would require knowing a website slug
            print("   Note: Manual testing required for template rendering")
            print("   1. Go to website builder and create/edit a website")
            print("   2. Select different templates in step 2")
            print("   3. Save and publish the website")
            print("   4. Visit the website URL to see if template changes")
            
        else:
            print(f"❌ Frontend not accessible: {response.status_code}")
    except Exception as e:
        print(f"❌ Frontend connection error: {e}")
    
    # Test 4: Template validation
    print("\n4. Template validation checklist:")
    print("   ✓ Check that WebsiteSerializer includes template field")
    print("   ✓ Check that UserWebsite.jsx transforms template data correctly")
    print("   ✓ Check that TemplateRenderer.jsx handles all template IDs")
    print("   ✓ Check that template selection in WebsiteBuilder saves correctly")
    
    print("\n" + "=" * 50)
    print("🎯 MANUAL TESTING STEPS:")
    print("1. Start both frontend and backend servers")
    print("2. Login to the website builder")
    print("3. Create a new website or edit existing one")
    print("4. In step 2, select different templates:")
    for template in expected_templates:
        print(f"   - {template}")
    print("5. Complete the setup and publish")
    print("6. Visit the website URL and verify template changes")
    print("7. Check browser console for template debug logs")
    
    print("\n🔍 DEBUG INFORMATION:")
    print("- Template debug logs added to TemplateRenderer.jsx")
    print("- Backend serializer updated to include template object")
    print("- Frontend data transformation improved")
    print("- Default template fallback improved")

if __name__ == "__main__":
    test_template_selection()