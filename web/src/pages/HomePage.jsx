import React, { useEffect, useState } from 'react';
import { Helmet } from 'react-helmet';
import { Link } from 'react-router-dom';
import { Button } from '@/ui/button';
import Header from '@/components/Header.jsx';
import Footer from '@/components/Footer.jsx';
import PetCard from '@/components/PetCard.jsx';
import pb from '@/lib/pocketbaseClient';
import { ArrowRight, Heart, Shield, Users } from 'lucide-react';
import { motion } from 'framer-motion';

const HomePage = () => {
  const [featuredPets, setFeaturedPets] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFeaturedPets = async () => {
      try {
        const records = await pb.collection('pets').getList(1, 4, {
          sort: '-created',
          expand: 'ngoId',
          $autoCancel: false
        });
        setFeaturedPets(records.items);
      } catch (error) {
        console.error('Failed to fetch featured pets:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchFeaturedPets();
  }, []);

  return (
    <>
      <Helmet>
        <title>PawsConnect - Encontre seu companheiro perfeito</title>
        <meta name="description" content="Conecte-se com pets necessitados de lares amorosos. Navegue por cachorros, gatos e mais de ONGs verificadas." />
      </Helmet>

      <div className="min-h-screen flex flex-col">
        <Header />

        <main className="flex-1">
          <section className="relative min-h-[90vh] flex items-center justify-center overflow-hidden">
            <div className="absolute inset-0 z-0">
              <img 
                src="https://images.unsplash.com/photo-1599194921977-f89d8bd0eefb" 
                alt="Cachorro feliz em um campo"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/70 via-black/50 to-black/30"></div>
            </div>

            <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                className="max-w-3xl text-white"
              >
                <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6" style={{ letterSpacing: '-0.02em' }}>
                  Todo pet merece um lar amoroso
                </h1>
                <p className="text-lg md:text-xl leading-relaxed mb-8 text-white/90 max-w-[65ch]">
                  Conecte-se com ONGs verificadas e encontre seu companheiro perfeito. Navegue pelos pets disponíveis para adoção e dê a eles a segunda chance que merecem.
                </p>
                <div className="flex flex-wrap gap-4">
                  <Link to="/pets">
                    <Button size="lg" className="gap-2 transition-all duration-200 active:scale-[0.98]">
                      Procurar pets
                      <ArrowRight className="w-5 h-5" />
                    </Button>
                  </Link>
                  <Link to="/ngo-register">
                    <Button size="lg" variant="outline" className="bg-white/10 backdrop-blur-sm border-white/20 text-white hover:bg-white/20 transition-all duration-200 active:scale-[0.98]">
                      Registrar como ONG
                    </Button>
                  </Link>
                </div>
              </motion.div>
            </div>
          </section>

          <section className="py-20 bg-muted/30">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
                <motion.div
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                >
                  <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-4">
                    Por que escolher o PawsConnect?
                  </h2>
                  <p className="text-muted-foreground leading-relaxed mb-6 max-w-prose">
                    Nós conectamos você diretamente com organizações de bem-estar animal verificadas, tornando o processo de adoção transparente e confiável.
                  </p>
                  <div className="space-y-4">
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Shield className="w-6 h-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">ONGs Verificadas</h3>
                        <p className="text-sm text-muted-foreground">Todas as organizações são verificadas para garantir o bem-estar dos pets</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-secondary/10 flex items-center justify-center flex-shrink-0">
                        <Heart className="w-6 h-6 text-secondary" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Registros de saúde</h3>
                        <p className="text-sm text-muted-foreground">Informações completas de vacinação e status de saúde</p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center flex-shrink-0">
                        <Users className="w-6 h-6 text-accent" />
                      </div>
                      <div>
                        <h3 className="font-semibold mb-1">Contato direto</h3>
                        <p className="text-sm text-muted-foreground">Conecte-se diretamente com as ONGs para um processo de adoção tranquilo</p>
                      </div>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="relative"
                >
                  <div className="aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
                    <img 
                      src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=800&h=600&fit=crop" 
                      alt="Cachorro adotado feliz com o dono"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </motion.div>
              </div>
            </div>
          </section>

          <section className="py-20">
            <div className="container mx-auto px-4 sm:px-6 lg:px-8">
              <div className="text-center mb-12">
                <h2 className="text-2xl md:text-3xl font-semibold leading-snug mb-4">
                  Conheça nossos novos amigos
                </h2>
                <p className="text-muted-foreground max-w-2xl mx-auto">
                  Estes pets estão procurando por seus lares definitivos
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
              ) : featuredPets.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {featuredPets.map((pet, index) => (
                    <motion.div
                      key={pet.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <PetCard pet={pet} />
                    </motion.div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <p className="text-muted-foreground">Nenhum pet disponível ainda</p>
                </div>
              )}

              <div className="text-center mt-12">
                <Link to="/pets">
                  <Button size="lg" variant="outline" className="gap-2 transition-all duration-200 active:scale-[0.98]">
                    Ver todos os pets
                    <ArrowRight className="w-5 h-5" />
                  </Button>
                </Link>
              </div>
            </div>
          </section>
        </main>

        <Footer />
      </div>
    </>
  );
};

export default HomePage;