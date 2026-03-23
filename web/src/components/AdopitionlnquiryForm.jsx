import React, { useState } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { Send } from 'lucide-react';

const AdoptionInquiryForm = ({ petId, ngoId }) => {
  const [formData, setFormData] = useState({
    adopterName: '',
    adopterEmail: '',
    adopterPhone: '',
    message: ''
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
      await pb.collection('adoption_inquiries').create({
        petId,
        ngoId,
        ...formData
      }, { $autoCancel: false });

      toast.success('Consulta enviada com sucesso');
      setFormData({
        adopterName: '',
        adopterEmail: '',
        adopterPhone: '',
        message: ''
      });
    } catch (error) {
      toast.error('Falha ao enviar consulta. Por favor, tente novamente.');
      console.error('Inquiry submission error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Interessado em adotar?</CardTitle>
        <CardDescription>
          Preencha este formulário e a ONG entrará em contato em breve
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="adopterName">Seu nome</Label>
            <Input
              id="adopterName"
              name="adopterName"
              value={formData.adopterName}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="Maria Silva"
            />
          </div>

          <div>
            <Label htmlFor="adopterEmail">E-mail</Label>
            <Input
              id="adopterEmail"
              name="adopterEmail"
              type="email"
              value={formData.adopterEmail}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="maria@exemplo.com"
            />
          </div>

          <div>
            <Label htmlFor="adopterPhone">Número de telefone</Label>
            <Input
              id="adopterPhone"
              name="adopterPhone"
              type="tel"
              value={formData.adopterPhone}
              onChange={handleChange}
              required
              className="mt-1"
              placeholder="+55 (11) 91234-5678"
            />
          </div>

          <div>
            <Label htmlFor="message">Mensagem (opcional)</Label>
            <Textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              className="mt-1 min-h-[100px]"
              placeholder="Conte-nos por que você gostaria de adotar este pet..."
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
                Enviando...
              </>
            ) : (
              <>
                <Send className="w-4 h-4" />
                Enviar consulta
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default AdoptionInquiryForm;