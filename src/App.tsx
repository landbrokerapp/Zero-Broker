import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { LanguageProvider } from "@/contexts/LanguageContext";
import { FavoritesProvider } from "@/contexts/FavoritesContext";
import { PropertyProvider } from "@/contexts/PropertyContext";
import Index from "./pages/Index";
import Properties from "./pages/Properties";
import PropertyDetail from "./pages/PropertyDetail";
import Auth from "./pages/Auth";
import PostProperty from "./pages/PostProperty";
import MyProperties from "./pages/MyProperties";
import Favorites from "./pages/Favorites";
import NotFound from "./pages/NotFound";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./components/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminProperties from "./pages/admin/AdminProperties";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminPostProperty from "./pages/admin/AdminPostProperty";
import AdminSettings from "./pages/admin/AdminSettings";
import ProtectedRoute from "./components/admin/ProtectedRoute";
import ScrollToTop from "./components/ScrollToTop";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <ScrollToTop />
      <AuthProvider>
        <LanguageProvider>
          <FavoritesProvider>
            <PropertyProvider>
              <TooltipProvider>
                <Toaster />
                <Sonner />
                <Routes>
                  {/* Public Routes */}
                  <Route path="/" element={<Index />} />
                  <Route path="/properties" element={<Properties />} />
                  <Route path="/property/:id" element={<PropertyDetail />} />
                  <Route path="/auth" element={<Auth />} />
                  <Route path="/post-property" element={<PostProperty />} />
                  <Route path="/my-properties" element={<MyProperties />} />
                  <Route path="/favorites" element={<Favorites />} />

                  {/* Admin Routes */}
                  <Route path="/admin/login" element={<AdminLogin />} />

                  <Route element={<ProtectedRoute />}>
                    <Route path="/admin" element={<AdminLayout />}>
                      <Route index element={<AdminDashboard />} />
                      <Route path="properties" element={<AdminProperties />} />
                      <Route path="users" element={<AdminUsers />} />
                      <Route path="post-property" element={<AdminPostProperty />} />
                      <Route path="settings" element={<AdminSettings />} />
                    </Route>
                  </Route>

                  <Route path="*" element={<NotFound />} />
                </Routes>
              </TooltipProvider>
            </PropertyProvider>
          </FavoritesProvider>
        </LanguageProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

export default App;
