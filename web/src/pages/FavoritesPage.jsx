import { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PetCard from '@/components/PetCard.jsx';
import { Card, CardContent } from '@/ui/card';
import { Button } from '@/ui/button';
import { useAuth } from '@/context/AuthContext.jsx';
import pb from '@/lib/pocketbaseClient';
import { Heart } from 'lucide-react';

const FavoritesPage = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const [favoritePets, setFavoritePets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFavorites = async () => {
      if (!isAuthenticated) {
        setLoading(false);
        return;
      }

      try {
        const favorites = await pb.collection('favorites').getFullList({
          filter: `userId = "${currentUser.id}"`,
          expand: 'petId,petId.ngoId',
          $autoCancel: false
        });

        const pets = favorites
          .map(fav => fav.expand?.petId)
          .filter(pet => pet !== undefined);

        setFavoritePets(pets);
      } catch (error) {
        console.error('Error fetching favorites:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFavorites();
  }, [isAuthenticated, currentUser]);

  if (!isAuthenticated) {
    return (
      <>
        <Helmet>
          <title>Favoritos - PawsConnect</title>
        </Helmet>

        <div className="min-h-screen flex flex-col">
          <Header />
          <main className="flex-1 flex items-center justify-center py-12 px-4">
            <Card className="max-w-md w-full">
              <CardContent className="p-12 text-center">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-4">
                  <Heart className="w-8 h-8 text-primary" />
                </div>
                <h2 className="text-2xl font-bold mb-2">Faça login para ver seus favoritos</h2>
                <p className="text-muted-foreground mb-6">
                  Crie uma conta para salvar seus pets favoritos
                </p>
                <div className="flex gap-3 justify-center">
                  <Link to="/user-login">
                    <Button>Fazer login</Button>
                  </Link>
                  <Link to="/user-register">
                    <Button variant="outline">Criar conta</Button>
                  </Link>
                </div>
              </CardContent>
            </Card>
          </main>
          <Footer />
        </div>
      </>
    );
  }

  return (
    <>
      <Helmet>
        <title>Meus Favoritos - PawsConnect</title>
        <meta name="description" content="Veja seus pets favoritos" />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-2" style={{ letterSpacing: '-0.02em' }}>
                Meus Favoritos
              </h1>
              <p className="text-muted-foreground">
                Pets que você salvou para adoção
              </p>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : favoritePets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {favoritePets.map(pet => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-12 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-muted mb-4">
                    <Heart className="w-8 h-8 text-muted-foreground" />
                  </div>
                  <h2 className="text-xl font-semibold mb-2">Nenhum favorito ainda</h2>
                  <p className="text-muted-foreground mb-6">
                    Comece a favoritar pets para vê-los aqui
                  </p>
                  <Link to="/pets">
                    <Button>Procurar pets</Button>
                  </Link>
                </CardContent>
              </Card>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default FavoritesPage;
