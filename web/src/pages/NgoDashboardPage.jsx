import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Button } from '@/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/ui/tabs';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import NgoPetForm from '@/components/NgoPetForm.jsx';
import HealthStatusBadge from '@/components/HealthStatusBadge.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { toast } from 'sonner';
import { Pencil, Trash2, Eye, Mail } from 'lucide-react';

const NgoDashboardPage = () => {
  const { currentNgo } = useAuth();
  const [pets, setPets] = useState([]);
  const [inquiries, setInquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingPet, setEditingPet] = useState(null);
  const [activeTab, setActiveTab] = useState('pets');

  const fetchPets = async () => {
    try {
      const records = await pb.collection('pets').getFullList({
        filter: `ngoId = "${currentNgo.id}"`,
        sort: '-created',
        $autoCancel: false
      });
      setPets(records);
    } catch (error) {
      console.error('Failed to fetch pets:', error);
    }
  };

  const fetchInquiries = async () => {
    try {
      const records = await pb.collection('adoption_inquiries').getFullList({
        filter: `ngoId = "${currentNgo.id}"`,
        sort: '-created',
        expand: 'petId',
        $autoCancel: false
      });
      setInquiries(records);
    } catch (error) {
      console.error('Failed to fetch inquiries:', error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchPets(), fetchInquiries()]);
      setLoading(false);
    };

    fetchData();
  }, [currentNgo.id]);

  const handleDelete = async (petId) => {
    if (!window.confirm('Tem certeza que deseja excluir este pet?')) {
      return;
    }

    try {
      await pb.collection('pets').delete(petId, { $autoCancel: false });
      toast.success('Pet excluído com sucesso');
      fetchPets();
    } catch (error) {
      toast.error('Falha ao excluir pet');
      console.error('Delete error:', error);
    }
  };

  const handleFormSuccess = () => {
    setEditingPet(null);
    fetchPets();
  };

  return (
    <>
      <Helmet>
        <title>Painel da ONG - PawsConnect</title>
        <meta name="description" content="Gerencie seus pets e consultas de adoção." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                Bem-vindo, {currentNgo.ngoName}
              </h1>
              <p className="text-muted-foreground">
                Gerencie seus pets e consultas de adoção
              </p>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
              <TabsList>
                <TabsTrigger value="pets">Meus pets ({pets.length})</TabsTrigger>
                <TabsTrigger value="inquiries">Consultas ({inquiries.length})</TabsTrigger>
                <TabsTrigger value="add">Adicionar novo pet</TabsTrigger>
              </TabsList>

              <TabsContent value="pets" className="space-y-6">
                {loading ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="space-y-3">
                        <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                        <div className="h-4 bg-muted rounded animate-pulse"></div>
                        <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                      </div>
                    ))}
                  </div>
                ) : pets.length > 0 ? (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {pets.map(pet => {
                      const imageUrl = pet.petPhoto 
                        ? pb.files.getUrl(pet, pet.petPhoto, { thumb: '300x300' })
                        : 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop';

                      return (
                        <Card key={pet.id}>
                          <div className="aspect-square overflow-hidden bg-muted rounded-t-lg">
                            <img 
                              src={imageUrl} 
                              alt={pet.petName}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <CardContent className="p-4">
                            <h3 className="font-semibold text-lg mb-2">{pet.petName}</h3>
                            <p className="text-sm text-muted-foreground mb-3">
                              {pet.breed} {pet.age ? `• ${pet.age} anos` : ''}
                            </p>
                            <HealthStatusBadge 
                              healthStatus={pet.healthStatus} 
                              vaccinationStatus={pet.vaccinationStatus}
                            />
                            <div className="flex gap-2 mt-4">
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="flex-1 gap-2 transition-all duration-200"
                                onClick={() => setEditingPet(pet)}
                              >
                                <Pencil className="w-3 h-3" />
                                Editar
                              </Button>
                              <Button 
                                size="sm" 
                                variant="destructive" 
                                className="gap-2 transition-all duration-200"
                                onClick={() => handleDelete(pet.id)}
                              >
                                <Trash2 className="w-3 h-3" />
                                Excluir
                              </Button>
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground mb-4">Nenhum pet listado ainda</p>
                      <Button onClick={() => setActiveTab('add')}>
                        Adicione seu primeiro pet
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {editingPet && (
                  <div className="mt-8">
                    <div className="flex items-center justify-between mb-4">
                      <h2 className="text-xl font-semibold">Editar pet</h2>
                      <Button variant="ghost" onClick={() => setEditingPet(null)}>
                        Cancelar
                      </Button>
                    </div>
                    <NgoPetForm pet={editingPet} onSuccess={handleFormSuccess} />
                  </div>
                )}
              </TabsContent>

              <TabsContent value="inquiries">
                {loading ? (
                  <div className="space-y-4">
                    {[1, 2, 3].map(i => (
                      <div key={i} className="h-32 bg-muted rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : inquiries.length > 0 ? (
                  <div className="space-y-4">
                    {inquiries.map(inquiry => (
                      <Card key={inquiry.id}>
                        <CardHeader>
                          <div className="flex items-start justify-between">
                            <div>
                              <CardTitle className="text-lg">
                                {inquiry.adopterName}
                              </CardTitle>
                              <CardDescription>
                                Interessado em {inquiry.expand?.petId?.petName || 'Pet desconhecido'}
                              </CardDescription>
                            </div>
                            <span className="text-xs text-muted-foreground">
                              {new Date(inquiry.created).toLocaleDateString('pt-BR')}
                            </span>
                          </div>
                        </CardHeader>
                        <CardContent>
                          <div className="space-y-2 text-sm">
                            <div className="flex items-center gap-2">
                              <Mail className="w-4 h-4 text-muted-foreground" />
                              <a href={`mailto:${inquiry.adopterEmail}`} className="text-primary hover:underline">
                                {inquiry.adopterEmail}
                              </a>
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="w-4 h-4 text-muted-foreground">📞</span>
                              <a href={`tel:${inquiry.adopterPhone}`} className="text-primary hover:underline">
                                {inquiry.adopterPhone}
                              </a>
                            </div>
                            {inquiry.message && (
                              <div className="mt-4 p-3 bg-muted rounded-lg">
                                <p className="text-sm text-muted-foreground">{inquiry.message}</p>
                              </div>
                            )}
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-12 text-center">
                      <p className="text-muted-foreground">Nenhuma consulta ainda</p>
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="add">
                <NgoPetForm onSuccess={handleFormSuccess} />
              </TabsContent>
            </Tabs>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default NgoDashboardPage;