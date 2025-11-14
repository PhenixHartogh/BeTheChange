import { useState } from 'react';
import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PetitionCard } from '@/components/PetitionCard';
import { useQuery } from '@tanstack/react-query';
import type { PetitionWithCreator } from '@shared/schema';
import { ArrowRight, CheckCircle, FileEdit, Share2, TrendingUp, Search } from 'lucide-react';
import heroImage from '@assets/generated_images/Hero_image_diverse_activists_64563ab2.png';
import { useAuth } from '@/lib/auth';

export default function Home() {
  const { isAuthenticated, loginWithRedirect } = useAuth();
  const [, setLocation] = useLocation();
  const [searchQuery, setSearchQuery] = useState('');
  const { data: petitions, isLoading } = useQuery<PetitionWithCreator[]>({
    queryKey: ['/api/petitions'],
  });

  const featuredPetitions = petitions?.slice(0, 3) || [];

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setLocation(`/browse?search=${encodeURIComponent(searchQuery.trim())}`);
    } else {
      setLocation('/browse');
    }
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative h-[80vh] min-h-[600px] flex items-center justify-center overflow-hidden">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url(${heroImage})` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/60 to-black/70" />
        
        <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 text-center text-white">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-bold mb-6 max-w-4xl mx-auto leading-tight">
            Be the Change You Want to See
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl mb-8 max-w-2xl mx-auto text-white/90">
            Create and sign petitions that drive real change in your community and beyond
          </p>
          
          {/* Search Bar */}
          <form onSubmit={handleSearch} className="max-w-2xl mx-auto mb-6">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-white/80" />
              <Input
                type="text"
                placeholder="Search for petitions..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 pr-32 h-14 text-lg bg-white/95 backdrop-blur-sm border-white/30 focus:bg-white"
                data-testid="input-home-search"
              />
              <Button
                type="submit"
                size="default"
                className="absolute right-2 top-1/2 -translate-y-1/2"
                data-testid="button-home-search"
              >
                Search
              </Button>
            </div>
          </form>

          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            {isAuthenticated ? (
              <Link href="/create" data-testid="link-hero-start">
                <Button size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-hero-start">
                  Start a Petition
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto" 
                onClick={loginWithRedirect}
                data-testid="button-hero-start"
              >
                Start a Petition
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
            <Link href="/browse" data-testid="link-hero-browse">
              <Button 
                size="lg" 
                variant="outline" 
                className="text-lg px-8 py-6 h-auto bg-white/10 backdrop-blur-sm border-white/30 text-white hover:bg-white/20"
                data-testid="button-hero-browse"
              >
                Browse Petitions
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Featured Petitions */}
      {featuredPetitions.length > 0 && (
        <section className="py-16 sm:py-20 bg-muted/30">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-12">
              <h2 className="text-3xl sm:text-4xl font-bold mb-4">Trending Petitions</h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Join thousands making their voices heard on issues that matter
              </p>
            </div>
            
            {isLoading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1, 2, 3].map((i) => (
                  <div key={i} className="h-96 bg-card rounded-lg animate-pulse" />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredPetitions.map((petition) => (
                  <PetitionCard key={petition.id} petition={petition} />
                ))}
              </div>
            )}
            
            <div className="text-center mt-12">
              <Link href="/browse" data-testid="link-view-all">
                <Button size="lg" variant="outline" data-testid="button-view-all">
                  View All Petitions
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      )}

      {/* How It Works */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">How It Works</h2>
            <p className="text-lg text-muted-foreground">Three simple steps to create change</p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <FileEdit className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">1. Create</h3>
              <p className="text-muted-foreground">
                Start a petition about an issue you care about with a compelling title and description
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <Share2 className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">2. Share</h3>
              <p className="text-muted-foreground">
                Spread the word through social media, email, and your community to gather support
              </p>
            </div>
            
            <div className="text-center space-y-4">
              <div className="w-16 h-16 mx-auto rounded-full bg-primary/10 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold">3. Win</h3>
              <p className="text-muted-foreground">
                Reach your signature goal and deliver real change to decision makers
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Stats */}
      <section className="py-16 sm:py-20 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl sm:text-4xl font-bold mb-4">Our Impact</h2>
            <p className="text-lg opacity-90">Together, we're making a difference</p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold" data-testid="stat-petitions">
                {petitions?.length || 0}
              </div>
              <div className="text-lg opacity-90">Active Petitions</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold" data-testid="stat-signatures">
                {petitions?.reduce((acc, p) => acc + (p._count?.signatures || 0), 0).toLocaleString() || 0}
              </div>
              <div className="text-lg opacity-90">Total Signatures</div>
            </div>
            
            <div className="text-center space-y-2">
              <div className="text-5xl font-bold flex items-center justify-center gap-2">
                <TrendingUp className="h-10 w-10" />
                100%
              </div>
              <div className="text-lg opacity-90">People-Powered</div>
            </div>
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16 sm:py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto text-center space-y-6">
            <h2 className="text-3xl sm:text-4xl font-bold">
              Ready to Make Your Voice Heard?
            </h2>
            <p className="text-lg text-muted-foreground">
              Join thousands of changemakers using petitions to create real impact in their communities
            </p>
            {isAuthenticated ? (
              <Link href="/create" data-testid="link-footer-start">
                <Button size="lg" className="text-lg px-8 py-6 h-auto" data-testid="button-footer-start">
                  Start Your Petition Today
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Button>
              </Link>
            ) : (
              <Button 
                size="lg" 
                className="text-lg px-8 py-6 h-auto" 
                onClick={loginWithRedirect}
                data-testid="button-footer-start"
              >
                Start Your Petition Today
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            )}
          </div>
        </div>
      </section>
    </div>
  );
}