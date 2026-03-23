import React, { useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { Heart, UserPlus } from 'lucide-react';

const NgoDashboardRegisterPage = () => {
  const navigate = useNavigate();
  const { signupNgo } = useAuth();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    passwordConfirm: '',
    ngoName: '',
    contactPhone: '',
    address: ''
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
      await signupNgo(
        formData.email,
        formData.password,
        formData.ngoName,
        formData.contactPhone,
        formData.address
      );
      toast.success('Registro realizado com sucesso');
      navigate('/ngo-dashboard');
    } catch (error) {
      if (error.message.includes('email')) {
        toast.error('E-mail já registrado');
      } else {
        toast.error('Falha no registro. Por favor, tente novamente.');
      }
      console.error('Registration error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <Helmet>
        <title>Registro de ONG - PawsConnect</title>
        <meta name="description" content="Registre sua ONG para começar a listar pets para adoção no PawsConnect." />
      </Helmet>

      <div className="min-h-screen flex items-center justify-center bg-muted/30 p-4 py-12">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center gap-2 font-bold text-2xl mb-2">
              <Heart className="w-7 h-7 text-primary fill-primary" />
              <span>PawsConnect</span>
            </Link>
            <p className="text-muted-foreground">Registre sua ONG</p>
          </div>

          <Card>
            <CardHeader>
              <CardTitle>Criar conta de ONG</CardTitle>
              <CardDescription>
                Comece a listar pets para adoção
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <Label htmlFor="ngoName">Nome da ONG</Label>
                  <Input
                    id="ngoName"
                    name="ngoName"
                    value={formData.ngoName}
                    onChange={handleChange}
                    required
                    className="mt-1"
                    placeholder="Resgate Patas Felizes"
                  />
                </div>

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
                    placeholder="contato@patasfelizes.org"
                  />
                </div>

                <div>
                  <Label htmlFor="contactPhone">Telefone de contato (opcional)</Label>
                  <Input
                    id="contactPhone"
                    name="contactPhone"
                    type="tel"
                    value={formData.contactPhone}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="+55 (11) 91234-5678"
                  />
                </div>

                <div>
                  <Label htmlFor="address">Endereço (opcional)</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    className="mt-1"
                    placeholder="Rua do Resgate, 123, Cidade Pet"
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
                  <p className="text-xs text-muted-foreground mt-1">
                    Mínimo de 8 caracteres
                  </p>
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
                      Criando conta...
                    </>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      Criar conta
                    </>
                  )}
                </Button>
              </form>

              <div className="mt-6 text-center">
                <p className="text-sm text-muted-foreground">
                  Já tem uma conta?{' '}
                  <Link to="/ngo-login" className="text-primary hover:underline font-medium">
                    Faça login aqui
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

export default NgoDashboardRegisterPage;