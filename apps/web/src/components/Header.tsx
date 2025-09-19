'use client';

import Link from 'next/link';
import Image from "next/image";
import { useAuth } from "../global-contexts/authcontext";

export default function Header() {
  const navLinks = [
    { name: 'Pagina Inicial', href: '/home' },
    { name: 'Anuncie sua propriedade', href: '/login' },
    { name: 'Regras', href: '/rules' },
    { name: 'Contatos', href: '/contact' },
    
  ];

  const { user, token, logout } = useAuth();


  return (
    <header className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
  <div className="flex justify-between items-center h-16" style={{marginLeft: '-50px'}}>
          
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

          {/* User/Buttons */}
          <div className="flex items-center space-x-4">
            {user ? (
              <>
                <span className="font-semibold text-gray-700">Olá, {user.name?.split(" ")[0]}</span>
                <Link
                  href="/me"
                  className="flex items-center px-3 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                  title="Perfil"
                >
                  {/* Ícone de perfil (SVG) */}
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.5 20.25a8.25 8.25 0 1115 0v.75a.75.75 0 01-.75.75h-13.5a.75.75 0 01-.75-.75v-.75z" />
                  </svg>
                  Perfil
                </Link>
                <button
                  onClick={logout}
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Sair
                </button>
              </>
            ) : (
              <>
                <Link
                  href="/login"
                  className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Entrar
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Cadastrar-se
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
