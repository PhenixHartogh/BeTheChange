import { useParams, Link } from 'wouter';
import { useQuery } from '@tanstack/react-query';
import type { PetitionWithDetails, Signature } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ArrowLeft, Download } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

export default function PetitionSignatures() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();

  const { data, isLoading } = useQuery<{ petition: PetitionWithDetails; signatures: Signature[] }>({
    queryKey: ['/api/petitions', id, 'signatures'],
    enabled: !!id && isAuthenticated,
  });

  const petition = data?.petition;
  const signatures = data?.signatures || [];

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse h-96 bg-card rounded-lg" />
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Petition not found</h2>
          <Link href="/browse" data-testid="link-browse">
            <Button data-testid="button-browse">Browse Petitions</Button>
          </Link>
        </div>
      </div>
    );
  }

  const isCreator = user?.id === petition.createdById;

  if (!isCreator) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
          <p className="text-muted-foreground mb-6">
            Only the petition creator can view signatures
          </p>
          <Link href={`/petition/${petition.id}`} data-testid="link-petition">
            <Button data-testid="button-back-petition">Back to Petition</Button>
          </Link>
        </div>
      </div>
    );
  }

  const downloadCSV = () => {
    if (!signatures || !petition) return;

    const headers = ['First Name', 'Last Name', 'Email', 'Phone Number', 'Postcode', 'Signed At'];
    const rows = signatures.map(sig => [
      sig.firstName,
      sig.lastName,
      sig.email,
      sig.phoneNumber,
      sig.postcode,
      new Date(sig.createdAt).toISOString(),
    ]);

    const csv = [
      headers.join(','),
      ...rows.map(row => row.map(cell => `"${cell}"`).join(',')),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `petition-${petition.id}-signatures.csv`;
    a.click();
    window.URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <Link href={`/petition/${petition.id}`} data-testid="link-back">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Petition
          </Button>
        </Link>

        <div className="mb-8 flex items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl sm:text-4xl font-bold mb-2" data-testid="text-title">
              Signatures
            </h1>
            <p className="text-lg text-muted-foreground">
              {petition.title}
            </p>
          </div>
          <Button onClick={downloadCSV} data-testid="button-download">
            <Download className="mr-2 h-4 w-4" />
            Download CSV
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>
              {signatures.length} Total Signature{signatures.length !== 1 ? 's' : ''}
            </CardTitle>
          </CardHeader>
          <CardContent>
            {signatures.length === 0 ? (
              <div className="text-center py-12 text-muted-foreground">
                No signatures yet
              </div>
            ) : (
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Name</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Phone</TableHead>
                      <TableHead>Postcode</TableHead>
                      <TableHead>Signed</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {signatures.map((signature) => (
                      <TableRow key={signature.id} data-testid={`row-signature-${signature.id}`}>
                        <TableCell className="font-medium">
                          {signature.firstName} {signature.lastName}
                        </TableCell>
                        <TableCell>{signature.email}</TableCell>
                        <TableCell>{signature.phoneNumber}</TableCell>
                        <TableCell>{signature.postcode}</TableCell>
                        <TableCell className="text-muted-foreground">
                          {formatDistanceToNow(new Date(signature.createdAt), { addSuffix: true })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}