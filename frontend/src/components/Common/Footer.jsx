import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-gray-200 text-center p-4">
      <p>© {new Date().getFullYear()} MJ App. All rights reserved.</p>
    </footer>
  );
};

export default Footer;
