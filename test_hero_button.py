#!/usr/bin/env python3

import requests
import json

# Test script to check hero button text functionality

def test_hero_button_text():
    """Test if hero button text is properly saved and retrieved"""
    
    base_url = "http://localhost:8000/api"
    
    # Test data
    test_website_data = {
        "name": "Test Hero Button Site",
        "slug": "test-hero-button-site",
        "description": "Testing hero button text functionality",
        "category": "business",
        "template_id": "products-blogs-combo",
        "template_name": "Products & Blogs Combo",
        "heroTitle": "Welcome to Our Test Site",
        "heroDescription": "This is a test description",
        "heroButtonText": "Click Me Now!",  # This should appear on the site
        "productSectionTitle": "Our Products",
        "blogSectionTitle": "Latest News",
        "customizations": {
            "colors": {
                "primary": "#3b82f6",
                "secondary": "#64748b",
                "text": "#1f2937"
            },
            "typography": {
                "headingFont": "Inter",
                "bodyFont": "Inter"
            }
        }
    }
    
    print("🧪 Testing Hero Button Text Functionality")
    print("=" * 50)
    
    # First, let's check if we can retrieve an existing website
    print("\n1. Checking existing websites...")
    try:
        response = requests.get(f"{base_url}/websites/by_slug/?slug=newsite")
        if response.status_code == 200:
            website_data = response.json()
            print(f"✅ Found existing website: {website_data.get('name')}")
            print(f"   Hero Title: {website_data.get('heroTitle')}")
            print(f"   Hero Description: {website_data.get('heroDescription')}")
            print(f"   Hero Button Text: {website_data.get('heroButtonText')}")
            print(f"   Template ID: {website_data.get('template_id')}")
            
            # Check if heroButtonText is empty or missing
            if not website_data.get('heroButtonText'):
                print("❌ ISSUE FOUND: heroButtonText is empty or missing!")
                print("   This explains why the button text is not showing on the frontend.")
            else:
                print("✅ heroButtonText is present in the data")
                
        else:
            print(f"❌ Could not retrieve website: {response.status_code}")
            print(f"   Response: {response.text}")
            
    except Exception as e:
        print(f"❌ Error retrieving website: {e}")
    
    print("\n" + "=" * 50)
    print("🔍 DIAGNOSIS:")
    print("If heroButtonText is missing from the backend data,")
    print("the issue is in the website creation/update process.")
    print("If heroButtonText is present but not showing on frontend,")
    print("the issue is in the TemplateRenderer component.")

if __name__ == "__main__":
    test_hero_button_text()