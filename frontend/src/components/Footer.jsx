import React from 'react'
import { Facebook, Twitter, Youtube, Instagram } from "lucide-react";
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-10">
      
      {/* Top Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 lg:py-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-12 w-full">
        
        {/* Brand */}
        <div>
          <h2 className="text-xl font-bold text-white mb-3">
            Aaj Ka Mudda
          </h2>
          <p className="text-sm leading-relaxed">
            भारत और दुनिया की ताज़ा खबरें, वीडियो, और विश्लेषण —
            सबसे पहले, सबसे भरोसेमंद।
          </p>
        </div>

        {/* News Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            न्यूज़
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/category/देश" className="hover:text-orange-500 cursor-pointer">देश</Link></li>
            <li><Link to="/category/विदेश" className="hover:text-orange-500 cursor-pointer">विदेश</Link></li>
            <li><Link to="/category/राज्य" className="hover:text-orange-500 cursor-pointer">राज्य</Link></li>
            <li><Link to="/category/शहर" className="hover:text-orange-500 cursor-pointer">शहर</Link></li>
            <li><Link to="/category/क्रिकेट" className="hover:text-orange-500 cursor-pointer">क्रिकेट</Link></li>
          </ul>
        </div>

        {/* Useful Links */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            उपयोगी लिंक
          </h3>
          <ul className="space-y-2 text-sm">
            <li><Link to="/about" className="hover:text-orange-500 cursor-pointer">About Us</Link></li>
            <li><Link to="/contact" className="hover:text-orange-500 cursor-pointer">Contact</Link></li>
            <li><Link to="/privacy" className="hover:text-orange-500 cursor-pointer">Privacy Policy</Link></li>
            <li><Link to="/terms" className="hover:text-orange-500 cursor-pointer">Terms & Conditions</Link></li>
          </ul>
        </div>

        {/* Social */}
        <div>
          <h3 className="text-sm font-semibold text-white mb-3">
            Follow Us
          </h3>
          <div className="flex gap-4">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors">
              <Facebook className="cursor-pointer" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors">
              <Twitter className="cursor-pointer" />
            </a>
            <a href="https://youtube.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors">
              <Youtube className="cursor-pointer" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="text-white hover:text-orange-500 transition-colors">
              <Instagram className="cursor-pointer" />
            </a>
          </div>
        </div>

      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-5 flex flex-col md:flex-row justify-between items-center gap-3 text-sm text-gray-400">
          <p className="text-center md:text-left">© {new Date().getFullYear()} Aaj Ka Mudda. All rights reserved.</p>
          <div className="flex flex-wrap justify-center gap-4 sm:gap-6">
            <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
            <Link to="/privacy" className="hover:text-white transition-colors">Privacy</Link>
            <Link to="/terms" className="hover:text-white transition-colors">Terms</Link>
          </div>
        </div>
      </div>

    </footer>
  )
}

export default Footer
