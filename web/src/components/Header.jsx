import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext.jsx';
import { Button } from '@/ui/button';
import { Heart, LogOut, LayoutDashboard, User } from 'lucide-react';

const Header = () => {
  const { isAuthenticated, logout, currentUser, isNgo, isAdopter } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const isActive = (path) => location.pathname === path;

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">
          <Link to="/" className="flex items-center gap-2 font-bold text-xl">
            <Heart className="w-6 h-6 text-primary fill-primary" />
            <span>PawsConnect</span>
          </Link>

          <nav className="hidden md:flex items-center gap-6">
            <Link 
              to="/" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive('/') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Início
            </Link>
            <Link 
              to="/pets" 
              className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                isActive('/pets') ? 'text-primary' : 'text-foreground'
              }`}
            >
              Procurar pets
            </Link>
            {isAuthenticated && !isNgo && (
              <Link 
                to="/favorites" 
                className={`text-sm font-medium transition-colors duration-200 hover:text-primary ${
                  isActive('/favorites') ? 'text-primary' : 'text-foreground'
                }`}
              >
                Favoritos
              </Link>
            )}
          </nav>

          <div className="flex items-center gap-3">
            {!isAuthenticated ? (
              <>
                <Link to="/user-login">
                  <Button variant="ghost" size="sm" className="gap-2 transition-all duration-200">
                    <User className="w-4 h-4" />
                    Entrar
                  </Button>
                </Link>
                <Link to="/ngo-login">
                  <Button variant="outline" size="sm" className="transition-all duration-200">
                    Login ONG
                  </Button>
                </Link>
              </>
            ) : (
              <>
                {isNgo && (
                  <Link to="/ngo-dashboard">
                    <Button variant="outline" size="sm" className="gap-2 transition-all duration-200">
                      <LayoutDashboard className="w-4 h-4" />
                      Painel
                    </Button>
                  </Link>
                )}
                {isAdopter && (
                  <span className="text-sm text-muted-foreground">
                    Olá, {currentUser?.email?.split('@')[0]}
                  </span>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  onClick={handleLogout}
                  className="gap-2 transition-all duration-200"
                >
                  <LogOut className="w-4 h-4" />
                  Sair
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;