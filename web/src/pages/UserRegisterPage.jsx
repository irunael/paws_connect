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
import { Heart, UserPlus } from 'lucide-react';

const UserRegisterPage = () => {
  const navigate = useNavigate();
  const { signupAdopter } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: ''
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

    if (formData.password !== formData.passwordConfirm) {
      toast.error('As senhas não coincidem');
      return;
    }

    if (formData.password.length < 8) {
      toast.error('A senha deve ter pelo menos 8 caracteres');
      return;
    }

    setIsSubmitting(true);

    try {
      await signupAdopter(
        formData.email,
        formData.password
      );
      toast.success('Cadastro realizado com sucesso');
      navigate('/');
    } catch (error) {
      console.error('Registration error:', error);
      console.error('Error data:', error.data);
      console.error('Error response:', error.response);
      
      if (error.data?.data) {
        const fields = Object.keys(error.data.data);
        toast.error(`Erro nos campos: ${fields.join(', ')}`);
      } else if (error.message.includes('email')) {
        toast.error('E-mail já registrado');
      } else {
        toast.error('Erro ao criar conta. Tente novamente.');
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Cadastro - PawsConnect</title>
        <meta name="description" content="Crie sua conta para salvar pets favoritos" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 flex items-center justify-center py-12 px-4">
          <div className="w-full max-w-md">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                <Heart className="w-8 h-8 text-primary" />
              </div>
              <h1 className="text-3xl font-bold mb-2">Crie sua conta</h1>
              <p className="text-muted-foreground">
                Cadastre-se para salvar seus pets favoritos
              </p>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Cadastro</CardTitle>
                <CardDescription>
                  Preencha seus dados para criar uma conta
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
                      placeholder="Mínimo 8 caracteres"
                    />
                  </div>

                  <div>
                    <Label htmlFor="passwordConfirm">Confirmar senha</Label>
                    <Input
                      id="passwordConfirm"
                      name="passwordConfirm"
                      type="password"
                      value={formData.passwordConfirm}
                      onChange={handleChange}
                      required
                      className="mt-1"
                      placeholder="Digite a senha novamente"
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
                        Criando conta...
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-4 h-4" />
                        Criar conta
                      </>
                    )}
                  </Button>

                  <div className="text-center text-sm text-muted-foreground">
                    Já tem uma conta?{' '}
                    <Link to="/user-login" className="text-primary hover:underline">
                      Faça login
                    </Link>
                  </div>

                  <div className="text-center text-sm text-muted-foreground pt-4 border-t">
                    É uma ONG?{' '}
                    <Link to="/ngo-register" className="text-primary hover:underline">
                      Cadastre-se aqui
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

export default UserRegisterPage;
