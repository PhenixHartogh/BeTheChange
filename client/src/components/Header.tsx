import { Link, useLocation } from 'wouter';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/lib/auth';
import { PenLine, User, LogOut, Search } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export function Header() {
  const { user, isAuthenticated, loginWithRedirect, logout } = useAuth();
  const [location] = useLocation();

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between gap-4">
          <Link href="/" data-testid="link-home">
            <div className="flex items-center gap-2 hover-elevate active-elevate-2 rounded-md px-3 py-2 -ml-3">
              <PenLine className="h-6 w-6 text-primary" />
              <span className="text-xl font-bold">Be the Change</span>
            </div>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link href="/browse" data-testid="link-header-search">
              <Button 
                variant="ghost" 
                size="icon"
                data-testid="button-header-search"
                aria-label="Search petitions"
              >
                <Search className="h-5 w-5" />
              </Button>
            </Link>
            <Link href="/browse" data-testid="link-browse">
              <Button 
                variant={location === '/browse' ? 'secondary' : 'ghost'}
                data-testid="button-browse"
              >
                Browse Petitions
              </Button>
            </Link>
          </nav>

          <div className="flex items-center gap-2">
            {isAuthenticated ? (
              <>
                <Link href="/create" data-testid="link-create-petition">
                  <Button data-testid="button-start-petition" className="hidden sm:flex">
                    Start a Petition
                  </Button>
                </Link>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" data-testid="button-user-menu" className="rounded-full">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={user?.picture || undefined} alt={user?.name || 'User'} />
                        <AvatarFallback>{user?.name?.charAt(0) || 'U'}</AvatarFallback>
                      </Avatar>
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end" className="w-56">
                    <div className="px-2 py-1.5">
                      <p className="text-sm font-medium" data-testid="text-user-name">{user?.name}</p>
                      <p className="text-xs text-muted-foreground" data-testid="text-user-email">{user?.email}</p>
                    </div>
                    <DropdownMenuSeparator />
                    <Link href="/profile" data-testid="link-profile">
                      <DropdownMenuItem data-testid="button-profile">
                        <User className="mr-2 h-4 w-4" />
                        My Profile
                      </DropdownMenuItem>
                    </Link>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={logout} data-testid="button-logout">
                      <LogOut className="mr-2 h-4 w-4" />
                      Logout
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={loginWithRedirect} data-testid="button-login">
                  Login
                </Button>
                <Button onClick={loginWithRedirect} data-testid="button-signup" className="hidden sm:flex">
                  Sign Up
                </Button>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}