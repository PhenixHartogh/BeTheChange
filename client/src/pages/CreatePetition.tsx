import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertPetitionSchema, type InsertPetition } from '@shared/schema';
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
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { useAuth } from '@/lib/auth';
import { useLocation } from 'wouter';
import { ArrowLeft, Plus, X } from 'lucide-react';
import { Link } from 'wouter';
import { HCaptchaWidget } from '@/components/HCaptchaWidget';

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

type DecisionMaker = {
  name: string;
  title: string;
  email: string;
};

export default function CreatePetition() {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const { isAuthenticated, loginWithRedirect } = useAuth();
  const [, setLocation] = useLocation();
  const [captchaToken, setCaptchaToken] = useState<string>('');
  const [decisionMakers, setDecisionMakers] = useState<DecisionMaker[]>([]);
  const [currentDM, setCurrentDM] = useState<DecisionMaker>({ name: '', title: '', email: '' });

  const form = useForm<InsertPetition>({
    resolver: zodResolver(insertPetitionSchema),
    defaultValues: {
      title: '',
      description: '',
      category: 'Environment',
      imageUrl: '',
      signatureGoal: 100,
    },
  });

  const createMutation = useMutation({
    mutationFn: async (data: InsertPetition) => {
      if (!captchaToken) {
        throw new Error('Please complete the captcha verification');
      }
      return apiRequest('POST', '/api/petitions', { 
        ...data, 
        captchaToken,
        decisionMakers: decisionMakers.length > 0 ? decisionMakers : undefined 
      });
    },
    onSuccess: (data: any) => {
      queryClient.invalidateQueries({ queryKey: ['/api/petitions'] });
      toast({
        title: 'Petition created!',
        description: 'Your petition has been published successfully.',
      });
      setLocation(`/petition/${data.id}`);
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to create petition',
        variant: 'destructive',
      });
      setCaptchaToken(''); // Reset captcha on error
    },
  });

  const addDecisionMaker = () => {
    if (!currentDM.name || !currentDM.email) {
      toast({
        title: 'Missing information',
        description: 'Please enter name and email for the decision maker',
        variant: 'destructive',
      });
      return;
    }

    // Basic email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(currentDM.email)) {
      toast({
        title: 'Invalid email',
        description: 'Please enter a valid email address',
        variant: 'destructive',
      });
      return;
    }

    setDecisionMakers([...decisionMakers, currentDM]);
    setCurrentDM({ name: '', title: '', email: '' });
  };

  const removeDecisionMaker = (index: number) => {
    setDecisionMakers(decisionMakers.filter((_, i) => i !== index));
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center py-12 px-4">
        <Card className="max-w-md w-full">
          <CardHeader>
            <CardTitle>Sign in Required</CardTitle>
            <CardDescription>
              You need to be signed in to create a petition
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

  return (
    <div className="min-h-screen py-8 sm:py-12">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
        <Link href="/" data-testid="link-back">
          <Button variant="ghost" className="mb-6" data-testid="button-back">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
        </Link>

        <div className="mb-8">
          <h1 className="text-3xl sm:text-4xl font-bold mb-4">Start a Petition</h1>
          <p className="text-lg text-muted-foreground">
            Create a petition to drive change on an issue you care about
          </p>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Petition Details</CardTitle>
            <CardDescription>
              Fill in the information below to create your petition
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Form {...form}>
              <form onSubmit={form.handleSubmit((data) => createMutation.mutate(data))} className="space-y-6">
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
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
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

                <div className="space-y-4 border rounded-lg p-4">
                  <div>
                    <h3 className="text-sm font-medium mb-1">Decision Makers (Optional)</h3>
                    <p className="text-xs text-muted-foreground mb-4">
                      Add people in power who can make this change happen
                    </p>
                  </div>

                  {decisionMakers.length > 0 && (
                    <div className="space-y-2 mb-4">
                      {decisionMakers.map((dm, index) => (
                        <div 
                          key={index} 
                          className="flex items-center justify-between p-3 rounded-md border"
                          data-testid={`decision-maker-${index}`}
                        >
                          <div className="flex-1">
                            <p className="font-medium text-sm">{dm.name}</p>
                            {dm.title && <p className="text-xs text-muted-foreground">{dm.title}</p>}
                            <p className="text-xs text-muted-foreground">{dm.email}</p>
                          </div>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeDecisionMaker(index)}
                            data-testid={`button-remove-dm-${index}`}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="space-y-3">
                    <Input
                      placeholder="Name"
                      value={currentDM.name}
                      onChange={(e) => setCurrentDM({ ...currentDM, name: e.target.value })}
                      data-testid="input-dm-name"
                    />
                    <Input
                      placeholder="Title (e.g., Mayor, Minister)"
                      value={currentDM.title}
                      onChange={(e) => setCurrentDM({ ...currentDM, title: e.target.value })}
                      data-testid="input-dm-title"
                    />
                    <Input
                      type="email"
                      placeholder="Email"
                      value={currentDM.email}
                      onChange={(e) => setCurrentDM({ ...currentDM, email: e.target.value })}
                      data-testid="input-dm-email"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addDecisionMaker}
                      className="w-full"
                      data-testid="button-add-dm"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Decision Maker
                    </Button>
                  </div>
                </div>

                <div className="space-y-4">
                  <HCaptchaWidget
                    onVerify={(token) => setCaptchaToken(token)}
                    onExpire={() => setCaptchaToken('')}
                    onError={() => setCaptchaToken('')}
                  />

                  <Button
                    type="submit"
                    className="w-full"
                    size="lg"
                    disabled={createMutation.isPending || !captchaToken}
                    data-testid="button-submit"
                  >
                    {createMutation.isPending ? 'Creating...' : 'Create Petition'}
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