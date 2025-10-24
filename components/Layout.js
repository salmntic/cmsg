import React from 'react';
import Link from 'next/link';

// Simple inline styles for a dark-themed layout
const layoutStyles = {
  backgroundColor: '#111', 
  minHeight: '100vh',
  color: '#fff',
};

const headerStyles = {
  backgroundColor: '#000',
  padding: '15px 30px',
  borderBottom: '1px solid #333',
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const navStyles = {
  display: 'flex',
  gap: '20px',
};

const linkStyles = {
  color: '#8be9fd', // A neon/highlight color
  textDecoration: 'none',
  fontWeight: '600',
};

const mainContentStyles = {
  padding: '30px',
};

const Layout = ({ children }) => {
  return (
    <div style={layoutStyles}>
      <header style={headerStyles}>
        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fff' }}>
          CMS Dashboard
        </div>
        <nav style={navStyles}>
          <Link href="/" style={linkStyles}>
            Dashboard
          </Link>
          <Link href="/products" style={linkStyles}>
            Products
          </Link>
          <Link href="/categories" style={linkStyles}>
            Categories
          </Link>
          <Link href="/hero" style={linkStyles}>
            Hero Images
          </Link>
        </nav>
      </header>
      <main style={mainContentStyles}>
        {children}
      </main>
    </div>
  );
};

export default Layout;