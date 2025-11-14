import { useAuth } from '@/lib/auth';
import { useQuery } from '@tanstack/react-query';
import type { PetitionWithCreator, Signature } from '@shared/schema';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PetitionCard } from '@/components/PetitionCard';
import { Link } from 'wouter';
import { FileText, PenLine } from 'lucide-react';

export default function Profile() {
  const { user, isAuthenticated, loginWithRedirect } = useAuth();

  const { data: petitions } = useQuery<PetitionWithCreator[]>({
    queryKey: ['/api/petitions'],
    enabled: isAuthenticated,
  });

  const { data: signatures } = useQuery<Signature[]>({
    queryKey: ['/api/signatures/my'],
    enabled: isAuthenticated,
  });

  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to be signed in to view your profile
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loginWithRedirect} className="w-full" data-testid="button-login">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const myPetitions = petitions?.filter(p => p.createdById === user.id) || [];
  const mySignatures = signatures || [];

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header */}
        <Card className="mb-8">
          <CardContent className="pt-6">
            <div className="flex items-center gap-6">
              <Avatar className="h-20 w-20">
                <AvatarImage src={user.picture || undefined} alt={user.name} />
                <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
              </Avatar>
              <div>
                <h1 className="text-3xl font-bold mb-1" data-testid="text-name">{user.name}</h1>
                <p className="text-muted-foreground" data-testid="text-email">{user.email}</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Stats */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Petitions Created</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-created">{myPetitions.length}</div>
            </CardContent>
          </Card>
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Petitions Signed</CardTitle>
              <PenLine className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold" data-testid="stat-signed">{mySignatures.length}</div>
            </CardContent>
          </Card>
        </div>

        {/* Tabs */}
        <Tabs defaultValue="created" className="space-y-6">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="created" data-testid="tab-created">My Petitions</TabsTrigger>
            <TabsTrigger value="signed" data-testid="tab-signed">Signed</TabsTrigger>
          </TabsList>

          <TabsContent value="created" className="space-y-6">
            {myPetitions.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't created any petitions yet</p>
                  <Link href="/create" data-testid="link-create">
                    <Button data-testid="button-create">Create Your First Petition</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myPetitions.map((petition) => (
                  <PetitionCard key={petition.id} petition={petition} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value="signed" className="space-y-6">
            {mySignatures.length === 0 ? (
              <Card>
                <CardContent className="pt-6 text-center py-12">
                  <p className="text-muted-foreground mb-4">You haven't signed any petitions yet</p>
                  <Link href="/browse" data-testid="link-browse">
                    <Button data-testid="button-browse">Browse Petitions</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Petitions You've Signed</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    {mySignatures.map((signature) => (
                      <div 
                        key={signature.id} 
                        className="py-3 border-b last:border-0"
                        data-testid={`signed-${signature.id}`}
                      >
                        <Link href={`/petition/${signature.petitionId}`}>
                          <Button variant="ghost" className="p-0 h-auto text-base font-medium hover:underline">
                            View Petition →
                          </Button>
                        </Link>
                        <p className="text-sm text-muted-foreground mt-1">
                          Signed as {signature.firstName} {signature.lastName}
                        </p>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}