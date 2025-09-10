import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const navItems = [
    { name: 'Beranda', path: '/' },
    { name: 'Domain', path: '/add-domain' },
    { name: 'Endpoint', path: '/add-endpoint' },
    { name: 'RestAPI', path: '/add-restapi' },
  ];

  return (
    <nav className="bg-blue-900 text-white shadow-md fixed top-0 left-0 w-full z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16 items-center">
          {/* Logo */}
          <Link to="/" className="text-xl font-bold text-white">
            DocAPIku
          </Link>

          {/* Desktop Menu */}
          <ul className="hidden md:flex space-x-6">
            {navItems.map((item) => {
              const isActive = location.pathname === item.path;
              return (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    className={`transition-colors duration-300 ease-in-out font-medium ${
                      isActive
                        ? 'text-gray-400 font-semibold'
                        : 'text hover:text-yellow-300'
                    }`}
                  >
                    {item.name}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </nav>
  );
}
