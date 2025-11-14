import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Share2, Twitter, Facebook, Mail, MessageSquare, Link as LinkIcon, Check } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface ShareButtonProps {
  title: string;
  url: string;
  description?: string;
}

export function ShareButton({ title, url, description }: ShareButtonProps) {
  const [open, setOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const shareData = {
    title,
    url,
    text: description || `Sign this petition: ${title}`,
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast({
        title: 'Link copied!',
        description: 'Share link copied to clipboard',
      });
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      toast({
        title: 'Failed to copy',
        description: 'Please try again',
        variant: 'destructive',
      });
    }
  };

  const shareToTwitter = () => {
    const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareData.text)}&url=${encodeURIComponent(url)}`;
    window.open(twitterUrl, '_blank', 'width=550,height=420');
  };

  const shareToFacebook = () => {
    const facebookUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`;
    window.open(facebookUrl, '_blank', 'width=550,height=420');
  };

  const shareViaEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(`${shareData.text}\n\n${url}`);
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
  };

  const shareViaSMS = () => {
    const message = encodeURIComponent(`${shareData.text} ${url}`);
    window.location.href = `sms:?body=${message}`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" data-testid="button-share">
          <Share2 className="h-4 w-4 mr-2" />
          Share
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Share this petition</DialogTitle>
          <DialogDescription>
            Help spread the word about this petition
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-3 py-4">
          <Button
            variant="outline"
            onClick={shareToTwitter}
            className="justify-start"
            data-testid="button-share-twitter"
          >
            <Twitter className="h-4 w-4 mr-2" />
            Share on Twitter
          </Button>
          <Button
            variant="outline"
            onClick={shareToFacebook}
            className="justify-start"
            data-testid="button-share-facebook"
          >
            <Facebook className="h-4 w-4 mr-2" />
            Share on Facebook
          </Button>
          <Button
            variant="outline"
            onClick={shareViaEmail}
            className="justify-start"
            data-testid="button-share-email"
          >
            <Mail className="h-4 w-4 mr-2" />
            Share via Email
          </Button>
          <Button
            variant="outline"
            onClick={shareViaSMS}
            className="justify-start"
            data-testid="button-share-sms"
          >
            <MessageSquare className="h-4 w-4 mr-2" />
            Share via SMS
          </Button>
          <Button
            variant="outline"
            onClick={handleCopyLink}
            className="justify-start"
            data-testid="button-copy-link"
          >
            {copied ? (
              <Check className="h-4 w-4 mr-2 text-green-600" />
            ) : (
              <LinkIcon className="h-4 w-4 mr-2" />
            )}
            {copied ? 'Copied!' : 'Copy Link'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
