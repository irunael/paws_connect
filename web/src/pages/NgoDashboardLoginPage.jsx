import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { Heart, LogIn } from 'lucide-react';

const NgoDashboardLoginPage = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const authData = await login(formData.email, formData.password);
      
      console.log('NGO Login - user data:', authData.record);
      console.log('NGO Login - userType:', authData.record.userType);
      console.log('NGO Login - ngoName:', authData.record.ngoName);
      
      // Verifica se é uma ONG (tem userType=ngo OU tem ngoName mas não tem userType)
      const isNgoUser = authData.record.userType === 'ngo' || 
                        (authData.record.ngoName && !authData.record.userType);
      
      if (!isNgoUser && authData.record.userType === 'adopter') {
        toast.error('Esta área é apenas para ONGs. Use o login de usuário.');
        return;
      }
      
      toast.success('Login realizado com sucesso');
      navigate('/ngo-dashboard');
    } catch (error) {
      toast.error('E-mail ou senha inválidos');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login da ONG - PawsConnect</title>
        <meta name="description" content="Faça login no painel da sua ONG para gerenciar listagens de pets e consultas de adoção." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
              <Heart className="w-7 h-7 text-primary fill-primary" />
              <span>PawsConnect</span>
            </Link>
            <p className="text-muted-foreground">Login do painel da ONG</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Bem-vindo de volta</CardTitle>
              <CardDescription>
                Faça login para gerenciar seus pets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="email">E-mail</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="ong@exemplo.com"
                  />
                </div>

                <div>
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    name="password"
                    type="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="••••••••"
                  />
                </div>

                <Button 
                  type="submit" 
                  className="w-full gap-2 transition-all duration-200 active:scale-[0.98]"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      Entrando...
                    </>
                  ) : (
                    <>
                      <LogIn className="w-4 h-4" />
                      Entrar
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Não tem uma conta?{' '}
                  <Link to="/ngo-register" className="text-primary hover:underline font-medium">
                    Registre-se aqui
                  </Link>
                </p>
              </div>

              <div className="mt-4 text-center">
                <Link to="/" className="text-sm text-muted-foreground hover:text-primary transition-colors duration-200">
                  Voltar para o início
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default NgoDashboardLoginPage;