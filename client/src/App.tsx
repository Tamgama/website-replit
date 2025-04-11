import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import ValoracionPage from "@/pages/ValoracionPage";
import CustomValuationPage from "@/pages/CustomValuationPage";
import ValuationResultPage from "@/pages/ValuationResultPage";
import LoginPage from "@/pages/LoginPage";
import RegisterPage from "@/pages/RegisterPage";
import SecretSalePage from "@/pages/SecretSalePage";
import AgencyDashboardPage from "@/pages/AgencyDashboardPage";
import PrivacyPage from "@/pages/PrivacyPage";
import TermsPage from "@/pages/TermsPage";
import CookiesPage from "@/pages/CookiesPage";
import NotFound from "@/pages/not-found";
import Header from "@/components/layout/Header";
import Footer from "@/components/layout/Footer";

function Router() {
  return (
    <Switch>
      <Route path="/" component={CustomValuationPage} />
      <Route path="/valoracion-old" component={ValoracionPage} />
      <Route path="/valoracion-resultado/:userId" component={ValuationResultPage} />
      <Route path="/valoracion-resultado" component={ValuationResultPage} />
      <Route path="/login" component={LoginPage} />
      <Route path="/register" component={RegisterPage} />
      <Route path="/ventas-secretas" component={SecretSalePage} />
      <Route path="/secret-sale" component={SecretSalePage} />
      <Route path="/panel-agencia" component={AgencyDashboardPage} />
      <Route path="/agency-dashboard" component={AgencyDashboardPage} />
      <Route path="/privacidad" component={PrivacyPage} />
      <Route path="/terminos" component={TermsPage} />
      <Route path="/cookies" component={CookiesPage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex flex-col min-h-screen">
        <Header />
        <main className="flex-grow">
          <Router />
        </main>
        <Footer />
      </div>
      <Toaster />
    </QueryClientProvider>
  );
}

export default App;