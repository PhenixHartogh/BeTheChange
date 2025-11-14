import { useQuery } from '@tanstack/react-query';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, Briefcase } from 'lucide-react';
import type { DecisionMaker } from '@shared/schema';

interface DecisionMakersProps {
  petitionId: string;
}

export function DecisionMakers({ petitionId }: DecisionMakersProps) {
  const { data: decisionMakers = [], isLoading } = useQuery<DecisionMaker[]>({
    queryKey: ['/api/petitions', petitionId, 'decision-makers'],
    queryFn: () => fetch(`/api/petitions/${petitionId}/decision-makers`).then(r => r.json()),
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Briefcase className="h-5 w-5" />
            Decision Makers
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="animate-pulse space-y-4">
            <div className="h-20 bg-muted rounded" />
          </div>
        </CardContent>
      </Card>
    );
  }

  if (decisionMakers.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Briefcase className="h-5 w-5" />
          Decision Makers
        </CardTitle>
        <CardDescription>
          People who can help make this change happen
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {decisionMakers.map((dm) => (
            <div
              key={dm.id}
              className="border rounded-lg p-4 space-y-1"
              data-testid={`decision-maker-${dm.id}`}
            >
              <p className="font-semibold">{dm.name}</p>
              {dm.title && (
                <p className="text-sm text-muted-foreground">{dm.title}</p>
              )}
              <a
                href={`mailto:${dm.email}`}
                className="text-sm text-primary hover:underline flex items-center gap-1"
                data-testid={`email-${dm.id}`}
              >
                <Mail className="h-3 w-3" />
                {dm.email}
              </a>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
