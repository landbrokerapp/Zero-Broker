import React, { useState } from 'react';
import { Upload, MapPin, IndianRupee, Home, Building2, Bed, Maximize, ArrowRight, CheckCircle, Image as ImageIcon, X, Car, Compass, Droplets } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/contexts/PropertyContext';
import { Property, localities, propertyTypes } from '@/data/mockProperties';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';


export default function AdminPostProperty() {
    const { addProperty, verifyProperty } = useProperties();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [previews, setPreviews] = useState<string[]>([]);


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
        floor: '1',
        totalFloors: '5',
        facing: 'East',
        parking: '1 Covered',
        ownershipType: 'freehold',
        amenities: [] as string[],
        description: '',
    });

    const updateFormData = (field: string, value: string | string[]) => {
        setFormData((prev) => ({ ...prev, [field]: value }));
    };

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const files = Array.from(e.target.files || []);
        setSelectedFiles(prev => [...prev, ...files]);

        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setPreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!formData.locality || !formData.price || !formData.type) {
            toast.error('Please fill in required fields (Locality, Price, Type)');
            return;
        }

        setIsSubmitting(true);

        try {
            // 1. Upload images to Cloudinary
            const uploadedImageUrls: string[] = [];
            if (selectedFiles.length > 0) {
                toast.info(`Uploading ${selectedFiles.length} images...`);
                for (const file of selectedFiles) {
                    const url = await uploadToCloudinary(file);
                    uploadedImageUrls.push(url);
                }
            }

            // 2. Prepare property data
            const propertyData: Property = {
                id: `prop_admin_${Date.now()}`,
                title: formData.title || `${formData.bhk} ${formData.type} in ${formData.locality}`,
                type: formData.type as Property['type'],
                intent: formData.intent as Property['intent'],
                price: parseInt(formData.price) || 0,
                priceUnit: formData.intent === 'buy' ? 'total' : 'month',
                locality: formData.locality,
                city: 'Coimbatore',
                bhk: formData.bhk,
                furnishing: formData.furnishing as Property['furnishing'],
                builtUpArea: parseInt(formData.builtUpArea) || 1200,
                carpetArea: parseInt(formData.carpetArea) || parseInt(formData.builtUpArea) || 1000,
                floor: formData.floor || '1',
                totalFloors: parseInt(formData.totalFloors) || 5,
                facing: formData.facing,
                parking: formData.parking || '1 Covered',
                ownershipType: formData.ownershipType as Property['ownershipType'],
                amenities: formData.amenities,
                images: uploadedImageUrls.length > 0 ? uploadedImageUrls : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
                description: formData.description || 'Professional listing in a prime location with all necessary amenities.',
                sellerId: 'admin',
                sellerName: 'System Admin',
                sellerPhone: '9999999999',
                verified: true,
                postedDate: new Date().toISOString().split('T')[0],
                pgType: formData.intent === 'pg' ? 'coliving' : undefined
            };

            await addProperty(propertyData, true);

            toast.success('Property Published Successfully on Website!');

            setFormData({
                title: '',
                type: 'apartment',
                intent: 'buy',
                price: '',
                locality: '',
                bhk: '2 BHK',
                furnishing: 'semi-furnished',
                builtUpArea: '',
                carpetArea: '',
                floor: '1',
                totalFloors: '5',
                facing: 'East',
                parking: '1 Covered',
                ownershipType: 'freehold',
                amenities: [] as string[],
                description: '',
            });
            setSelectedFiles([]);
            setPreviews([]);
        } catch (err) {
            console.error('Submit error:', err);
            toast.error('Failed to publish property');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleAmenity = (amenity: string) => {
        setFormData((prev) => ({
            ...prev,
            amenities: prev.amenities.includes(amenity)
                ? prev.amenities.filter((a) => a !== amenity)
                : [...prev.amenities, amenity],
        }));
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500 pb-20">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold font-display">New System Listing</h1>
                    <p className="text-muted-foreground">Admin-level property insertion. Listings are automatically verified and live on site.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-neutral-900 border border-border p-8 rounded-3xl shadow-sm space-y-10">
                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Home className="w-5 h-5 text-primary" />
                            Basic Information
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Listing Title (Optional)</Label>
                                <Input
                                    placeholder="e.g. Luxury 2BHK in Saravanampatti"
                                    className="h-12 rounded-xl bg-muted/20 border-border/50"
                                    value={formData.title}
                                    onChange={(e) => updateFormData('title', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Property Type *</Label>
                                <Select value={formData.type} onValueChange={(v) => updateFormData('type', v)}>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {propertyTypes.map(t => <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                            <div className="space-y-2">
                                <Label>Intent *</Label>
                                <Select value={formData.intent} onValueChange={(v) => updateFormData('intent', v)}>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        <SelectItem value="buy">For Sale</SelectItem>
                                        <SelectItem value="rent">For Rent</SelectItem>
                                        <SelectItem value="pg">PG / Co-Living</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Locality *</Label>
                                <Select value={formData.locality} onValueChange={(v) => updateFormData('locality', v)}>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                                        <SelectValue placeholder="Select Area" />
                                    </SelectTrigger>
                                    <SelectContent className="rounded-xl">
                                        {localities.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Price *</Label>
                                <div className="relative">
                                    <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                    <Input
                                        type="number"
                                        className="h-12 pl-10 rounded-xl bg-muted/20 border-border/50"
                                        placeholder="Numerical value"
                                        value={formData.price}
                                        onChange={(e) => updateFormData('price', e.target.value)}
                                    />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Maximize className="w-5 h-5 text-primary" />
                            Property Overview Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                            <div className="space-y-2">
                                <Label>BHK</Label>
                                <Select value={formData.bhk} onValueChange={(v) => updateFormData('bhk', v)}>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5 BHK'].map(b => (
                                            <SelectItem key={b} value={b}>{b}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Area (Sq.ft)</Label>
                                <Input
                                    type="number"
                                    placeholder="1200"
                                    className="h-12 rounded-xl bg-muted/20 border-border/50"
                                    value={formData.builtUpArea}
                                    onChange={(e) => updateFormData('builtUpArea', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Floor</Label>
                                <Input
                                    placeholder="e.g. 2nd"
                                    className="h-12 rounded-xl bg-muted/20 border-border/50"
                                    value={formData.floor}
                                    onChange={(e) => updateFormData('floor', e.target.value)}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Facing</Label>
                                <Select value={formData.facing} onValueChange={(v) => updateFormData('facing', v)}>
                                    <SelectTrigger className="h-12 rounded-xl bg-muted/20 border-border/50">
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                                            <SelectItem key={d} value={d}>{d}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <CheckCircle className="w-5 h-5 text-primary" />
                            Amenities
                        </h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
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
                                    className={`flex items-center gap-2 p-3 rounded-xl border text-xs font-semibold transition-all ${formData.amenities.includes(item.label)
                                        ? 'bg-primary/10 border-primary text-primary shadow-sm shadow-primary/10'
                                        : 'bg-muted/5 border-border hover:border-primary/50 text-muted-foreground'
                                        }`}
                                >
                                    <item.icon className="w-4 h-4" />
                                    {item.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <ImageIcon className="w-5 h-5 text-primary" />
                            Property Photos
                        </h2>
                        <div className="flex flex-wrap gap-4 p-6 bg-muted/5 rounded-2xl border-2 border-dashed border-border/50">
                            <label className="w-24 h-24 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all text-muted-foreground hover:text-primary">
                                <Upload className="w-6 h-6" />
                                <span className="text-[10px] mt-1 font-bold">Upload</span>
                                <input type="file" className="hidden" multiple onChange={handleImageUpload} />
                            </label>
                            {previews.map((img, idx) => (
                                <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden relative group border border-border/50 shadow-sm">
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => removeImage(idx)}
                                        className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <X className="w-6 h-6 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-6">
                        <h2 className="text-xl font-bold flex items-center gap-2">
                            <Building2 className="w-5 h-5 text-primary" />
                            About this property
                        </h2>
                        <Textarea
                            placeholder="Provide a detailed description to attract buyers/tenants..."
                            className="min-h-[150px] rounded-2xl p-4 bg-muted/20 border-border/50 text-base"
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                        />
                    </div>

                    <Button
                        type="submit"
                        className="w-full h-14 text-xl font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-xl shadow-primary/20 transition-all hover:-translate-y-1 active:scale-[0.98]"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Processing...' : 'Publish Verified Listing Now'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
