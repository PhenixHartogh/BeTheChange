import { useParams, Link, useLocation } from 'wouter';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import type { PetitionWithDetails } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { SignatureForm } from '@/components/SignatureForm';
import { ShareButtons } from '@/components/ShareButtons';
import { PetitionAnnouncements } from '@/components/PetitionAnnouncements';
import { PetitionComments } from '@/components/PetitionComments';
import { DecisionMakers } from '@/components/DecisionMakers';
import { ArrowLeft, Users, Target, Calendar, Edit, Trash2, CheckCircle2, XCircle, Mail } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { useAuth } from '@/lib/auth';
import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { HCaptchaWidget } from '@/components/HCaptchaWidget';

const contactOrganizerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').max(100, 'Name must be less than 100 characters'),
  lastName: z.string().min(1, 'Last name is required').max(100, 'Name must be less than 100 characters'),
  email: z.string().email('Valid email is required'),
  phone: z.string().max(20, 'Phone number must be less than 20 characters').optional(),
  message: z.string().min(10, 'Message must be at least 10 characters').max(5000, 'Message must be less than 5000 characters'),
});

type ContactOrganizerForm = z.infer<typeof contactOrganizerSchema>;

export default function PetitionDetail() {
  const { id } = useParams();
  const { user, isAuthenticated } = useAuth();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [, setLocation] = useLocation();
  const [showSignDialog, setShowSignDialog] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showContactDialog, setShowContactDialog] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<'successful' | 'closed' | null>(null);
  const [contactCaptchaToken, setContactCaptchaToken] = useState<string>('');

  const { data: petition, isLoading } = useQuery<PetitionWithDetails>({
    queryKey: ['/api/petitions', id],
    enabled: !!id,
  });

  const contactForm = useForm<ContactOrganizerForm>({
    resolver: zodResolver(contactOrganizerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      message: '',
    },
  });

  const contactMutation = useMutation({
    mutationFn: async (data: ContactOrganizerForm) => {
      if (!contactCaptchaToken) {
        throw new Error('Please complete the captcha verification');
      }
      return apiRequest('POST', `/api/petitions/${id}/contact-organizer`, { ...data, captchaToken: contactCaptchaToken });
    },
    onSuccess: () => {
      toast({
        title: 'Message sent!',
        description: 'Your message has been sent to the petition organizer.',
      });
      setShowContactDialog(false);
      contactForm.reset();
      setContactCaptchaToken('');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to send message',
        variant: 'destructive',
      });
      setContactCaptchaToken(''); // Reset captcha on error
    },
  });

  const updateStatusMutation = useMutation({
    mutationFn: async (status: string) => {
      return apiRequest('PATCH', `/api/petitions/${id}/status`, { status });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/petitions', id] });
      toast({
        title: 'Status updated!',
        description: 'Petition status has been updated successfully.',
      });
      setShowStatusDialog(false);
      setSelectedStatus(null);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update status',
        variant: 'destructive',
      });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: async () => {
      return apiRequest('DELETE', `/api/petitions/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions'] });
      toast({
        title: 'Petition deleted',
        description: 'Your petition has been deleted successfully.',
      });
      setLocation('/profile');
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete petition',
        variant: 'destructive',
      });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse space-y-8">
            <div className="h-96 bg-card rounded-lg" />
            <div className="h-64 bg-card rounded-lg" />
          </div>
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

  const progress = Math.min((petition.signatureCount / petition.signatureGoal) * 100, 100);
  const isCreator = user?.id === petition.createdById;
  const hasUserSigned = petition.hasUserSigned || false;

  return (
    <div className="min-h-screen">
      {/* Hero Image */}
      {petition.imageUrl && (
        <div className="relative h-[400px] w-full overflow-hidden bg-muted">
          <div
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${petition.imageUrl})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-black/70" />
        </div>
      )}

      <div className="py-8 sm:py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <Link href="/browse" data-testid="link-back">
            <Button variant="ghost" className="mb-6" data-testid="button-back">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Petitions
            </Button>
          </Link>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-2 space-y-6">
              <div>
                <Badge className="mb-4" data-testid="badge-category">{petition.category}</Badge>
                <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold mb-4" data-testid="text-title">
                  {petition.title}
                </h1>
                <div className="flex items-center justify-between gap-4">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span data-testid="text-creator">Started by {petition.creator.name}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {formatDistanceToNow(new Date(petition.createdAt), { addSuffix: true })}
                    </span>
                  </div>
                  <ShareButtons petitionTitle={petition.title} petitionId={petition.id} />
                </div>
              </div>

              <Card>
                <CardContent className="pt-6">
                  <p className="text-lg whitespace-pre-wrap leading-relaxed" data-testid="text-description">
                    {petition.description}
                  </p>
                </CardContent>
              </Card>

              {/* Decision Makers */}
              <DecisionMakers petitionId={petition.id} />

              {/* Announcements */}
              <PetitionAnnouncements petitionId={petition.id} isCreator={isCreator} />

              {/* Comments */}
              <PetitionComments petitionId={petition.id} canComment={hasUserSigned} />

              {/* Recent Signatures */}
              {petition.signatures.length > 0 && (
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Signatures</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {petition.signatures.slice(0, 10).map((signature) => (
                        <div 
                          key={signature.id} 
                          className="flex items-center justify-between py-2 border-b last:border-0"
                          data-testid={`signature-${signature.id}`}
                        >
                          <div>
                            <p className="font-medium">
                              {signature.firstName} {signature.lastName.charAt(0)}.
                            </p>
                            <p className="text-sm text-muted-foreground">{signature.postcode}</p>
                          </div>
                          <p className="text-xs text-muted-foreground">
                            {formatDistanceToNow(new Date(signature.createdAt), { addSuffix: true })}
                          </p>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-20 space-y-6">
                {/* Signature Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Signatures
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-4xl font-bold" data-testid="text-signature-count">
                          {petition.signatureCount.toLocaleString()}
                        </span>
                        <span className="text-muted-foreground">
                          of {petition.signatureGoal.toLocaleString()}
                        </span>
                      </div>
                      <Progress value={progress} className="h-3" data-testid="progress-signatures" />
                    </div>

                    {!hasUserSigned && !isCreator && (
                      <Button
                        className="w-full"
                        size="lg"
                        onClick={() => setShowSignDialog(true)}
                        data-testid="button-sign"
                      >
                        Sign This Petition
                      </Button>
                    )}

                    {hasUserSigned && (
                      <div className="text-center py-4 bg-primary/10 rounded-md">
                        <p className="font-medium text-primary">You've signed this petition</p>
                      </div>
                    )}

                    {isCreator && (
                      <Link href={`/petition/${petition.id}/signatures`} data-testid="link-view-signatures">
                        <Button className="w-full" variant="outline" data-testid="button-view-signatures">
                          View All Signatures
                        </Button>
                      </Link>
                    )}
                  </CardContent>
                </Card>

                {/* Manage Petition (Creator Only) */}
                {isCreator && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Manage Petition</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <Link href={`/petition/${petition.id}/edit`} data-testid="link-edit">
                        <Button className="w-full" variant="outline" data-testid="button-edit">
                          <Edit className="mr-2 h-4 w-4" />
                          Edit Petition
                        </Button>
                      </Link>
                      
                      {petition.status === 'active' && (
                        <>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                              setSelectedStatus('successful');
                              setShowStatusDialog(true);
                            }}
                            data-testid="button-mark-successful"
                          >
                            <CheckCircle2 className="mr-2 h-4 w-4" />
                            Mark as Won
                          </Button>
                          <Button
                            className="w-full"
                            variant="outline"
                            onClick={() => {
                              setSelectedStatus('closed');
                              setShowStatusDialog(true);
                            }}
                            data-testid="button-mark-closed"
                          >
                            <XCircle className="mr-2 h-4 w-4" />
                            Mark as Closed
                          </Button>
                        </>
                      )}

                      {petition.status !== 'active' && (
                        <div className="text-center py-2 px-3 rounded-md border">
                          <p className="text-sm font-medium">
                            Status: <span className="capitalize">{petition.status}</span>
                          </p>
                        </div>
                      )}
                      
                      <Button
                        className="w-full"
                        variant="destructive"
                        onClick={() => setShowDeleteDialog(true)}
                        data-testid="button-delete"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete Petition
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Contact Organizer */}
                {!isCreator && (
                  <Card>
                    <CardHeader>
                      <CardTitle>Contact Organizer</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <Button
                        className="w-full"
                        variant="outline"
                        onClick={() => setShowContactDialog(true)}
                        data-testid="button-contact-organizer"
                      >
                        <Mail className="mr-2 h-4 w-4" />
                        Send Message
                      </Button>
                    </CardContent>
                  </Card>
                )}

                {/* Goal Info */}
                <Card>
                  <CardContent className="pt-6 space-y-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0">
                        <Target className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <p className="font-semibold">Signature Goal</p>
                        <p className="text-sm text-muted-foreground">
                          {petition.signatureGoal.toLocaleString()} signatures needed
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sign Dialog */}
      <Dialog open={showSignDialog} onOpenChange={setShowSignDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Sign This Petition</DialogTitle>
            <DialogDescription>
              Your information will be visible to the petition organizer
            </DialogDescription>
          </DialogHeader>
          <SignatureForm petitionId={petition.id} onSuccess={() => setShowSignDialog(false)} />
        </DialogContent>
      </Dialog>

      {/* Status Update Dialog */}
      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>
              {selectedStatus === 'successful' ? 'Mark Petition as Won' : 'Mark Petition as Closed'}
            </AlertDialogTitle>
            <AlertDialogDescription>
              {selectedStatus === 'successful' 
                ? 'This will mark your petition as successful. This action cannot be undone. The petition will remain visible but no new signatures will be accepted.'
                : 'This will close your petition. This action cannot be undone. The petition will remain visible but no new signatures will be accepted.'}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-status">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedStatus && updateStatusMutation.mutate(selectedStatus)}
              disabled={updateStatusMutation.isPending}
              data-testid="button-confirm-status"
            >
              {updateStatusMutation.isPending ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Petition</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this petition? This will permanently delete the petition and all of its signatures. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel data-testid="button-cancel-delete">Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => deleteMutation.mutate()}
              disabled={deleteMutation.isPending}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              data-testid="button-confirm-delete"
            >
              {deleteMutation.isPending ? 'Deleting...' : 'Delete Petition'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Contact Organizer Dialog */}
      <Dialog open={showContactDialog} onOpenChange={setShowContactDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Contact Petition Organizer</DialogTitle>
            <DialogDescription>
              Send a message to {petition.creator.name} about this petition
            </DialogDescription>
          </DialogHeader>
          <Form {...contactForm}>
            <form onSubmit={contactForm.handleSubmit((data) => contactMutation.mutate(data))} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={contactForm.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-contact-first-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={contactForm.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input {...field} data-testid="input-contact-last-name" />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={contactForm.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" {...field} data-testid="input-contact-email" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone (optional)</FormLabel>
                    <FormControl>
                      <Input type="tel" {...field} data-testid="input-contact-phone" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={contactForm.control}
                name="message"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Message</FormLabel>
                    <FormControl>
                      <Textarea 
                        {...field} 
                        rows={5}
                        placeholder="Write your message to the petition organizer..."
                        data-testid="input-contact-message"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <HCaptchaWidget onVerify={setContactCaptchaToken} />
              <DialogFooter>
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowContactDialog(false)}
                  data-testid="button-cancel-contact"
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  disabled={contactMutation.isPending}
                  data-testid="button-send-message"
                >
                  {contactMutation.isPending ? 'Sending...' : 'Send Message'}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
}