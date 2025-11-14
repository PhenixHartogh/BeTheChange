import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { insertSignatureSchema, type InsertSignature } from '@shared/schema';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { apiRequest } from '@/lib/queryClient';
import { useToast } from '@/hooks/use-toast';
import { CheckCircle2 } from 'lucide-react';
import { HCaptchaWidget } from './HCaptchaWidget';

interface SignatureFormProps {
  petitionId: string;
  onSuccess?: () => void;
}

export function SignatureForm({ petitionId, onSuccess }: SignatureFormProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();
  const [isSuccess, setIsSuccess] = useState(false);
  const [captchaToken, setCaptchaToken] = useState<string>('');

  const form = useForm<InsertSignature>({
    resolver: zodResolver(insertSignatureSchema),
    defaultValues: {
      petitionId,
      firstName: '',
      lastName: '',
      email: '',
      phoneNumber: '',
      postcode: '',
      consentToShare: true,
    },
  });

  const signMutation = useMutation({
    mutationFn: async (data: InsertSignature) => {
      if (!captchaToken) {
        throw new Error('Please complete the captcha verification');
      }
      return apiRequest('POST', '/api/signatures', { ...data, captchaToken });
    },
    onSuccess: () => {
      setIsSuccess(true);
      queryClient.invalidateQueries({ queryKey: ['/api/petitions', petitionId] });
      queryClient.invalidateQueries({ queryKey: ['/api/petitions'] });
      toast({
        title: 'Signature added!',
        description: 'Check your email to verify your signature.',
      });
      onSuccess?.();
    },
    onError: (error: any) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to sign petition',
        variant: 'destructive',
      });
      setCaptchaToken(''); // Reset captcha on error
    },
  });

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center py-12 px-6 text-center">
        <CheckCircle2 className="h-16 w-16 text-primary mb-4" />
        <h3 className="text-2xl font-bold mb-2">Thank you for signing!</h3>
        <p className="text-muted-foreground">
          Your voice has been added to this petition. Share it with others to increase its impact.
        </p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit((data) => signMutation.mutate(data))} className="space-y-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-firstname" placeholder="John" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="lastName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Last Name</FormLabel>
                <FormControl>
                  <Input {...field} data-testid="input-lastname" placeholder="Doe" />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input {...field} type="email" data-testid="input-email" placeholder="john.doe@example.com" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number (Optional)</FormLabel>
              <FormControl>
                <Input {...field} type="tel" data-testid="input-phone" placeholder="+44 7700 900000" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="postcode"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Postcode</FormLabel>
              <FormControl>
                <Input {...field} data-testid="input-postcode" placeholder="SW1A 1AA" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

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
            disabled={signMutation.isPending || !captchaToken}
            data-testid="button-submit-signature"
          >
            {signMutation.isPending ? 'Signing...' : 'Sign This Petition'}
          </Button>

          <p className="text-xs text-center text-muted-foreground">
            By pressing "Sign this Petition", you consent to having this information will be shared with the petition creator, and give consent to the petition creator to give this information to decision makers. You also agree that you have not signed this petition more than once, as doing so may be a crime.
          </p>

          <p className="text-xs text-center text-muted-foreground">
            Check your email after signing to verify your signature
          </p>
        </div>
      </form>
    </Form>
  );
}