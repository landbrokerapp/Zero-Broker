import React from 'react';
import { Link } from 'react-router-dom';
import { Building, ArrowLeft, Clock, CheckCircle, Edit2, Archive, Trash2, Eye, EyeOff } from 'lucide-react';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { PropertyCard } from '@/components/PropertyCard';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';

export default function MyProperties() {
  const { isAuthenticated } = useAuth();
  const { userProperties, archiveProperty, deleteProperty } = useProperties();

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="font-display text-2xl font-bold mb-4">Please Login</h1>
          <p className="text-muted-foreground mb-6">
            You need to login to view your properties
          </p>
          <Link to="/auth?redirect=/my-properties">
            <Button className="bg-gradient-hero text-primary-foreground">
              Login Now
            </Button>
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Header />

      <main className="container mx-auto px-4 py-8">
        {/* Page Header */}
        <div className="mb-8">
          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-4">
            <ArrowLeft className="w-4 h-4" />
            Back to Home
          </Link>
          <h1 className="font-display text-3xl font-bold text-foreground mb-2">
            My Properties
          </h1>
          <p className="text-muted-foreground">
            Manage your listed properties
          </p>
        </div>

        {/* Properties List */}
        {userProperties.length > 0 ? (
          <div className="space-y-6">
            {/* Status Legend */}
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2">
                <Clock className="w-4 h-4 text-warning" />
                <span className="text-muted-foreground">Pending Verification</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle className="w-4 h-4 text-accent" />
                <span className="text-muted-foreground">Approved</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {userProperties.map((property) => (
                <div key={property.id} className="group relative flex flex-col">
                  <PropertyCard property={property} />

                  {/* Status Overlay Badge */}
                  <div className="absolute top-4 right-4 z-10">
                    <Badge
                      variant="secondary"
                      className={property.status === 'archived'
                        ? 'bg-neutral-500/10 text-neutral-500 border-neutral-500'
                        : property.verified
                          ? 'bg-accent/10 text-accent border-accent'
                          : 'bg-warning/10 text-warning border-warning'
                      }
                    >
                      {property.status === 'archived' ? (
                        <><EyeOff className="w-3 h-3 mr-1" /> Archived</>
                      ) : property.verified ? (
                        <><CheckCircle className="w-3 h-3 mr-1" /> Approved</>
                      ) : (
                        <><Clock className="w-3 h-3 mr-1" /> Pending</>
                      )}
                    </Badge>
                  </div>

                  {/* Actions Overlay */}
                  <div className="mt-4 flex items-center justify-between gap-2 p-1 bg-muted/50 rounded-xl border border-border/50">
                    <Link to={`/edit-property/${property.id}`} className="flex-1">
                      <Button variant="ghost" size="sm" className="w-full h-9 gap-2 hover:bg-white dark:hover:bg-neutral-800">
                        <Edit2 className="w-4 h-4 text-blue-500" />
                        <span className="text-xs font-medium">Edit</span>
                      </Button>
                    </Link>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => archiveProperty(property.id, property.status === 'archived' ? 'active' : 'archived')}
                      className="flex-1 h-9 gap-2 hover:bg-white dark:hover:bg-neutral-800"
                    >
                      {property.status === 'archived' ? (
                        <><Eye className="w-4 h-4 text-green-500" /><span className="text-xs font-medium">Restore</span></>
                      ) : (
                        <><Archive className="w-4 h-4 text-amber-500" /><span className="text-xs font-medium">Archive</span></>
                      )}
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this listing permanently?')) {
                          deleteProperty(property.id);
                        }
                      }}
                      className="h-9 w-9 p-0 hover:bg-destructive/10 text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 rounded-full bg-muted flex items-center justify-center">
              <Building className="w-12 h-12 text-muted-foreground" />
            </div>
            <h3 className="font-display text-xl font-semibold text-foreground mb-2">
              No properties listed yet
            </h3>
            <p className="text-muted-foreground mb-6">
              Start by posting your first property
            </p>
            <Link to="/post-property">
              <Button className="bg-gradient-hero text-primary-foreground">
                Post Property
              </Button>
            </Link>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
