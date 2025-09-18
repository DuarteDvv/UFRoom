'use client';

import Link from 'next/link';
import Image from "next/image";

export default function Header() {
  const navLinks = [
    { name: 'Rent', href: '/rent' },
    { name: 'Rooms', href: '/rooms' },
    { name: 'Advertise', href: '/advertise' },
    { name: 'Help', href: '/help' },
  ];

  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          
          {/* Logo */}
          <div className="flex-shrink-0">
            <Image src="/logo.png" alt="Logo" width={120} height={120} />
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex space-x-8">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-gray-700 hover:text-gray-900 font-medium"
              >
                {link.name}
              </Link>
            ))}
          </nav>

          {/* Buttons */}
          <div className="flex items-center space-x-4">
            <Link
              href="/login"
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
            >
              Login
            </Link>
            <Link
              href="/signup"
              className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
            >
              Sign up
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
