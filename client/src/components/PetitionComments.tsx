import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Comment } from '@shared/schema';

interface PetitionCommentsProps {
  petitionId: string;
  canComment?: boolean;
}

export function PetitionComments({ petitionId, canComment }: PetitionCommentsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');

  const { data: comments = [], isLoading } = useQuery<Comment[]>({
    queryKey: ['/api/petitions', petitionId, 'comments'],
    queryFn: () => fetch(`/api/petitions/${petitionId}/comments`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!comment.trim()) {
        throw new Error('Please enter a comment');
      }
      if (!canComment) {
        throw new Error('You must sign the petition while you are logged in to comment');
      }
      return apiRequest('POST', `/api/petitions/${petitionId}/comments`, {
        petitionId,
        comment: comment.trim(),
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions', petitionId, 'comments'] });
      setComment('');
      toast({
        title: 'Comment posted!',
        description: 'Your comment has been added to the petition.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post comment',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <MessageSquare className="h-5 w-5" />
            Comments
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

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <MessageSquare className="h-5 w-5" />
          Comments ({comments.length})
        </CardTitle>
        <CardDescription>
          Share why this petition matters to you
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        {canComment && (
          <div className="space-y-3">
            <Textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your thoughts about this petition..."
              rows={3}
              data-testid="textarea-comment"
            />
            <Button
              onClick={() => createMutation.mutate()}
              disabled={createMutation.isPending || !comment.trim()}
              data-testid="button-submit-comment"
            >
              {createMutation.isPending ? 'Posting...' : 'Post Comment'}
            </Button>
          </div>
        )}

        {!canComment && (
          <p className="text-sm text-muted-foreground text-center py-4 border rounded-lg">
            Sign and verify your email to leave a comment
          </p>
        )}

        {comments.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No comments yet. Be the first to share your thoughts!
          </p>
        ) : (
          <div className="space-y-4">
            {comments.map((commentItem) => (
              <div
                key={commentItem.id}
                className="border rounded-lg p-4 space-y-2"
                data-testid={`comment-${commentItem.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="font-medium">
                      {commentItem.firstName} {commentItem.lastName.charAt(0)}.
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {formatDistanceToNow(new Date(commentItem.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
                <p className="text-sm whitespace-pre-wrap">{commentItem.comment}</p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
