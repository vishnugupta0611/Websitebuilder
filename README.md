# Corporate Portal Frontend

A modern, comprehensive React.js-based web application that provides public-facing functionality for the Corporate Management Portal system. This frontend application focuses on content management, e-commerce, search, and customer-facing interactions with a professional, customizable interface.

## 🚀 Features

### Content Management
- **WYSIWYG Editor**: Intuitive browser-based content editing with drag-and-drop capabilities
- **Template System**: Pre-built professional templates for blogs, products, and pages
- **Style Customization**: Complete control over colors, fonts, layouts, and design elements
- **Multi-Content Types**: Support for pages, articles, blogs, news, job openings, and office locations
- **Real-time Preview**: Live preview functionality with instant style updates

### E-commerce
- **Product Catalog**: Full-featured product browsing with filtering and sorting
- **Shopping Cart**: Persistent cart with quantity management and discount support
- **Secure Checkout**: Multi-step checkout process with payment integration
- **Order Management**: Complete order tracking and history
- **Inventory Management**: Real-time stock tracking and variant support

### Search & Discovery
- **Advanced Search**: Full-text search across all content and documents
- **Smart Filtering**: Filter by content type, date range, and custom fields
- **Search Suggestions**: Auto-complete and related search recommendations
- **Popular Searches**: Trending search terms and analytics

### User Experience
- **Responsive Design**: Mobile-first design with Tailwind CSS
- **Smooth Animations**: GSAP-powered animations for professional interactions
- **Accessibility**: WCAG 2.1 AA compliant with keyboard navigation and screen reader support
- **Performance Optimized**: Code splitting, lazy loading, and optimized bundles

## 🛠 Technology Stack

- **Frontend Framework**: React 18+ with JavaScript
- **Styling**: Tailwind CSS with custom design system
- **Animations**: GSAP (GreenSock Animation Platform)
- **Routing**: React Router v6
- **Form Management**: React Hook Form
- **State Management**: React Context + useReducer
- **Build Tool**: Vite for fast development and optimized builds
- **Icons**: Lucide React

## 📁 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── ui/              # Basic UI components (Button, Input, Modal, etc.)
│   └── layout/          # Layout components (Header, Footer, Navigation)
├── pages/               # Page components
│   ├── Home.jsx         # Landing page
│   ├── ProductCatalog.jsx
│   ├── ProductDetail.jsx
│   ├── Cart.jsx
│   ├── Checkout.jsx
│   ├── ContentEditor.jsx
│   ├── Search.jsx
│   ├── CustomerProfile.jsx
│   └── OrderTracking.jsx
├── contexts/            # React contexts for state management
│   └── AppContext.jsx   # Main application context
├── services/            # API service layer
│   ├── api.js           # Base API service
│   ├── contentService.js
│   ├── ecommerceService.js
│   └── searchService.js
├── hooks/               # Custom React hooks
│   ├── useLocalStorage.js
│   ├── useDebounce.js
│   └── useApi.js
├── utils/               # Utility functions
│   ├── animations.js    # GSAP animation helpers
│   └── helpers.js       # General utility functions
├── App.jsx              # Main app component
├── main.jsx             # Application entry point
└── index.css            # Global styles and Tailwind imports
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd corporate-portal-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:3000`

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run test` - Run tests
- `npm run lint` - Run ESLint

## 🎨 Customization

### Theme Configuration
The application uses a custom design system built on Tailwind CSS. You can customize colors, fonts, and spacing in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      primary: {
        50: '#eff6ff',
        500: '#3b82f6',
        600: '#2563eb',
        700: '#1d4ed8',
      }
    }
  }
}
```

### Animation System
The application includes a comprehensive animation system using GSAP. You can create custom animations using the `AnimationManager`:

```javascript
import { animationManager } from './utils/animations'

// Fade in animation
animationManager.fadeIn('.my-element', 0.5)

// Stagger animation for lists
animationManager.staggerIn('.list-item', 0.4, 0.1)
```

## 🔧 Configuration

### Environment Variables
Create a `.env` file in the root directory:

```env
VITE_API_BASE_URL=http://localhost:5000/api
VITE_APP_NAME=Corporate Portal
```

### API Integration
The application is designed to work with a backend API. Update the service files in `src/services/` to integrate with your actual API endpoints.

## 📱 Features Overview

### Content Editor
- Rich text editing with formatting tools
- Template selection and customization
- Real-time preview mode
- Style customization panel
- Page settings and metadata management

### Product Catalog
- Grid and list view modes
- Advanced filtering and sorting
- Product variants and inventory tracking
- Add to cart functionality
- Product detail pages with image galleries

### Shopping Cart & Checkout
- Persistent cart across sessions
- Quantity management
- Coupon code support
- Multi-step checkout process
- Payment integration ready

### Search Functionality
- Full-text search across all content
- Advanced filtering options
- Search suggestions and auto-complete
- Popular searches tracking
- Result ranking and snippets

### User Account Management
- Customer profile management
- Order history and tracking
- Address book management
- Payment method storage
- Account settings and preferences

## 🎯 Performance Features

- **Code Splitting**: Automatic route-based code splitting
- **Lazy Loading**: Components loaded on demand
- **Image Optimization**: Responsive images with proper sizing
- **Caching**: Local storage for cart and user preferences
- **Bundle Optimization**: Tree shaking and minification

## ♿ Accessibility

- **Keyboard Navigation**: Full keyboard accessibility
- **Screen Reader Support**: Proper ARIA labels and semantic HTML
- **Color Contrast**: WCAG AA compliant color schemes
- **Focus Management**: Proper focus handling for modals and navigation
- **Reduced Motion**: Respects user's motion preferences

## 🔒 Security Considerations

- **Input Sanitization**: All user inputs are properly sanitized
- **XSS Prevention**: Content security policies implemented
- **Secure API Communication**: HTTPS enforcement
- **Authentication Ready**: JWT token management structure

## 🚀 Deployment

### Build for Production
```bash
npm run build
```

The build artifacts will be stored in the `dist/` directory.

### Deployment Options
- **Vercel**: Connect your repository for automatic deployments
- **Netlify**: Drag and drop the `dist` folder
- **AWS S3**: Upload build files to S3 bucket
- **Docker**: Use the included Dockerfile for containerization

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the documentation
- Review the code comments for implementation details

## 🔮 Future Enhancements

- **Multi-language Support**: Internationalization (i18n)
- **Progressive Web App**: PWA capabilities
- **Advanced Analytics**: User behavior tracking
- **AI-Powered Search**: Enhanced search with machine learning
- **Real-time Notifications**: WebSocket integration
- **Advanced Customization**: Visual page builder

---

Built with ❤️ using React, Tailwind CSS, and GSAP