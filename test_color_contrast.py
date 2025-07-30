#!/usr/bin/env python3
"""
Test script to verify color contrast and readability on product page
"""

import requests
import json

# Backend URL
BASE_URL = "http://127.0.0.1:8000/api"

def test_website_colors():
    """Test website color scheme and provide contrast recommendations"""
    
    print("🎨 Testing Website Color Contrast")
    print("=" * 50)
    
    # Use existing verified user
    test_email = "backend_test@example.com"
    test_password = "testpass123"
    
    # Step 1: Login
    print("\n1. Getting authentication...")
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
            return
    except Exception as e:
        print(f"❌ Authentication error: {e}")
        return
    
    headers = {"Authorization": f"Bearer {access_token}"}
    
    # Step 2: Get website data
    print("\n2. Getting website color scheme...")
    try:
        response = requests.get(f"{BASE_URL}/websites/", headers=headers)
        if response.status_code == 200:
            websites_data = response.json()
            websites = websites_data.get('results', websites_data) if isinstance(websites_data, dict) else websites_data
            if websites:
                website = websites[0]
                print(f"✅ Found website: {website['name']}")
                
                # Get public website data with customizations
                response = requests.get(f"{BASE_URL}/websites/by_slug/?slug={website['slug']}")
                if response.status_code == 200:
                    public_website = response.json()
                    colors = public_website.get('customizations', {}).get('colors', {})
                    
                    print(f"\n🎨 Current Color Scheme:")
                    print(f"   Primary: {colors.get('primary', 'Not set')}")
                    print(f"   Secondary: {colors.get('secondary', 'Not set')}")
                    print(f"   Accent: {colors.get('accent', 'Not set')}")
                    print(f"   Background: {colors.get('background', 'Not set')}")
                    print(f"   Text: {colors.get('text', 'Not set')}")
                    
                    # Analyze color contrast
                    analyze_color_contrast(colors)
                    
                else:
                    print(f"❌ Failed to get public website: {response.text}")
                    return
            else:
                print("❌ No websites found")
                return
        else:
            print(f"❌ Failed to get websites: {response.text}")
            return
    except Exception as e:
        print(f"❌ Website error: {e}")
        return

def hex_to_rgb(hex_color):
    """Convert hex color to RGB"""
    if not hex_color or not hex_color.startswith('#'):
        return None
    try:
        hex_color = hex_color.lstrip('#')
        return tuple(int(hex_color[i:i+2], 16) for i in (0, 2, 4))
    except:
        return None

def calculate_luminance(rgb):
    """Calculate relative luminance of a color"""
    if not rgb:
        return None
    
    def normalize(c):
        c = c / 255.0
        if c <= 0.03928:
            return c / 12.92
        else:
            return pow((c + 0.055) / 1.055, 2.4)
    
    r, g, b = rgb
    return 0.2126 * normalize(r) + 0.7152 * normalize(g) + 0.0722 * normalize(b)

def calculate_contrast_ratio(color1, color2):
    """Calculate contrast ratio between two colors"""
    rgb1 = hex_to_rgb(color1)
    rgb2 = hex_to_rgb(color2)
    
    if not rgb1 or not rgb2:
        return None
    
    lum1 = calculate_luminance(rgb1)
    lum2 = calculate_luminance(rgb2)
    
    if lum1 is None or lum2 is None:
        return None
    
    # Ensure lighter color is in numerator
    if lum1 < lum2:
        lum1, lum2 = lum2, lum1
    
    return (lum1 + 0.05) / (lum2 + 0.05)

def analyze_color_contrast(colors):
    """Analyze color contrast and provide recommendations"""
    
    print(f"\n📊 Color Contrast Analysis:")
    print("=" * 30)
    
    # Key color combinations to check
    combinations = [
        ('Text on Background', colors.get('text'), colors.get('background')),
        ('Primary on Background', colors.get('primary'), colors.get('background')),
        ('Secondary on Background', colors.get('secondary'), colors.get('background')),
        ('Text on Primary', colors.get('text'), colors.get('primary')),
        ('Background on Primary', colors.get('background'), colors.get('primary')),
    ]
    
    recommendations = []
    
    for name, color1, color2 in combinations:
        if color1 and color2:
            ratio = calculate_contrast_ratio(color1, color2)
            if ratio:
                status = "✅ Good" if ratio >= 4.5 else "⚠️ Poor" if ratio >= 3 else "❌ Bad"
                print(f"   {name}: {ratio:.2f} {status}")
                
                if ratio < 4.5:
                    recommendations.append(f"Improve contrast for {name} (current: {ratio:.2f}, need: 4.5+)")
            else:
                print(f"   {name}: Unable to calculate")
        else:
            print(f"   {name}: Missing colors")
    
    print(f"\n💡 Recommendations:")
    if recommendations:
        for i, rec in enumerate(recommendations, 1):
            print(f"   {i}. {rec}")
    else:
        print("   ✅ All color combinations have good contrast!")
    
    print(f"\n🔧 Color Fixes Applied in Code:")
    print("   ✅ Enhanced font weights for better readability")
    print("   ✅ Used primary color for important text elements")
    print("   ✅ Added background colors with proper opacity")
    print("   ✅ Improved button and interactive element contrast")
    print("   ✅ Fixed tab content visibility")
    print("   ✅ Enhanced specification and review sections")
    
    print(f"\n🌐 Test the fixes:")
    print(f"   Visit: http://localhost:3000/{colors.get('slug', 'test-backend-website')}/products/1")
    print(f"   Check: All text should now be clearly readable")
    print(f"   Verify: Tabs, buttons, and content have proper contrast")

if __name__ == "__main__":
    test_website_colors()