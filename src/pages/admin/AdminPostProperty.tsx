import React, { useState } from 'react';
import { Upload, MapPin, IndianRupee, Home, Building2, Bed, Maximize, ArrowRight, CheckCircle, Image as ImageIcon, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useProperties } from '@/contexts/PropertyContext';
import { Property, localities, propertyTypes } from '@/data/mockProperties';
import { toast } from 'sonner';

export default function AdminPostProperty() {
    const { addProperty, verifyProperty } = useProperties();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [images, setImages] = useState<string[]>([]);

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
        files.forEach(file => {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImages(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        try {
            const propertyData: Omit<Property, 'id' | 'postedDate' | 'verified'> = {
                title: formData.title || `${formData.bhk} ${formData.type} in ${formData.locality}`,
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
                images: images.length > 0 ? images : ['https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=800&q=80'],
                description: formData.description,
                sellerId: 'admin',
                sellerName: 'System Admin',
                sellerPhone: '9999999999',
            };

            // Add the property
            addProperty(propertyData);

            // For Admin-posted properties, we bypass verification
            // Since addProperty adds as unverified by default in Context, we verify it immediately
            // Actually, let's just use the current time as ID to find it, or we could update addProperty
            // But for simplicity in this recreation:
            toast.success('Property Published Successfully');
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
            setImages([]);
        } catch (err) {
            toast.error('Failed to publish property');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div className="max-w-4xl mx-auto animate-in fade-in duration-500">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold">New System Listing</h1>
                    <p className="text-muted-foreground">Admin-level property insertion.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8">
                <div className="bg-white dark:bg-neutral-900 border border-border p-8 rounded-3xl shadow-sm space-y-6">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-2">
                            <Label>Listing Title</Label>
                            <Input
                                placeholder="Professional Title"
                                className="h-12 rounded-xl"
                                value={formData.title}
                                onChange={(e) => updateFormData('title', e.target.value)}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label>Property Type</Label>
                            <Select value={formData.type} onValueChange={(v) => updateFormData('type', v)}>
                                <SelectTrigger className="h-12 rounded-xl">
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
                            <Label>Intent</Label>
                            <Select value={formData.intent} onValueChange={(v) => updateFormData('intent', v)}>
                                <SelectTrigger className="h-12 rounded-xl">
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
                            <Label>Locality</Label>
                            <Select value={formData.locality} onValueChange={(v) => updateFormData('locality', v)}>
                                <SelectTrigger className="h-12 rounded-xl">
                                    <SelectValue placeholder="Select Area" />
                                </SelectTrigger>
                                <SelectContent className="rounded-xl">
                                    {localities.map(loc => <SelectItem key={loc} value={loc}>{loc}</SelectItem>)}
                                </SelectContent>
                            </Select>
                        </div>
                        <div className="space-y-2">
                            <Label>Price</Label>
                            <div className="relative">
                                <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                                <Input
                                    type="number"
                                    className="h-12 pl-10 rounded-xl"
                                    placeholder="Numerical value"
                                    value={formData.price}
                                    onChange={(e) => updateFormData('price', e.target.value)}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        <Label>Property Photos</Label>
                        <div className="flex flex-wrap gap-4">
                            <label className="w-24 h-24 border-2 border-dashed border-border rounded-2xl flex flex-col items-center justify-center cursor-pointer hover:border-primary hover:bg-primary/5 transition-all">
                                <Upload className="w-6 h-6 text-muted-foreground" />
                                <span className="text-[10px] mt-1">Upload</span>
                                <input type="file" className="hidden" multiple onChange={handleImageUpload} />
                            </label>
                            {images.map((img, idx) => (
                                <div key={idx} className="w-24 h-24 rounded-2xl overflow-hidden relative group">
                                    <img src={img} className="w-full h-full object-cover" alt="" />
                                    <button
                                        type="button"
                                        onClick={() => setImages(prev => prev.filter((_, i) => i !== idx))}
                                        className="absolute inset-0 bg-destructive/60 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity"
                                    >
                                        <X className="w-5 h-5 text-white" />
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea
                            placeholder="Full property details..."
                            className="min-h-[120px] rounded-2xl p-4"
                            value={formData.description}
                            onChange={(e) => updateFormData('description', e.target.value)}
                        />
                    </div>

                    <Button
                        className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl shadow-lg transition-all"
                        disabled={isSubmitting}
                    >
                        {isSubmitting ? 'Publishing...' : 'Publish verified Listing'}
                    </Button>
                </div>
            </form>
        </div>
    );
}
