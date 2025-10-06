"use client";

import { useRouter } from "next/navigation";
// useRouter permite navegação programática entre páginas.
import { useState } from "react"; 
// useState cria uma variável reativa dentro do componente. 
// Ler: form, 
// Atualizar: setForm(novoValor) 
// Quando atualiza, a tela é re-renderizada automaticamente.

import Image from "next/image";
// Componente de imagem do Next.js, otimizado para performance.

import { useAuth } from "../../global-contexts/authcontext";



import { MapPin, DollarSign, Bed, Search, MessageCircle, Key, Twitter, Instagram, Facebook } from "lucide-react";

export default function Homepage() {
  return (
    <div className="min-h-screen bg-housing-appBg">
      {/* Header */}
      <header className="bg-white border-b border-housing-lightGray">
        <div className="max-w-7xl mx-auto px-5 md:px-10">
          <div className="flex items-center justify-between h-[72px]">
            {/* Logo placeholder - will be replaced with actual logo */}
            <div className="text-xl font-bold text-housing-navy">UFROOM</div>
            
            {/* Navigation */}
            <nav className="hidden md:flex items-center space-x-5">
              <a href="#" className="px-2.5 py-2 text-sm font-bold text-housing-navy hover:bg-gray-50 rounded-md">
                Find Housing
              </a>
              <a href="#" className="px-2.5 py-2 text-sm font-bold text-housing-navy hover:bg-gray-50 rounded-md">
                List Your Property
              </a>
              <a href="#" className="px-2.5 py-2 text-sm font-bold text-housing-navy hover:bg-gray-50 rounded-md">
                About Us
              </a>
              <a href="#" className="px-2.5 py-2 text-sm font-bold text-housing-navy hover:bg-gray-50 rounded-md">
                Contact
              </a>
            </nav>

            {/* Auth Buttons */}
            <div className="flex items-center gap-3">
              <button className="px-4 py-2.5 text-sm font-bold text-housing-navy border border-housing-lightGray rounded-xl hover:bg-gray-50">
                Login
              </button>
              <button className="px-4 py-2.5 text-sm font-bold text-white bg-housing-red border border-housing-red rounded-xl hover:bg-red-700">
                Sign Up
              </button>
            </div>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-housing-pink px-5 md:px-10 py-18">
        <div className="max-w-7xl mx-auto">
          <div className="py-18">
            <div className="mb-7">
              <h1 className="text-4xl md:text-5xl font-bold text-housing-navy mb-4 leading-tight">
                Your Perfect Student Home Awaits
              </h1>
              <p className="text-base font-bold text-housing-gray max-w-3xl">
                Browse verified housing near your campus. Simple search, transparent pricing, and trusted landlords.
              </p>
            </div>

            {/* Search Form */}
            <div className="bg-white rounded-3xl border border-housing-lightGray shadow-lg p-3.5">
              <div className="flex flex-col md:flex-row gap-3">
                {/* Location Input */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 p-3.5 border border-housing-lightGray rounded-xl bg-white">
                    <MapPin className="h-4.5 w-4.5 text-housing-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-housing-gray mb-1">Location</div>
                      <input 
                        type="text" 
                        placeholder="Enter location" 
                        className="w-full text-sm font-medium text-housing-navy placeholder-housing-gray bg-transparent border-0 p-0 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>

                {/* Price Range */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 p-3.5 border border-housing-lightGray rounded-xl bg-white">
                    <DollarSign className="h-4.5 w-4.5 text-housing-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-housing-gray mb-1">Price Range</div>
                      <div className="text-sm font-bold text-housing-navy">$500 - $1,500</div>
                    </div>
                  </div>
                </div>

                {/* Bedrooms */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2.5 p-3.5 border border-housing-lightGray rounded-xl bg-white">
                    <Bed className="h-4.5 w-4.5 text-housing-gray flex-shrink-0" />
                    <div className="flex-1 min-w-0">
                      <div className="text-xs font-bold text-housing-gray mb-1">Bedrooms</div>
                      <div className="text-sm font-bold text-housing-navy">Studio, 1, 2+</div>
                    </div>
                  </div>
                </div>

                {/* Search Button */}
                <button className="flex items-center justify-center gap-2 px-5 py-3 bg-housing-red border border-housing-blue rounded-xl text-white font-bold text-sm hover:bg-red-700 transition-colors min-w-[145px]">
                  <Search className="h-4.5 w-4.5" />
                  Search Now
                </button>
              </div>
            </div>

            {/* Popular Searches */}
            <div className="mt-1.5">
              <p className="text-sm font-bold text-housing-gray">
                Popular near you: Downtown • University District • West End
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Listings */}
      <section className="px-5 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="px-6">
            <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-5">
              <div>
                <h2 className="text-2xl font-bold text-housing-navy mb-1">Featured Listings</h2>
                <p className="text-sm font-bold text-housing-gray">Handpicked homes students love right now</p>
              </div>
              <button className="mt-4 md:mt-0 px-4 py-2.5 bg-white border border-housing-lightGray rounded-xl text-sm font-bold text-housing-navy hover:bg-gray-50">
                View All
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {/* Listing 1 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray overflow-hidden">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/7798cfee02a935b0a0856e531124d94354c55fc9?width=689" 
                  alt="Property" 
                  className="w-full h-42 object-cover"
                />
                <div className="p-3.5">
                  <div className="mb-2">
                    <div className="text-base font-bold text-housing-navy mb-1">$1,200/mo</div>
                    <div className="flex items-start gap-2.5 text-xs font-bold text-housing-gray mb-2">
                      <span>2 Bed</span>
                      <span>0.4 mi to Campus</span>
                      <span>Wi‑Fi Included</span>
                    </div>
                    <p className="text-sm font-bold text-housing-navy">
                      Bright 2-bedroom near University District with in-unit laundry and balcony.
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="px-2.5 py-1.5 bg-housing-lightBlue text-housing-darkBlue text-xs font-bold rounded-full">
                      New
                    </span>
                    <button className="px-4 py-2.5 bg-housing-red text-white text-sm font-bold rounded-xl hover:bg-red-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Listing 2 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray overflow-hidden">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/2683a7a01a3a171c305b3abafb9b5e2deaf40dd8?width=689" 
                  alt="Property" 
                  className="w-full h-42 object-cover"
                />
                <div className="p-3.5">
                  <div className="mb-2">
                    <div className="text-base font-bold text-housing-navy mb-1">$890/mo</div>
                    <div className="flex items-start gap-2.5 text-xs font-bold text-housing-gray mb-2">
                      <span>Studio</span>
                      <span>Near Transit</span>
                      <span>Furnished</span>
                    </div>
                    <p className="text-sm font-bold text-housing-navy">
                      Cozy studio perfect for first-year students. Quiet building with study lounge.
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="px-2.5 py-1.5 bg-housing-lightBlue text-housing-darkBlue text-xs font-bold rounded-full">
                      Popular
                    </span>
                    <button className="px-4 py-2.5 bg-housing-red text-white text-sm font-bold rounded-xl hover:bg-red-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>

              {/* Listing 3 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray overflow-hidden">
                <img 
                  src="https://api.builder.io/api/v1/image/assets/TEMP/30493cdd510e57f6f1f34b82ad36c2013bb529fe?width=689" 
                  alt="Property" 
                  className="w-full h-42 object-cover"
                />
                <div className="p-3.5">
                  <div className="mb-2">
                    <div className="text-base font-bold text-housing-navy mb-1">$650/mo</div>
                    <div className="flex items-start gap-2.5 text-xs font-bold text-housing-gray mb-2">
                      <span>Room in 4BR</span>
                      <span>Utilities Split</span>
                      <span>Backyard</span>
                    </div>
                    <p className="text-sm font-bold text-housing-navy">
                      Spacious room in shared house with friendly roommates and big kitchen.
                    </p>
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <span className="px-2.5 py-1.5 bg-housing-lightBlue text-housing-darkBlue text-xs font-bold rounded-full">
                      Verified
                    </span>
                    <button className="px-4 py-2.5 bg-housing-red text-white text-sm font-bold rounded-xl hover:bg-red-700">
                      View Details
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-housing-lightPink px-5 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="px-6">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-housing-navy mb-1">How It Works</h2>
              <p className="text-sm font-bold text-housing-gray">Three simple steps to your next home</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Step 1 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray p-4.5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Search className="h-6 w-6 text-housing-navy" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-housing-navy mb-1.5">Search</h3>
                    <p className="text-sm font-bold text-housing-gray leading-relaxed">
                      Filter by location, price, and bedrooms to find the perfect fit.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 2 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray p-4.5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <MessageCircle className="h-6 w-6 text-housing-navy" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-housing-navy mb-1.5">Connect</h3>
                    <p className="text-sm font-bold text-housing-gray leading-relaxed">
                      Message verified landlords and schedule tours safely.
                    </p>
                  </div>
                </div>
              </div>

              {/* Step 3 */}
              <div className="bg-white rounded-3xl border border-housing-lightGray p-4.5">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0">
                    <Key className="h-6 w-6 text-housing-navy" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-housing-navy mb-1.5">Move In</h3>
                    <p className="text-sm font-bold text-housing-gray leading-relaxed">
                      Sign, pay, and settle in with confidence.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Students Say */}
      <section className="bg-white px-5 md:px-10 py-14">
        <div className="max-w-7xl mx-auto">
          <div className="px-6">
            <div className="mb-5">
              <h2 className="text-2xl font-bold text-housing-navy mb-1">What Students Say</h2>
              <p className="text-sm font-bold text-housing-gray">Real experiences from our community</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Testimonial 1 */}
              <div className="bg-housing-lightPink rounded-3xl border border-housing-lightGray p-4.5">
                <p className="text-sm font-bold text-housing-navy mb-3">
                  "Found a place in 2 days near campus. The pricing was transparent and the landlord was great."
                </p>
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/fdcbc40479cd2295cf477ae7d36a6133e02c1b6b?width=72" 
                    alt="Alex Johnson" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-housing-navy">Alex Johnson</div>
                    <div className="text-xs font-bold text-housing-gray">Sophomore • Economics</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 2 */}
              <div className="bg-housing-lightPink rounded-3xl border border-housing-lightPink p-4.5">
                <p className="text-sm font-bold text-housing-navy mb-3">
                  "Loved the search filters and verified listings. Felt safe and supported throughout."
                </p>
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/c384a6925f007e48116e42ca160a73ac265ff18f?width=72" 
                    alt="Maya Patel" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-housing-navy">Maya Patel</div>
                    <div className="text-xs font-bold text-housing-gray">Graduate • Computer Science</div>
                  </div>
                </div>
              </div>

              {/* Testimonial 3 */}
              <div className="bg-housing-lightPink rounded-3xl border border-housing-lightGray p-4.5">
                <p className="text-sm font-bold text-housing-navy mb-3">
                  "We found a 3-bedroom for our group. Split rent and utilities easily."
                </p>
                <div className="flex items-center gap-2.5">
                  <img 
                    src="https://api.builder.io/api/v1/image/assets/TEMP/e9a74cb846e56febd9aae00c4bf21100c6aaf4cf?width=72" 
                    alt="Diego Ramirez" 
                    className="w-9 h-9 rounded-full object-cover"
                  />
                  <div>
                    <div className="text-sm font-bold text-housing-navy">Diego Ramirez</div>
                    <div className="text-xs font-bold text-housing-gray">Junior • Biology</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-white border-t border-housing-lightGray">
        <div className="max-w-7xl mx-auto px-5 md:px-10 py-8">
          <div className="flex flex-col md:flex-row justify-between items-start gap-8">
            {/* Logo and Social */}
            <div className="flex flex-col items-start">
              <div className="text-xl font-bold text-housing-navy mb-4">UFROOM</div>
              <div className="flex items-center gap-2.5">
                <Twitter className="h-5 w-5 text-housing-navy" />
                <Instagram className="h-5 w-5 text-housing-navy" />
                <Facebook className="h-5 w-5 text-housing-navy" />
              </div>
            </div>

            {/* Footer Links */}
            <div className="grid grid-cols-2 md:grid-cols-2 gap-8 flex-1 max-w-md">
              <div className="space-y-2.5">
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">Privacy Policy</a>
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">Terms of Service</a>
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">Contact</a>
              </div>
              <div className="space-y-2.5">
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">Help Center</a>
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">Careers</a>
                <a href="#" className="block text-sm font-bold text-housing-navy hover:text-housing-gray">For Landlords</a>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
