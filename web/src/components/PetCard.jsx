import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardFooter } from '@/ui/card';
import { Button } from '@/ui/button';
import HealthStatusBadge from '@/components/HealthStatusBadge.jsx';
import pb from '@/lib/pocketbaseClient';
import { useAuth } from '@/context/AuthContext.jsx';
import { Heart, Building2 } from 'lucide-react';
import { toast } from 'sonner';

const PetCard = ({ pet }) => {
  const { isAuthenticated, currentUser, isAdopter } = useAuth();
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteId, setFavoriteId] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const checkFavorite = async () => {
      // Se não está logado ou é uma ONG, verifica localStorage
      if (!isAuthenticated || currentUser?.userType === 'ngo') {
        const favorites = JSON.parse(localStorage.getItem('favoritePets') || '[]');
        setIsFavorite(favorites.includes(pet.id));
        return;
      }

      try {
        const records = await pb.collection('favorites').getFullList({
          filter: `userId = "${currentUser.id}" && petId = "${pet.id}"`,
          $autoCancel: false
        });
        
        if (records.length > 0) {
          setIsFavorite(true);
          setFavoriteId(records[0].id);
        }
      } catch (error) {
        console.error('Error checking favorite:', error);
      }
    };

    checkFavorite();
  }, [pet.id, isAuthenticated, currentUser, isAdopter]);

  const toggleFavorite = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.error('Faça login para salvar favoritos');
      return;
    }

    // Permite favoritar se for adopter OU se não tiver userType definido (assume que é adopter)
    if (currentUser?.userType === 'ngo') {
      toast.error('ONGs não podem favoritar pets');
      return;
    }

    setLoading(true);

    try {
      if (isFavorite && favoriteId) {
        await pb.collection('favorites').delete(favoriteId, { $autoCancel: false });
        setIsFavorite(false);
        setFavoriteId(null);
        toast.success('Removido dos favoritos');
      } else {
        const record = await pb.collection('favorites').create({
          userId: currentUser.id,
          petId: pet.id
        }, { $autoCancel: false });
        setIsFavorite(true);
        setFavoriteId(record.id);
        toast.success('Adicionado aos favoritos');
      }
    } catch (error) {
      toast.error('Erro ao atualizar favoritos');
      console.error('Favorite error:', error);
    } finally {
      setLoading(false);
    }
  };

  const imageUrl = pet.petPhoto 
    ? pb.files.getUrl(pet, pet.petPhoto, { thumb: '300x300' })
    : 'https://images.unsplash.com/photo-1450778869180-41d0601e046e?w=300&h=300&fit=crop';

  return (
    <Card className="group overflow-hidden transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <div className="aspect-square overflow-hidden bg-muted">
        <img 
          src={imageUrl} 
          alt={pet.petName}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
      </div>
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-lg">{pet.petName}</h3>
          <button
            onClick={toggleFavorite}
            disabled={loading}
            className="transition-all duration-200 hover:scale-110 active:scale-95 disabled:opacity-50"
            aria-label={isFavorite ? 'Remover dos favoritos' : 'Adicionar aos favoritos'}
          >
            <Heart 
              className={`w-5 h-5 transition-colors duration-200 ${
                isFavorite 
                  ? 'fill-red-500 text-red-500' 
                  : 'text-muted-foreground hover:text-red-500'
              }`}
            />
          </button>
        </div>
        <p className="text-sm text-muted-foreground mb-3">
          {pet.breed} {pet.age ? `• ${pet.age} anos` : ''}
        </p>
        <HealthStatusBadge 
          healthStatus={pet.healthStatus} 
          vaccinationStatus={pet.vaccinationStatus}
        />
        {pet.expand?.ngoId && (
          <div className="flex items-center gap-2 mt-3 text-xs text-muted-foreground">
            <Building2 className="w-3 h-3" />
            <span>{pet.expand.ngoId.ngoName}</span>
          </div>
        )}
      </CardContent>
      <CardFooter className="p-4 pt-0 mt-auto">
        <Link to={`/pet/${pet.id}`} className="w-full">
          <Button className="w-full transition-all duration-200 active:scale-[0.98]">
            Ver detalhes
          </Button>
        </Link>
      </CardFooter>
    </Card>
  );
};

export default PetCard;