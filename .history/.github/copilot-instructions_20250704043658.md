<!-- Use this file to provide workspace-specific custom instructions to Copilot. For more details, visit https://code.visualstudio.com/docs/copilot/copilot-customization#_use-a-githubcopilotinstructionsmd-file -->

# YourDollarsOnline E-commerce Platform

This is a comprehensive e-commerce platform built with Next.js, focusing on:

## Key Features
- **Admin Management**: Super admin system with admin user management
- **Product Management**: Add, edit, and manage products with SEO optimization
- **Order Management**: Complete order processing and tracking system
- **Payment Integration**: Custom PayPal integration without redirects
- **SEO Optimization**: Automatic SEO for all products and pages
- **Modern UI**: Beautiful, responsive design with Tailwind CSS

## Technology Stack
- **Framework**: Next.js 15 with App Router
- **Database**: Redis for fast data storage
- **Styling**: Tailwind CSS for modern, responsive design
- **Authentication**: Custom admin authentication system
- **Payment**: PayPal integration with custom UI

## Code Style
- Use JavaScript primarily (98%) with minimal TypeScript (2%)
- Follow Next.js App Router patterns
- Implement responsive design with Tailwind CSS
- Use modern ES6+ features and React hooks
- Prioritize performance and SEO optimization

## Database Schema
- Products: id, name, description, price, images, categories, SEO metadata
- Orders: id, customer info, products, payment status, tracking
- Admins: id, username, email, role, permissions
- Categories: id, name, description, SEO metadata

## Security
- Secure admin authentication
- Input validation and sanitization
- HTTPS enforcement
- Environment variable protection
