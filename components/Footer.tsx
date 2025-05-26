import React from "react";
import { FiMail, FiTwitter, FiGithub, FiInstagram } from "react-icons/fi";

const Footer = () => {
  return (
    <footer className="bg-[#0a0a0a] mt-20 border-t-2">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Get Latest Updates
            </h3>
            <p className="text-gray-600 dark:text-gray-300">
              Subscribe to our newsletter for the latest news and updates.
            </p>
            <div className="flex">
              <input
                type="email"
                placeholder="Your email"
                className="px-4 py-2 w-full rounded-l-lg border border-r-0 border-gray-300 dark:border-gray-600 dark:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-pink-500"
              />
              <button className="bg-pink-600 hover:bg-pink-700 text-white px-4 py-2 rounded-r-lg transition-colors">
                Subscribe
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Quick Links
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="/about"
                  className="hover:text-pink-600 transition-colors"
                >
                  About Us
                </a>
              </li>
              <li>
                <a
                  href="/blog"
                  className="hover:text-pink-600 transition-colors"
                >
                  Blog
                </a>
              </li>
              <li>
                <a
                  href="/contact"
                  className="hover:text-pink-600 transition-colors"
                >
                  Contact
                </a>
              </li>
              <li>
                <a
                  href="/privacy"
                  className="hover:text-pink-600 transition-colors"
                >
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Support & Social */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white">
              Support
            </h3>
            <ul className="space-y-2 text-gray-600 dark:text-gray-300">
              <li>
                <a
                  href="/faq"
                  className="hover:text-pink-600 transition-colors"
                >
                  FAQ
                </a>
              </li>
              <li>
                <a
                  href="/support"
                  className="hover:text-pink-600 transition-colors"
                >
                  Help Center
                </a>
              </li>
              <li>
                <a
                  href="/terms"
                  className="hover:text-pink-600 transition-colors"
                >
                  Terms of Service
                </a>
              </li>
            </ul>

            <div className="pt-4">
              <h4 className="text-gray-800 dark:text-white mb-2">Follow Us</h4>
              <div className="flex space-x-4">
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-500"
                >
                  <FiTwitter size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-500"
                >
                  <FiInstagram size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-500"
                >
                  <FiGithub size={20} />
                </a>
                <a
                  href="#"
                  className="text-gray-600 hover:text-pink-600 dark:text-gray-300 dark:hover:text-pink-500"
                >
                  <FiMail size={20} />
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div className="border-t border-gray-200 dark:border-gray-700 mt-8 pt-8 text-center text-gray-600 dark:text-gray-300">
          <p>
            © {new Date().getFullYear()} My Next.js App. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
