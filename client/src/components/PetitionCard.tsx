import { Link } from 'wouter';
import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import type { PetitionWithCreator } from '@shared/schema';
import { formatDistanceToNow } from 'date-fns';
import { Users } from 'lucide-react';

interface PetitionCardProps {
  petition: PetitionWithCreator;
}

export function PetitionCard({ petition }: PetitionCardProps) {
  const signatureCount = petition._count?.signatures || 0;
  const progress = Math.min((signatureCount / petition.signatureGoal) * 100, 100);

  return (
    <Link href={`/petition/${petition.id}`} data-testid={`link-petition-${petition.id}`}>
      <Card className="hover-elevate active-elevate-2 transition-all h-full flex flex-col overflow-hidden">
        {petition.imageUrl && (
          <div className="aspect-video w-full overflow-hidden bg-muted">
            <img
              src={petition.imageUrl}
              alt={petition.title}
              className="h-full w-full object-cover"
              data-testid={`img-petition-${petition.id}`}
            />
          </div>
        )}
        <CardHeader className="flex-none">
          <div className="flex items-start justify-between gap-2 mb-2">
            <Badge variant="secondary" data-testid={`badge-category-${petition.id}`}>
              {petition.category}
            </Badge>
          </div>
          <h3 className="text-xl font-bold line-clamp-2" data-testid={`text-title-${petition.id}`}>
            {petition.title}
          </h3>
        </CardHeader>
        <CardContent className="flex-1">
          <p className="text-sm text-muted-foreground line-clamp-3" data-testid={`text-description-${petition.id}`}>
            {petition.description}
          </p>
        </CardContent>
        <CardFooter className="flex-col gap-3 items-start flex-none">
          <div className="w-full space-y-1">
            <div className="flex items-center justify-between text-sm">
              <span className="flex items-center gap-1.5 font-medium">
                <Users className="h-4 w-4" />
                <span data-testid={`text-signatures-${petition.id}`}>
                  {signatureCount.toLocaleString()} signatures
                </span>
              </span>
              <span className="text-muted-foreground">
                Goal: {petition.signatureGoal.toLocaleString()}
              </span>
            </div>
            <Progress value={progress} className="h-2" data-testid={`progress-${petition.id}`} />
          </div>
          <div className="flex items-center justify-between w-full text-xs text-muted-foreground">
            <span data-testid={`text-creator-${petition.id}`}>by {petition.creator.name}</span>
            <span data-testid={`text-time-${petition.id}`}>
              {formatDistanceToNow(new Date(petition.createdAt), { addSuffix: true })}
            </span>
          </div>
        </CardFooter>
      </Card>
    </Link>
  );
}