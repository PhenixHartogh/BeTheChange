import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useToast } from '@/hooks/use-toast';
import { Megaphone, Plus } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import type { Announcement } from '@shared/schema';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';

interface PetitionAnnouncementsProps {
  petitionId: string;
  isCreator: boolean;
}

export function PetitionAnnouncements({ petitionId, isCreator }: PetitionAnnouncementsProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');

  const { data: announcements = [], isLoading } = useQuery<Announcement[]>({
    queryKey: ['/api/petitions', petitionId, 'announcements'],
    queryFn: () => fetch(`/api/petitions/${petitionId}/announcements`).then(r => r.json()),
  });

  const createMutation = useMutation({
    mutationFn: async () => {
      if (!title.trim() || !content.trim()) {
        throw new Error('Please fill in all fields');
      }
      return apiRequest('POST', `/api/petitions/${petitionId}/announcements`, {
        petitionId,
        title,
        content,
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions', petitionId, 'announcements'] });
      setShowCreateDialog(false);
      setTitle('');
      setContent('');
      toast({
        title: 'Announcement posted!',
        description: 'All verified signers will receive an email notification.',
      });
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to post announcement',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcements
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
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Megaphone className="h-5 w-5" />
            Announcements
          </CardTitle>
          {isCreator && (
            <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
              <DialogTrigger asChild>
                <Button size="sm" data-testid="button-create-announcement">
                  <Plus className="h-4 w-4 mr-1" />
                  Post Update
                </Button>
              </DialogTrigger>
              <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                  <DialogTitle>Post Announcement</DialogTitle>
                  <DialogDescription>
                    Send an update to all verified petition signers via email
                  </DialogDescription>
                </DialogHeader>
                <div className="space-y-4 py-4">
                  <div>
                    <label className="text-sm font-medium mb-2 block">Title</label>
                    <Input
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g., Petition Update: Major Progress!"
                      data-testid="input-announcement-title"
                    />
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">Message</label>
                    <Textarea
                      value={content}
                      onChange={(e) => setContent(e.target.value)}
                      placeholder="Share your update with supporters..."
                      rows={6}
                      data-testid="textarea-announcement-content"
                    />
                  </div>
                  <Button
                    onClick={() => createMutation.mutate()}
                    disabled={createMutation.isPending || !title.trim() || !content.trim()}
                    className="w-full"
                    data-testid="button-submit-announcement"
                  >
                    {createMutation.isPending ? 'Posting...' : 'Post Announcement'}
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          )}
        </div>
        {!isCreator && <CardDescription>Updates from the petition organizer</CardDescription>}
      </CardHeader>
      <CardContent>
        {announcements.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No announcements yet
          </p>
        ) : (
          <div className="space-y-4">
            {announcements.map((announcement) => (
              <div
                key={announcement.id}
                className="border rounded-lg p-4 space-y-2"
                data-testid={`announcement-${announcement.id}`}
              >
                <div className="flex items-start justify-between gap-4">
                  <h4 className="font-semibold">{announcement.title}</h4>
                  <span className="text-xs text-muted-foreground whitespace-nowrap">
                    {formatDistanceToNow(new Date(announcement.createdAt), { addSuffix: true })}
                  </span>
                </div>
                <p className="text-sm text-muted-foreground whitespace-pre-wrap">
                  {announcement.content}
                </p>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
