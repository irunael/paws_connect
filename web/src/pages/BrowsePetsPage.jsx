import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Input } from '@/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/ui/select';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PetCard from '@/components/PetCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { Search } from 'lucide-react';

const BrowsePetsPage = () => {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [petTypeFilter, setPetTypeFilter] = useState('all');

  useEffect(() => {
    const fetchPets = async () => {
      setLoading(true);
      try {
        let filter = '';
        const filters = [];

        if (searchTerm) {
          filters.push(`petName ~ "${searchTerm}" || breed ~ "${searchTerm}"`);
        }

        if (petTypeFilter !== 'all') {
          filters.push(`petType = "${petTypeFilter}"`);
        }

        if (filters.length > 0) {
          filter = filters.join(' && ');
        }

        const records = await pb.collection('pets').getFullList({
          sort: '-created',
          expand: 'ngoId',
          filter: filter || undefined,
          $autoCancel: false
        });

        setPets(records);
      } catch (error) {
        console.error('Failed to fetch pets:', error);
      } finally {
        setLoading(false);
      }
    };

    const debounce = setTimeout(() => {
      fetchPets();
    }, 300);

    return () => clearTimeout(debounce);
  }, [searchTerm, petTypeFilter]);

  return (
    <>
      <Helmet>
        <title>Procurar pets - PawsConnect</title>
        <meta name="description" content="Navegue por todos os pets disponíveis para adoção. Filtre por tipo e busque por nome ou raça." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1 py-12">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-8">
              <h1 className="text-3xl md:text-4xl font-bold leading-tight mb-4" style={{ letterSpacing: '-0.02em' }}>
                Encontre seu companheiro perfeito
              </h1>
              <p className="text-muted-foreground max-w-2xl">
                Navegue por todos os pets disponíveis e encontre aquele que é certo para você
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar por nome ou raça..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              <Select value={petTypeFilter} onValueChange={setPetTypeFilter}>
                <SelectTrigger className="w-full sm:w-[180px]">
                  <SelectValue placeholder="Filtrar por tipo" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Todos os tipos</SelectItem>
                  <SelectItem value="dog">Cachorros</SelectItem>
                  <SelectItem value="cat">Gatos</SelectItem>
                  <SelectItem value="rabbit">Coelhos</SelectItem>
                  <SelectItem value="bird">Pássaros</SelectItem>
                  <SelectItem value="other">Outros</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
                  <div key={i} className="space-y-3">
                    <div className="aspect-square bg-muted rounded-lg animate-pulse"></div>
                    <div className="h-4 bg-muted rounded animate-pulse"></div>
                    <div className="h-4 bg-muted rounded w-2/3 animate-pulse"></div>
                  </div>
                ))}
              </div>
            ) : pets.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {pets.map(pet => (
                  <PetCard key={pet.id} pet={pet} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-muted-foreground">Nenhum pet encontrado com estes critérios</p>
              </div>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default BrowsePetsPage;