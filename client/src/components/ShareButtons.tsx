import { Button } from '@/components/ui/button';
import { Share2, Twitter, Facebook, Mail, Link as LinkIcon } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

interface ShareButtonsProps {
  petitionTitle: string;
  petitionId: string;
}

export function ShareButtons({ petitionTitle, petitionId }: ShareButtonsProps) {
  const { toast } = useToast();
  const url = `${window.location.origin}/petition/${petitionId}`;
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(petitionTitle);

  const copyToClipboard = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: 'Link copied!',
      description: 'Share this petition with others',
    });
  };

  const shareLinks = {
    twitter: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
    email: `mailto:?subject=${encodedTitle}&body=I thought you might be interested in this petition: ${encodedUrl}`,
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" data-testid="button-share">
          <Share2 className="mr-2 h-4 w-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-48">
        <DropdownMenuItem onClick={copyToClipboard} data-testid="button-copy-link">
          <LinkIcon className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.twitter} target="_blank" rel="noopener noreferrer" data-testid="button-share-twitter">
            <Twitter className="mr-2 h-4 w-4" />
            Share on Twitter
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.facebook} target="_blank" rel="noopener noreferrer" data-testid="button-share-facebook">
            <Facebook className="mr-2 h-4 w-4" />
            Share on Facebook
          </a>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <a href={shareLinks.email} data-testid="button-share-email">
            <Mail className="mr-2 h-4 w-4" />
            Share via Email
          </a>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}