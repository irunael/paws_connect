import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, Mail, Phone, MapPin } from 'lucide-react';

const Footer = () => {
  return (
    <footer className="border-t bg-muted/30 mt-20">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <div className="flex items-center gap-2 font-bold text-lg mb-4">
              <Heart className="w-5 h-5 text-primary fill-primary" />
              <span>PawsConnect</span>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-[40ch]">
              Conectando lares amorosos com pets necessitados. Cada adoção salva uma vida.
            </p>
          </div>

          <div>
            <span className="font-semibold text-sm mb-4 block">Links rápidos</span>
            <div className="flex flex-col gap-2">
              <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Início
              </Link>
              <Link to="/pets" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Procurar pets
              </Link>
              <Link to="/ngo-login" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                Login ONG
              </Link>
            </div>
          </div>

          <div>
            <span className="font-semibold text-sm mb-4 block">Contato</span>
            <div className="flex flex-col gap-2">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Mail className="w-4 h-4" />
                <span>info@pawsconnect.org</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Phone className="w-4 h-4" />
                <span>+1 (555) 123-4567</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <MapPin className="w-4 h-4" />
                <span>123 Rescue Lane, Pet City</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            © 2026 PawsConnect. Todos os direitos reservados.
          </p>
          <div className="flex gap-4">
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Política de privacidade
            </Link>
            <Link to="#" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
              Termos de serviço
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;