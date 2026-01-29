import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import {
  Upload, MapPin, IndianRupee, Home, Building2, Bed, Maximize,
  Car, Compass, Image as ImageIcon, CheckCircle, ArrowLeft, X, ArrowRight, Droplets
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';

import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useProperties } from '@/contexts/PropertyContext';
import { Property, localities, propertyTypes } from '@/data/mockProperties';

export default function PostProperty() {
  const navigate = useNavigate();
  const { user, isAuthenticated, setUserRole } = useAuth();
  const { addProperty } = useProperties();
  const [step, setStep] = useState(1);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);


  const [formData, setFormData] = useState({
    title: '',
    type: 'apartment',
    intent: 'buy',
    price: '',
    locality: '',
    bhk: '2 BHK',
    furnishing: 'semi-furnished',
    builtUpArea: '',
    carpetArea: '',
    floor: 'Ground',
    totalFloors: '',
    facing: 'East',
    parking: 'None',
    ownershipType: 'freehold',
    amenities: [] as string[],
    description: '',
    images: [] as string[],
    coordinates: null as { lat: number; lng: number } | null,
  });

  // Redirect to auth if not logged in
  React.useEffect(() => {
    if (!isAuthenticated) {
      navigate('/auth?redirect=/post-property');
    } else {
      setUserRole('seller');
    }
  }, [isAuthenticated, navigate, setUserRole]);

  const updateFormData = (field: string, value: string | string[]) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement> | React.DragEvent) => {
    let files: File[] = [];
    if ('files' in e.target && e.target.files) {
      files = Array.from(e.target.files);
    } else if ('dataTransfer' in e && e.dataTransfer.files) {
      files = Array.from(e.dataTransfer.files);
    }

    const validFiles = files.filter(file => {
      const isValidType = ['image/png', 'image/jpeg', 'image/jpg', 'image/webp'].includes(file.type);
      const isValidSize = file.size <= 5 * 1024 * 1024; // 5MB

      if (!isValidType) toast.error(`${file.name} is not a supported format.`);
      if (!isValidSize) toast.error(`${file.name} is too large (max 5MB).`);

      return isValidType && isValidSize;
    });

    validFiles.forEach(file => {
      setSelectedFiles(prev => [...prev, file]);
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData(prev => ({
          ...prev,
          images: [...prev.images, reader.result as string]
        }));
      };
      reader.readAsDataURL(file);
    });
  };

  const removeImage = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
    setFormData(prev => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index)
    }));
  };


  const toggleAmenity = (amenity: string) => {
    setFormData((prev) => ({
      ...prev,
      amenities: prev.amenities.includes(amenity)
        ? prev.amenities.filter((a) => a !== amenity)
        : [...prev.amenities, amenity],
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title || !formData.price || !formData.locality) {
      toast.error('Please fill in all required fields.');
      return;
    }

    if (selectedFiles.length === 0) {
      toast.error('Please upload at least one image.');
      return;
    }

    setIsUploading(true);
    try {
      // 1. Upload to Cloudinary
      const uploadedImageUrls: string[] = [];
      toast.info(`Uploading ${selectedFiles.length} images...`);
      for (const file of selectedFiles) {
        const url = await uploadToCloudinary(file);
        uploadedImageUrls.push(url);
      }

      // 2. Prepare Data
      const propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'> = {
        title: formData.title,
        type: formData.type as Property['type'],
        intent: formData.intent as Property['intent'],
        price: parseInt(formData.price),
        priceUnit: formData.intent === 'buy' ? 'total' : 'month',
        locality: formData.locality,
        city: 'Coimbatore',
        bhk: formData.bhk,
        furnishing: formData.furnishing as Property['furnishing'],
        builtUpArea: parseInt(formData.builtUpArea),
        carpetArea: parseInt(formData.carpetArea),
        floor: formData.floor,
        totalFloors: parseInt(formData.totalFloors),
        facing: formData.facing,
        parking: formData.parking,
        ownershipType: formData.ownershipType as Property['ownershipType'],
        amenities: formData.amenities,
        images: uploadedImageUrls,
        description: formData.description,
        sellerId: user?.id || '',
        sellerName: user?.name || 'Property Owner',
        sellerPhone: user?.phone || '',
        coordinates: formData.coordinates || undefined,
      };

      await addProperty(propertyData);
      setIsSubmitted(true);
      toast.success('Property submitted successfully!');
    } catch (error) {
      console.error('Upload error:', error);
      toast.error('Failed to upload images. Please check your connection.');
    } finally {
      setIsUploading(false);
    }
  };


  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-background">
        <Header />
        <main className="container mx-auto px-4 py-32 flex flex-col items-center justify-center text-center">
          <div className="max-w-md bg-white dark:bg-card p-10 rounded-3xl shadow-2xl border border-border/50">
            <div className="w-20 h-20 mx-auto mb-8 rounded-full bg-green-500/10 flex items-center justify-center">
              <CheckCircle className="w-10 h-10 text-green-500" />
            </div>
            <h1 className="font-display text-4xl font-bold text-foreground mb-6">
              Listing Submitted!
            </h1>
            <p className="text-muted-foreground mb-8 text-lg">
              Thank you! Your property is now being verified by our team and will be live shortly.
            </p>
            <div className="flex flex-col gap-3">
              <Link to="/my-properties" className="w-full">
                <Button className="w-full h-12 text-lg font-semibold bg-primary hover:bg-primary/90 rounded-xl transition-all shadow-lg hover:shadow-primary/25">
                  Manage My Listings
                </Button>
              </Link>
              <Link to="/" className="w-full">
                <Button variant="ghost" className="w-full h-12 text-lg rounded-xl hover:bg-muted font-medium">
                  Go Back Home
                </Button>
              </Link>
            </div>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background dark:bg-neutral-950">
      <Header />

      <main className="container mx-auto px-4 py-12 flex flex-col items-center">
        {/* Centered Form Card */}
        <div className="w-full max-w-2xl bg-white dark:bg-card p-8 md:p-12 rounded-3xl shadow-2xl border border-border/50 backdrop-blur-sm">

          <Link to="/" className="inline-flex items-center gap-2 text-muted-foreground hover:text-primary mb-8 transition-colors group">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            Cancel and Return Home
          </Link>

          <div className="text-center mb-12">
            <h1 className="font-display text-4xl font-bold text-foreground mb-4">
              Post Your Property
            </h1>
            <p className="text-muted-foreground text-lg">
              Share your property details with potential buyers directly.
            </p>
          </div>

          {/* Progress Stepper */}
          <div className="flex items-center justify-between gap-4 mb-12 px-4">
            {[1, 2, 3].map((s) => (
              <React.Fragment key={s}>
                <div className="flex flex-col items-center relative gap-2">
                  <div
                    className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-lg transition-all shadow-md ${step >= s
                      ? 'bg-primary text-primary-foreground scale-110 shadow-primary/20'
                      : 'bg-muted text-muted-foreground'
                      }`}
                  >
                    {step > s ? <CheckCircle className="w-6 h-6" /> : s}
                  </div>
                  <span className={`text-xs font-semibold ${step >= s ? 'text-primary' : 'text-muted-foreground'} uppercase tracking-wider`}>
                    {s === 1 ? 'Start' : s === 2 ? 'Details' : 'Finish'}
                  </span>
                </div>
                {s < 3 && (
                  <div className="flex-1 h-0.5 bg-muted mb-6">
                    <div className={`h-full bg-primary transition-all duration-500 ease-in-out ${step > s ? 'w-full' : 'w-0'}`} />
                  </div>
                )}
              </React.Fragment>
            ))}
          </div>

          <form onSubmit={handleSubmit} className="space-y-10">
            {/* Step 1: Core Basics & Images */}
            {step === 1 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
                <div className="grid gap-6">
                  <div className="space-y-2">
                    <Label className="text-sm font-semibold ml-1">Property Name / Title *</Label>
                    <Input
                      placeholder="e.g. Luxury 2BHK Apartment in Saravanampatti"
                      className="h-12 text-lg rounded-xl border-border/50 bg-muted/30 focus:bg-white dark:focus:bg-neutral-900 transition-all"
                      value={formData.title}
                      onChange={(e) => updateFormData('title', e.target.value)}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Type *</Label>
                      <Select value={formData.type} onValueChange={(v) => updateFormData('type', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                          <SelectValue placeholder="Select type" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {propertyTypes.map((t) => (
                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Purpose *</Label>
                      <Select value={formData.intent} onValueChange={(v) => updateFormData('intent', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                          <SelectValue placeholder="Select" />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          <SelectItem value="buy">For Sale</SelectItem>
                          <SelectItem value="rent">For Rent</SelectItem>
                          <SelectItem value="pg">PG / PG</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>

                  {/* Redesigned Image Upload Container */}
                  <div className="space-y-4">
                    <Label className="text-sm font-semibold ml-1">Property Photos *</Label>

                    <div
                      className={`relative border-2 border-dashed rounded-3xl p-8 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer group ${isDragging ? 'bg-primary/5 border-primary shadow-xl shadow-primary/5' : 'bg-muted/20 border-border/50 hover:border-primary/50'
                        }`}
                      onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }}
                      onDragLeave={() => setIsDragging(false)}
                      onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e); }}
                      onClick={() => document.getElementById('image-upload')?.click()}
                    >
                      <input
                        id="image-upload"
                        type="file"
                        multiple
                        accept="image/png,image/jpeg,image/jpg,image/webp"
                        className="hidden"
                        onChange={handleImageUpload}
                      />
                      <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center group-hover:scale-110 transition-transform duration-300">
                        <Upload className="w-8 h-8 text-primary" />
                      </div>
                      <div className="text-center">
                        <p className="text-lg font-semibold text-foreground">Drag & drop images here</p>
                        <p className="text-sm text-muted-foreground mt-1">PNG, JPG, JPEG or WEBP (Max 5MB each)</p>
                      </div>
                      <Button type="button" variant="outline" className="h-10 rounded-xl px-6 border-primary/20 text-primary hover:bg-primary/5">
                        Browse Files
                      </Button>
                    </div>

                    {/* Image Previews */}
                    {formData.images.length > 0 && (
                      <div className="grid grid-cols-4 md:grid-cols-5 gap-3 mt-4">
                        {formData.images.map((img, idx) => (
                          <div key={idx} className="relative aspect-square rounded-xl overflow-hidden group border border-border/50 shadow-sm">
                            <img src={img} alt="Preview" className="w-full h-full object-cover" />
                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                              <button
                                type="button"
                                onClick={(e) => { e.stopPropagation(); removeImage(idx); }}
                                className="bg-destructive text-white p-2 rounded-full hover:scale-110 transition-transform"
                              >
                                <X className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Locality *</Label>
                      <Select value={formData.locality} onValueChange={(v) => updateFormData('locality', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-muted/30 border-border/50">
                          <SelectValue placeholder="Locality" />
                        </SelectTrigger>
                        <SelectContent className="max-h-60 rounded-xl shadow-xl">
                          {localities.map((loc) => (
                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold ml-1">Expected Price *</Label>
                      <div className="relative">
                        <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          className="h-12 pl-10 rounded-xl bg-muted/30 border-border/50"
                          placeholder="0.00"
                          value={formData.price}
                          onChange={(e) => updateFormData('price', e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                </div>

                <Button
                  type="button"
                  onClick={() => setStep(2)}
                  disabled={!formData.title || !formData.type || !formData.intent || formData.images.length === 0}
                  className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg transition-all group"
                >
                  Continue to Details
                  <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            )}

            {/* Step 2: Property Overview Details */}
            {step === 2 && (
              <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Maximize className="w-5 h-5 text-primary" />
                    Property Overview Details
                  </h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-muted/20 rounded-3xl border border-border/50">
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">BHK Configuration</Label>
                      <Select value={formData.bhk} onValueChange={(v) => updateFormData('bhk', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-background border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map(b => (
                            <SelectItem key={b} value={b}>{b}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Furnishing State</Label>
                      <Select value={formData.furnishing} onValueChange={(v) => updateFormData('furnishing', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-background border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {['unfurnished', 'semi-furnished', 'fully-furnished'].map(f => (
                            <SelectItem key={f} value={f} className="capitalize">{f.replace('-', ' ')}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Built-up Area (sq.ft)</Label>
                      <div className="relative">
                        <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g. 1200"
                          className="h-12 pl-10 rounded-xl bg-background border-border/50"
                          value={formData.builtUpArea}
                          onChange={(e) => updateFormData('builtUpArea', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Carpet Area (sq.ft)</Label>
                      <div className="relative">
                        <Maximize className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                          type="number"
                          placeholder="e.g. 1000"
                          className="h-12 pl-10 rounded-xl bg-background border-border/50"
                          value={formData.carpetArea}
                          onChange={(e) => updateFormData('carpetArea', e.target.value)}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Floor</Label>
                      <Input
                        placeholder="e.g. 3rd"
                        className="h-12 rounded-xl bg-background border-border/50"
                        value={formData.floor}
                        onChange={(e) => updateFormData('floor', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Total Floors</Label>
                      <Input
                        type="number"
                        placeholder="e.g. 5"
                        className="h-12 rounded-xl bg-background border-border/50"
                        value={formData.totalFloors}
                        onChange={(e) => updateFormData('totalFloors', e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Facing Direction</Label>
                      <Select value={formData.facing} onValueChange={(v) => updateFormData('facing', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-background border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                            <SelectItem key={d} value={d}>{d}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-2">
                      <Label className="text-sm font-semibold">Parking</Label>
                      <Select value={formData.parking} onValueChange={(v) => updateFormData('parking', v)}>
                        <SelectTrigger className="h-12 rounded-xl bg-background border-border/50">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent className="rounded-xl shadow-xl">
                          {['None', 'Open', '1 Covered', '2 Covered', '3+ Covered'].map(p => (
                            <SelectItem key={p} value={p}>{p}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(1)} className="flex-1 h-14 text-lg rounded-2xl border-border/50">
                    Previous
                  </Button>
                  <Button type="button" onClick={() => setStep(3)} className="flex-[2] h-14 text-lg font-bold bg-primary rounded-2xl">
                    Continue to Features
                  </Button>
                </div>
              </div>
            )}

            {/* Step 3: About Property & Amenities */}
            {step === 3 && (
              <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <CheckCircle className="w-5 h-5 text-primary" />
                    Amenities
                  </h2>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                    {[
                      { icon: Car, label: 'Parking' },
                      { icon: Home, label: 'Lifts' },
                      { icon: CheckCircle, label: 'Security' },
                      { icon: Maximize, label: 'Gym' },
                      { icon: Building2, label: 'Club House' },
                      { icon: Compass, label: 'Vastu' },
                      { icon: Bed, label: 'Power Backup' },
                      { icon: Droplets, label: 'Borewell' }
                    ].map((item) => (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => toggleAmenity(item.label)}
                        className={`flex items-center gap-3 p-4 rounded-2xl border transition-all text-sm font-medium ${formData.amenities.includes(item.label)
                          ? 'bg-primary/5 border-primary text-primary shadow-sm'
                          : 'bg-muted/10 border-border/50 text-muted-foreground hover:border-primary/50'
                          }`}
                      >
                        <item.icon className={`w-4 h-4 ${formData.amenities.includes(item.label) ? 'text-primary' : 'text-muted-foreground'}`} />
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="space-y-6">
                  <h2 className="text-xl font-bold flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    About this property
                  </h2>
                  <div className="space-y-3">
                    <Label className="text-sm font-semibold ml-1">Detailed Description *</Label>
                    <Textarea
                      placeholder="Describe your property's unique features, neighborhood, etc."
                      className="min-h-[150px] rounded-2xl bg-muted/30 border-border/50 p-4 focus:bg-white dark:focus:bg-neutral-900 transition-all text-base"
                      value={formData.description}
                      onChange={(e) => updateFormData('description', e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex gap-4 pt-4">
                  <Button type="button" variant="outline" onClick={() => setStep(2)} className="flex-1 h-14 text-lg rounded-2xl border-border/50">
                    Back
                  </Button>
                  <Button type="submit" className="flex-[2] h-14 text-xl font-bold bg-green-600 hover:bg-green-700 text-white rounded-2xl shadow-xl shadow-green-500/20 transition-all hover:-translate-y-1">
                    Submit for Verification
                  </Button>
                </div>
              </div>
            )}
          </form>
        </div>
      </main>

      <Footer />
    </div>
  );
}
