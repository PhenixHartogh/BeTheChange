import { useEffect } from "react";
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { AuthProvider } from "@/lib/auth";
import { Header } from "@/components/Header";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { initGA } from "./lib/analytics";
import { useAnalytics } from "./hooks/use-analytics";
import NotFound from "@/pages/not-found";
import Home from "@/pages/Home";
import Browse from "@/pages/Browse";
import CreatePetition from "@/pages/CreatePetition";
import PetitionDetail from "@/pages/PetitionDetail";
import EditPetition from "@/pages/EditPetition";
import PetitionSignatures from "@/pages/PetitionSignatures";
import Profile from "@/pages/Profile";
import VerifySignature from "@/pages/VerifySignature";
import ContactUs from "@/pages/ContactUs";
import TermsAndConditions from "@/pages/TermsAndConditions";
import PrivacyPolicy from "@/pages/PrivacyPolicy";
import CookiePolicy from "@/pages/CookiePolicy";
import AccessibilityStatement from "@/pages/AccessibilityStatement";
import CommunityGuidelines from "@/pages/CommunityGuidelines";

function Router() {
  // Track page views when routes change
  useAnalytics();

  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/browse" component={Browse} />
      <Route path="/create" component={CreatePetition} />
      <Route path="/petition/:id" component={PetitionDetail} />
      <Route path="/petition/:id/edit" component={EditPetition} />
      <Route path="/petition/:id/signatures" component={PetitionSignatures} />
      <Route path="/profile" component={Profile} />
      <Route path="/verify" component={VerifySignature} />
      <Route path="/contact" component={ContactUs} />
      <Route path="/terms" component={TermsAndConditions} />
      <Route path="/privacy" component={PrivacyPolicy} />
      <Route path="/cookies" component={CookiePolicy} />
      <Route path="/accessibility" component={AccessibilityStatement} />
      <Route path="/community-guidelines" component={CommunityGuidelines} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  // Initialize Google Analytics when app loads
  useEffect(() => {
    // Check for cookie consent before initializing
    const hasConsent = localStorage.getItem('cookie-consent') === 'accepted';
    
    if (hasConsent && import.meta.env.VITE_GA_MEASUREMENT_ID) {
      initGA();
    } else if (!import.meta.env.VITE_GA_MEASUREMENT_ID) {
      console.warn('Missing required Google Analytics key: VITE_GA_MEASUREMENT_ID');
    }
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <div className="min-h-screen flex flex-col">
            <Header />
            <main className="flex-1">
              <Router />
            </main>
            <Footer />
          </div>
          <CookieConsent />
          <Toaster />
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}

export default App;