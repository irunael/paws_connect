import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { Heart, LogIn } from 'lucide-react';

const UserLoginPage = () => {
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
      
      console.log('Login successful, user data:', authData.record);
      console.log('User type:', authData.record.userType);
      
      // Permite login mesmo sem userType definido (será tratado como adopter)
      if (authData.record.userType === 'ngo') {
        toast.error('ONGs devem fazer login na área de ONGs');
        return;
      }

      toast.success('Login realizado com sucesso');
      navigate('/');
    } catch (error) {
      toast.error('E-mail ou senha incorretos');
      console.error('Login error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Login - PawsConnect</title>
        <meta name="description" content="Faça login para salvar seus pets favoritos" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Bem-vindo de volta</h1>
              <p className="text-muted-foreground">
                Faça login para acessar seus favoritos
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Login</CardTitle>
                <CardDescription>
                  Entre com suas credenciais
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
                      placeholder="seu@email.com"
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
                    className="w-full gap-2"
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

                  <div className="text-center text-sm text-muted-foreground">
                    Não tem uma conta?{' '}
                    <Link to="/user-register" className="text-primary hover:underline">
                      Cadastre-se
                    </Link>
                  </div>

                  <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                    É uma ONG?{' '}
                    <Link to="/ngo-login" className="text-primary hover:underline">
                      Faça login aqui
                    </Link>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default UserLoginPage;
