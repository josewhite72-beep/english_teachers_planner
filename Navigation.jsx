import { Link, useLocation } from 'react-router-dom';

function Navigation() {
  const location = useLocation();
  
  const navItems = [
    { path: '/dashboard', label: 'Dashboard', icon: '📊' },
    { path: '/planner', label: 'Lesson Planner', icon: '📝' },
    { path: '/students', label: 'Students', icon: '👥' },
    { path: '/resources', label: 'Resources', icon: '📚' },
    { path: '/analytics', label: 'Analytics', icon: '📈' },
  ];

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-lg">
      <div className="container mx-auto px-4 max-w-7xl">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <h1 className="text-2xl font-bold text-primary-600">
              📖 English Teachers Planner
            </h1>
          </div>
          <div className="hidden md:block">
            <div className="flex space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive(item.path)
                      ? 'bg-primary-500 text-white'
                      : 'text-gray-700 hover:bg-primary-100 hover:text-primary-600'
                  }`}
                >
                  <span className="mr-1">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
