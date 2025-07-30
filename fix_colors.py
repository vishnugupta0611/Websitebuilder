#!/usr/bin/env python3
"""
Script to fix all color references in UserProductDetail.jsx
"""

import re

def fix_color_references():
    """Fix all website.customizations.colors references to use colors object"""
    
    file_path = "src/pages/UserProductDetail.jsx"
    
    try:
        with open(file_path, 'r', encoding='utf-8') as f:
            content = f.read()
        
        # Replace all color references
        replacements = [
            ('website.customizations.colors.primary', 'colors.primary'),
            ('website.customizations.colors.secondary', 'colors.secondary'),
            ('website.customizations.colors.accent', 'colors.accent'),
            ('website.customizations.colors.background', 'colors.background'),
            ('website.customizations.colors.text', 'colors.text'),
        ]
        
        for old, new in replacements:
            content = content.replace(old, new)
        
        # Also fix typography references
        content = content.replace(
            'website.customizations.typography.headingFont',
            "website.customizations?.typography?.headingFont || 'Inter, system-ui, sans-serif'"
        )
        content = content.replace(
            'website.customizations.typography.bodyFont',
            "website.customizations?.typography?.bodyFont || 'Inter, system-ui, sans-serif'"
        )
        
        with open(file_path, 'w', encoding='utf-8') as f:
            f.write(content)
        
        print("✅ Successfully fixed all color references!")
        print("🎨 All website.customizations.colors.* replaced with colors.*")
        print("📝 Typography references also fixed with fallbacks")
        
    except Exception as e:
        print(f"❌ Error fixing colors: {e}")

if __name__ == "__main__":
    fix_color_references()