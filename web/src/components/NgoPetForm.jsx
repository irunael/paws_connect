import React, { useState, useEffect } from 'react';
import { Button } from '@/ui/button';
import { Input } from '@/ui/input';
import { Label } from '@/ui/label';
import { Textarea } from '@/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Switch } from '@/ui/switch';
import pb from '@/lib/pocketbaseClient';
import { toast } from 'sonner';
import { useAuth } from '@/context/AuthContext.jsx';
import { PlusCircle, Save } from 'lucide-react';

const NgoPetForm = ({ pet, onSuccess }) => {
  const { currentNgo } = useAuth();
  const [formData, setFormData] = useState({
    petName: '',
    breed: '',
    age: '',
    petType: 'dog',
    healthStatus: 'healthy',
    vaccinationStatus: false,
    vaccines: '',
    diseases: '',
    description: ''
  });
  const [petPhoto, setPetPhoto] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (pet) {
      setFormData({
        petName: pet.petName || '',
        breed: pet.breed || '',
        age: pet.age || '',
        petType: pet.petType || 'dog',
        healthStatus: pet.healthStatus || 'healthy',
        vaccinationStatus: pet.vaccinationStatus || false,
        vaccines: pet.vaccines || '',
        diseases: pet.diseases || '',
        description: pet.description || ''
      });
    }
  }, [pet]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setPetPhoto(e.target.files[0]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const data = new FormData();
      Object.keys(formData).forEach(key => {
        if (key === 'age' && formData[key]) {
          data.append(key, parseFloat(formData[key]));
        } else {
          data.append(key, formData[key]);
        }
      });

      if (!pet) {
        data.append('ngoId', currentNgo.id);
      }

      if (petPhoto) {
        data.append('petPhoto', petPhoto);
      }

      if (pet) {
        await pb.collection('pets').update(pet.id, data, { $autoCancel: false });
        toast.success('Pet atualizado com sucesso');
      } else {
        await pb.collection('pets').create(data, { $autoCancel: false });
        toast.success('Pet adicionado com sucesso');
        setFormData({
          petName: '',
          breed: '',
          age: '',
          petType: 'dog',
          healthStatus: 'healthy',
          vaccinationStatus: false,
          vaccines: '',
          diseases: '',
          description: ''
        });
        setPetPhoto(null);
      }

      if (onSuccess) onSuccess();
    } catch (error) {
      toast.error(pet ? 'Falha ao atualizar pet' : 'Falha ao adicionar pet');
      console.error('Pet form error:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>{pet ? 'Editar pet' : 'Adicionar novo pet'}</CardTitle>
        <CardDescription>
          {pet ? 'Atualizar informações do pet' : 'Registrar um novo pet para adoção'}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="petName">Nome do pet</Label>
              <Input
                id="petName"
                name="petName"
                value={formData.petName}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Bidu"
              />
            </div>

            <div>
              <Label htmlFor="breed">Raça</Label>
              <Input
                id="breed"
                name="breed"
                value={formData.breed}
                onChange={handleChange}
                required
                className="mt-1"
                placeholder="Golden Retriever"
              />
            </div>

            <div>
              <Label htmlFor="age">Idade (anos)</Label>
              <Input
                id="age"
                name="age"
                type="number"
                step="0.1"
                value={formData.age}
                onChange={handleChange}
                className="mt-1"
                placeholder="2.5"
              />
            </div>

            <div>
              <Label htmlFor="petType">Tipo de pet</Label>
              <Select 
                value={formData.petType} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, petType: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="dog">Cachorro</SelectItem>
                  <SelectItem value="cat">Gato</SelectItem>
                  <SelectItem value="rabbit">Coelho</SelectItem>
                  <SelectItem value="bird">Pássaro</SelectItem>
                  <SelectItem value="other">Outro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="healthStatus">Status de saúde</Label>
              <Select 
                value={formData.healthStatus} 
                onValueChange={(value) => setFormData(prev => ({ ...prev, healthStatus: value }))}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="healthy">Saudável</SelectItem>
                  <SelectItem value="sick">Doente</SelectItem>
                  <SelectItem value="recovering">Em recuperação</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex items-center justify-between">
              <Label htmlFor="vaccinationStatus">Vacinado</Label>
              <Switch
                id="vaccinationStatus"
                checked={formData.vaccinationStatus}
                onCheckedChange={(checked) => setFormData(prev => ({ ...prev, vaccinationStatus: checked }))}
              />
            </div>
          </div>

          <div>
            <Label htmlFor="vaccines">Vacinas (opcional)</Label>
            <Input
              id="vaccines"
              name="vaccines"
              value={formData.vaccines}
              onChange={handleChange}
              className="mt-1"
              placeholder="Raiva, Cinomose, Parvovirose"
            />
          </div>

          <div>
            <Label htmlFor="diseases">Doenças conhecidas (opcional)</Label>
            <Input
              id="diseases"
              name="diseases"
              value={formData.diseases}
              onChange={handleChange}
              className="mt-1"
              placeholder="Nenhuma"
            />
          </div>

          <div>
            <Label htmlFor="description">Descrição (opcional)</Label>
            <Textarea
              id="description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              className="mt-1 min-h-[100px]"
              placeholder="Cachorro amigável e enérgico, ótimo com crianças..."
            />
          </div>

          <div>
            <Label htmlFor="petPhoto">Foto do pet</Label>
            <Input
              id="petPhoto"
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="mt-1"
            />
            {pet?.petPhoto && !petPhoto && (
              <p className="text-xs text-muted-foreground mt-1">
                A foto atual será mantida se nenhuma nova for enviada
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full gap-2 transition-all duration-200 active:scale-[0.98]"
            disabled={isSubmitting}
          >
            {isSubmitting ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                {pet ? 'Atualizando...' : 'Adicionando...'}
              </>
            ) : (
              <>
                {pet ? <Save className="w-4 h-4" /> : <PlusCircle className="w-4 h-4" />}
                {pet ? 'Atualizar pet' : 'Adicionar pet'}
              </>
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NgoPetForm;