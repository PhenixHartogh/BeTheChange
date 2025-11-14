import { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { updatePetitionSchema, type UpdatePetition, type PetitionWithDetails } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useLocation, useRoute } from 'wouter';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { Link } from 'wouter';

const categories = [
  'Environment',
  'Social Justice',
  'Education',
  'Healthcare',
  'Animal Rights',
  'Human Rights',
  'Politics',
  'Technology',
  'Other',
];

export default function EditPetition() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, user, loginWithRedirect } = useAuth();
  const [, setLocation] = useLocation();
  const [, params] = useRoute('/petition/:id/edit');
  const petitionId = params?.id;

  const { data: petition, isLoading: petitionLoading } = useQuery<PetitionWithDetails>({
    queryKey: ['/api/petitions', petitionId],
    enabled: !!petitionId,
  });

  const form = useForm<UpdatePetition>({
    resolver: zodResolver(updatePetitionSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Environment',
      imageUrl: '',
      signatureGoal: 100,
    },
  });

  useEffect(() => {
    if (petition) {
      form.reset({
        title: petition.title,
        description: petition.description,
        category: petition.category,
        imageUrl: petition.imageUrl || '',
        signatureGoal: petition.signatureGoal,
      });
    }
  }, [petition, form]);

  const updateMutation = useMutation({
    mutationFn: async (data: UpdatePetition) => {
      return apiRequest('PUT', `/api/petitions/${petitionId}`, data);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions'] });
      queryClient.invalidateQueries({ queryKey: ['/api/petitions', petitionId] });
      toast({
        title: 'Petition updated!',
        description: 'Your changes have been saved successfully.',
      });
      setLocation(`/petition/${petitionId}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update petition',
        variant: 'destructive',
      });
    },
  });

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to be signed in to edit a petition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={loginWithRedirect} className="w-full" data-testid="button-login-required">
              Sign In
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (petitionLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <p>Loading petition...</p>
        </div>
      </div>
    );
  }

  if (!petition) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Petition Not Found</CardTitle>
            <CardDescription>
              The petition you're trying to edit doesn't exist
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href="/">
              <Button className="w-full" data-testid="button-go-home">
                Go Home
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (petition.createdById !== user?.id) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Access Denied</CardTitle>
            <CardDescription>
              You don't have permission to edit this petition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Link href={`/petition/${petitionId}`}>
              <Button className="w-full" data-testid="button-view-petition">
                View Petition
              </Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Link href={`/petition/${petitionId}`} data-testid="link-back">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Edit Petition</h1>
          <p className="text-lg text-muted-foreground">
            Update your petition details
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Petition Details</CardTitle>
            <CardDescription>
              Make changes to your petition below
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => updateMutation.mutate(data))} className="space-y-6">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Petition Title</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="e.g., Save Our Local Park from Development"
                          data-testid="input-title"
                        />
                      </FormControl>
                      <FormDescription>
                        Make it clear, concise, and compelling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea
                          {...field}
                          placeholder="Explain why this petition matters and what change you want to see..."
                          rows={8}
                          data-testid="input-description"
                        />
                      </FormControl>
                      <FormDescription>
                        Provide context and explain the impact of your petition
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="category"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Category</FormLabel>
                        <Select onValueChange={field.onChange} value={field.value}>
                          <FormControl>
                            <SelectTrigger data-testid="select-category">
                              <SelectValue />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {categories.map((category) => (
                              <SelectItem key={category} value={category}>
                                {category}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="signatureGoal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Signature Goal</FormLabel>
                        <FormControl>
                          <Input
                            {...field}
                            type="number"
                            min={10}
                            max={1000000}
                            onChange={(e) => field.onChange(parseInt(e.target.value))}
                            data-testid="input-goal"
                          />
                        </FormControl>
                        <FormDescription>
                          Between 10 and 1,000,000
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="imageUrl"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Image URL (Optional)</FormLabel>
                      <FormControl>
                        <Input
                          {...field}
                          value={field.value || ''}
                          placeholder="https://example.com/image.jpg"
                          data-testid="input-image"
                        />
                      </FormControl>
                      <FormDescription>
                        Add an image to make your petition more compelling
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setLocation(`/petition/${petitionId}`)}
                    data-testid="button-cancel"
                  >
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1"
                    disabled={updateMutation.isPending}
                    data-testid="button-submit"
                  >
                    {updateMutation.isPending ? 'Saving...' : 'Save Changes'}
                  </Button>
                </div>
              </form>
            </Form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
