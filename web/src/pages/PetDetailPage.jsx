import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { useParams, Link } from 'react-router-dom';
import { Button } from '@/ui/button';
import { Card, CardContent } from '@/ui/card';
import { Separator } from '@/ui/separator';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import HealthStatusBadge from '@/components/HealthStatusBadge.jsx';
import AdoptionInquiryForm from '@/components/AdopitionlnquiryForm.jsx';
import pb from '@/lib/pocketbaseClient';
import { ArrowLeft, Building2, Mail, Phone, MapPin, Calendar } from 'lucide-react';

const PetDetailPage = () => {
  const { id } = useParams();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPet = async () => {
      try {
        const record = await pb.collection('pets').getOne(id, {
          expand: 'ngoId',
          $autoCancel: false
        });
        setPet(record);
      } catch (error) {
        console.error('Failed to fetch pet:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchPet();
  }, [id]);

  if (loading) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-muted-foreground">Carregando detalhes do pet...</p>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  if (!pet) {
    return (
      <>
        <Header />
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <p className="text-muted-foreground mb-4">Pet não encontrado</p>
            <Link to="/pets">
              <Button variant="outline">Voltar para a busca</Button>
            </Link>
          </div>
        </div>
        <Footer />
      </>
    );
  }

  const imageUrl = pet.petPhoto 
    ? pb.files.getUrl(pet, pet.petPhoto)
    : 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=800&h=800&fit=crop';

  const translatePetType = (type) => {
    const types = {
      dog: 'Cachorro',
      cat: 'Gato',
      rabbit: 'Coelho',
      bird: 'Pássaro',
      other: 'Outro'
    };
    return types[type] || 'Não especificado';
  };

  const translateHealthStatus = (status) => {
    const statuses = {
      healthy: 'Saudável',
      sick: 'Doente',
      recovering: 'Em recuperação'
    };
    return statuses[status] || 'Desconhecido';
  };

  return (
    <>
      <Helmet>
        <title>{`${pet.petName} - PawsConnect`}</title>
        <meta name="description" content={`Conheça ${pet.petName}, um ${pet.breed} procurando por um lar amoroso. ${pet.description || ''}`} />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/pets">
              <Button variant="ghost" className="gap-2 mb-6 transition-all duration-200">
                <ArrowLeft className="w-4 h-4" />
                Voltar para a busca
              </Button>
            </Link>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
              <div className="aspect-square rounded-2xl overflow-hidden bg-muted">
                <img 
                  src={imageUrl} 
                  alt={pet.petName}
                  className="w-full h-full object-cover"
                />
              </div>

              <div>
                <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
                  {pet.petName}
                </h1>
                
                <div className="flex flex-wrap gap-2 mb-6">
                  <HealthStatusBadge 
                    healthStatus={pet.healthStatus} 
                    vaccinationStatus={pet.vaccinationStatus}
                  />
                </div>

                <div className="space-y-4 mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Raça</p>
                      <p className="font-medium">{pet.breed}</p>
                    </div>
                    {pet.age && (
                      <div>
                        <p className="text-sm text-muted-foreground mb-1">Idade</p>
                        <p className="font-medium">{pet.age} anos</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Tipo</p>
                      <p className="font-medium capitalize">{translatePetType(pet.petType)}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Status de saúde</p>
                      <p className="font-medium capitalize">{translateHealthStatus(pet.healthStatus)}</p>
                    </div>
                  </div>

                  {pet.vaccines && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Vacinas</p>
                      <p className="font-medium">{pet.vaccines}</p>
                    </div>
                  )}

                  {pet.diseases && (
                    <div>
                      <p className="text-sm text-muted-foreground mb-1">Doenças conhecidas</p>
                      <p className="font-medium">{pet.diseases}</p>
                    </div>
                  )}
                </div>

                {pet.description && (
                  <>
                    <Separator className="my-6" />
                    <div>
                      <h2 className="font-semibold text-lg mb-2">Sobre {pet.petName}</h2>
                      <p className="text-muted-foreground leading-relaxed">{pet.description}</p>
                    </div>
                  </>
                )}

                {pet.expand?.ngoId && (
                  <>
                    <Separator className="my-6" />
                    <Card>
                      <CardContent className="p-6">
                        <div className="flex items-center gap-2 mb-4">
                          <Building2 className="w-5 h-5 text-primary" />
                          <h3 className="font-semibold">Informações da ONG</h3>
                        </div>
                        <div className="space-y-2">
                          <p className="font-medium">{pet.expand.ngoId.ngoName}</p>
                          {pet.expand.ngoId.email && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Mail className="w-4 h-4" />
                              <span>{pet.expand.ngoId.email}</span>
                            </div>
                          )}
                          {pet.expand.ngoId.contactPhone && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <Phone className="w-4 h-4" />
                              <span>{pet.expand.ngoId.contactPhone}</span>
                            </div>
                          )}
                          {pet.expand.ngoId.address && (
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              <MapPin className="w-4 h-4" />
                              <span>{pet.expand.ngoId.address}</span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </>
                )}
              </div>
            </div>

            <div className="max-w-2xl">
              <AdoptionInquiryForm petId={pet.id} ngoId={pet.ngoId} />
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default PetDetailPage;