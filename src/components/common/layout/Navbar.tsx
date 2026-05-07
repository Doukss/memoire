export default function Navbar() {
  return (
    <nav className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-lg bg-gradient-to-br from-indigo-500 to-indigo-700 flex items-center justify-center">
              <span className="text-white font-bold text-sm">K</span>
            </div>
            <span className="text-xl font-bold text-gray-900">KerManager</span>
          </div>

          {/* Navigation links - desktop */}
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Fonctionnalités
            </a>
            <a href="#pricing" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Tarifs
            </a>
            <a href="#about" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              À propos
            </a>
            <a href="#contact" className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors">
              Contact
            </a>
          </div>

          {/* Auth buttons */}
          <div className="flex items-center gap-4">
            <a
              href="/login"
              className="text-sm font-medium text-gray-600 hover:text-indigo-600 transition-colors"
            >
              Connexion
            </a>
            <a
              href="/register"
              className="rounded-lg bg-indigo-600 px-4 py-2 text-sm font-semibold text-white hover:bg-indigo-700 transition-colors"
            >
              S'inscrire
            </a>
          </div>
        </div>
      </div>
    </nav>
  );
}
