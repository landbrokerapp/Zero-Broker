import React, { useState, useMemo } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
    Upload, MapPin, IndianRupee, Home, Building2, Bed, Maximize,
    Car, Compass, Image as ImageIcon, CheckCircle, ArrowLeft, X, ArrowRight, Droplets,
    Video, Bath, Square, Layers, Calendar, Clock, Star, Shield, Info, Check, User, Ruler, Navigation, Map
} from 'lucide-react';
import { toast } from 'sonner';
import { uploadToCloudinary } from '@/lib/cloudinary';
import { getCurrentLocationData, generateGoogleMapsLink, parseGoogleMapsLink } from '@/lib/geolocation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Property, propertyTypes, amenitiesList } from '@/data/mockProperties';
import { tamilNaduCitiesDetailed, getAllCityNames, getLocalitiesForCity } from '@/data/tamilNaduLocations';
import { cn } from '@/lib/utils';
import { motion, AnimatePresence } from 'framer-motion';

const formSchema = z.object({
    title: z.string().min(5, 'Title must be at least 5 characters'),
    type: z.string().optional(), // Optional because PG doesn't require property type
    purpose: z.enum(['Sale', 'Rent', 'PG']),
    city: z.string().min(1, 'City is required'),
    area: z.string().min(1, 'Area is required'),
    address: z.string().optional(),
    landmark: z.string().optional(),
    pincode: z.string().optional(),
    mapLocation: z.string().optional(), // Google Maps link or coordinates
    price: z.string().min(1, 'Price is required'),
    priceNegotiable: z.boolean().default(false),
    maintenanceCharges: z.string().optional(),
    securityDeposit: z.string().optional(),
    foodIncluded: z.boolean().optional(),
    // Specifications
    bhk: z.string().optional(),
    bathrooms: z.string().optional(),
    balconies: z.string().optional(),
    parking: z.string().optional(),
    builtUpArea: z.string().optional(),
    floor: z.string().optional(),
    totalFloors: z.string().optional(),
    // Land Specs
    plotArea: z.string().optional(),
    plotAreaUnit: z.enum(['sqft', 'cents']).default('sqft'),
    plotFacing: z.string().optional(),
    boundaryWall: z.boolean().optional(),
    roadWidth: z.string().optional(),
    roadLength: z.string().optional(),
    propertyLength: z.string().optional(),
    propertyWidth: z.string().optional(),
    // PG Specs
    pgType: z.string().optional(),
    pgRoomType: z.string().optional(),
    pgFoodType: z.string().optional(),
    pgElectricityIncluded: z.boolean().optional(),
    pgHouseRules: z.string().optional(),
    numBeds: z.string().optional(),
    // Commercial
    washroomCount: z.string().optional(),
    carpetArea: z.string().optional(),

    furnishingStatus: z.enum(['unfurnished', 'semi-furnished', 'fully-furnished']).optional(),
    propertyAge: z.string().optional(),
    amenities: z.array(z.string()).default([]),
    description: z.string().min(20, 'Description must be at least 20 characters'),
    termsAccepted: z.boolean().refine(val => val === true, 'You must accept the terms'),
});

type FormValues = z.infer<typeof formSchema>;

interface PropertyFormProps {
    onSubmit: (data: any) => Promise<void>;
    initialData?: Partial<FormValues>;
    isAdmin?: boolean;
}

export const PropertyForm: React.FC<PropertyFormProps> = ({ onSubmit, initialData, isAdmin }) => {
    const [step, setStep] = useState(1);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
    const [imagePreviews, setImagePreviews] = useState<string[]>([]);
    const [videoFile, setVideoFile] = useState<File | null>(null);
    const [isDragging, setIsDragging] = useState(false);
    const [isLoadingLocation, setIsLoadingLocation] = useState(false);

    const { control, handleSubmit, watch, setValue, trigger, formState: { errors } } = useForm<FormValues>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            purpose: 'Sale',
            city: '',
            furnishingStatus: 'semi-furnished',
            amenities: [],
            termsAccepted: false,
            ...initialData,
        },
    });

    const watchPurpose = watch('purpose');
    const watchType = watch('type');
    const watchCity = watch('city');

    const availableLocalities = useMemo(() => {
        if (!watchCity) return [];
        const localities = getLocalitiesForCity(watchCity);
        return localities.map(loc => loc.name);
    }, [watchCity]);

    // Update area if city changes and current area is not in the new city's localities
    React.useEffect(() => {
        const currentArea = watch('area');
        if (availableLocalities.length > 0 && !availableLocalities.includes(currentArea)) {
            setValue('area', availableLocalities[0]);
        }
    }, [watchCity, availableLocalities, setValue, watch]);

    // Clear type when purpose is PG (since PG doesn't need property type)
    React.useEffect(() => {
        if (watchPurpose === 'PG') {
            setValue('type', '');
        }
    }, [watchPurpose, setValue]);

    const handleNumericChange = (e: React.ChangeEvent<HTMLInputElement>, onChange: (value: string) => void) => {
        const value = e.target.value.replace(/[^0-9]/g, '');
        onChange(value);
    };

    const steps = useMemo(() => {
        const allSteps = [
            { id: 'basic', title: 'Basic Info', icon: Home },
            { id: 'location', title: 'Location', icon: MapPin },
            { id: 'pricing', title: 'Pricing', icon: IndianRupee },
            { id: 'specs', title: 'Specs', icon: Maximize },
            { id: 'status', title: 'Status', icon: Clock },
            { id: 'amenities', title: 'Amenities', icon: Star },
            { id: 'details', title: 'Description', icon: Info },
            { id: 'media', title: 'Media', icon: ImageIcon },
            { id: 'review', title: 'Review', icon: CheckCircle },
        ];

        return allSteps.filter(s => {
            if (s.id === 'status' && (watchPurpose === 'PG' || watchType === 'plot')) return false;
            return true;
        });
    }, [watchPurpose, watchType]);

    const activeStepId = steps[step - 1]?.id;

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
            return isValidType && isValidSize;
        });

        validFiles.forEach(file => {
            setSelectedFiles(prev => [...prev, file]);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImagePreviews(prev => [...prev, reader.result as string]);
            };
            reader.readAsDataURL(file);
        });
    };

    const removeImage = (index: number) => {
        setSelectedFiles(prev => prev.filter((_, i) => i !== index));
        setImagePreviews(prev => prev.filter((_, i) => i !== index));
    };

    const handleVideoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            if (file.size > 50 * 1024 * 1024) {
                toast.error('Video too large (max 50MB)');
                return;
            }
            setVideoFile(file);
        }
    };

    const handleUseMyLocation = async () => {
        setIsLoadingLocation(true);
        try {
            toast.info('Getting your location...');
            const locationData = await getCurrentLocationData();

            // Find matching city in Tamil Nadu
            const allCities = getAllCityNames();
            const matchedCity = allCities.find(city =>
                city.toLowerCase() === locationData.city.toLowerCase() ||
                locationData.city.toLowerCase().includes(city.toLowerCase())
            );

            if (matchedCity) {
                setValue('city', matchedCity);

                // Try to match area/locality
                const localities = getLocalitiesForCity(matchedCity);
                const matchedLocality = localities.find(loc =>
                    loc.name.toLowerCase().includes(locationData.area.toLowerCase()) ||
                    locationData.area.toLowerCase().includes(loc.name.toLowerCase()) ||
                    loc.subLocalities?.some(sub =>
                        sub.toLowerCase().includes(locationData.area.toLowerCase()) ||
                        locationData.area.toLowerCase().includes(sub.toLowerCase())
                    )
                );

                if (matchedLocality) {
                    setValue('area', matchedLocality.name);
                } else if (localities.length > 0) {
                    // If no exact match, use first locality
                    setValue('area', localities[0].name);
                }

                // Set pincode if available
                if (locationData.pincode) {
                    setValue('pincode', locationData.pincode);
                }

                // Generate and set map location
                const mapLink = generateGoogleMapsLink(locationData.coordinates);
                setValue('mapLocation', mapLink);

                toast.success(`Location set to ${matchedCity}${matchedLocality ? ', ' + matchedLocality.name : ''}`);
            } else {
                toast.warning(`Location detected: ${locationData.city}, ${locationData.state}. Please select a Tamil Nadu city manually.`);
            }
        } catch (error: any) {
            console.error('Location error:', error);
            toast.error(error.message || 'Failed to get location. Please enter manually.');
        } finally {
            setIsLoadingLocation(false);
        }
    };

    const nextStep = async () => {
        let fieldsToValidate: any[] = [];
        if (activeStepId === 'basic') {
            // For PG, only validate title and purpose. For others, also validate type
            fieldsToValidate = watchPurpose === 'PG' ? ['title', 'purpose'] : ['title', 'type', 'purpose'];
        }
        else if (activeStepId === 'location') fieldsToValidate = ['city', 'area'];
        else if (activeStepId === 'pricing') fieldsToValidate = ['price'];
        else if (activeStepId === 'specs') {
            // For PG, no specific field validation needed
            if (watchPurpose === 'PG') {
                fieldsToValidate = [];
            } else if (watchType === 'plot') {
                fieldsToValidate = ['plotArea'];
            } else {
                fieldsToValidate = ['builtUpArea'];
            }
        }
        else if (activeStepId === 'details') {
            fieldsToValidate = ['description'];
        }

        const result = fieldsToValidate.length > 0 ? await trigger(fieldsToValidate as any) : true;
        if (result) setStep(prev => prev + 1);
    };

    const prevStep = () => setStep(prev => prev - 1);

    const internalOnSubmit = async (data: FormValues) => {
        if (imagePreviews.length < 3) {
            toast.error('Please upload at least 3 images');
            setStep(8);
            return;
        }

        setIsSubmitting(true);
        try {
            const uploadedImageUrls: string[] = [];
            for (const file of selectedFiles) {
                const url = await uploadToCloudinary(file);
                uploadedImageUrls.push(url);
            }

            let videoUrl = '';
            if (videoFile) {
                videoUrl = await uploadToCloudinary(videoFile);
            }

            const submissionData = {
                ...data,
                images: uploadedImageUrls,
                videoUrl,
            };

            await onSubmit(submissionData);
        } catch (error) {
            console.error(error);
            toast.error('Failed to submit property');
        } finally {
            setIsSubmitting(false);
        }
    };

    const currentAmenities = useMemo(() => {
        // Check purpose first for PG
        if (watchPurpose === 'PG') return amenitiesList.pg;
        // Then check property type
        if (watchType === 'plot') return [];
        if (watchType === 'commercial' || watchType === 'shop') return amenitiesList.commercial;
        return amenitiesList.residential;
    }, [watchPurpose, watchType]);

    return (
        <div className="w-full bg-white dark:bg-neutral-900 rounded-3xl shadow-xl border border-border overflow-hidden">
            {/* Stepper Header */}
            <div className="bg-muted/30 border-b border-border p-6 overflow-x-auto">
                <div className="flex items-center justify-between min-w-[600px] px-4">
                    {steps.map((s, idx) => {
                        const isCompleted = step > idx + 1;
                        const isActive = step === idx + 1;
                        return (
                            <React.Fragment key={idx}>
                                <div className="flex flex-col items-center relative z-10">
                                    <div
                                        className={cn(
                                            "w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300",
                                            isCompleted ? "bg-green-500 text-white" :
                                                isActive ? "bg-primary text-white scale-110 shadow-lg shadow-primary/20" :
                                                    "bg-muted text-muted-foreground"
                                        )}
                                    >
                                        {isCompleted ? <Check className="w-5 h-5" /> : <s.icon className="w-5 h-5" />}
                                    </div>
                                    <span className={cn(
                                        "text-[10px] mt-2 font-bold uppercase tracking-tighter",
                                        isActive ? "text-primary" : "text-muted-foreground"
                                    )}>
                                        {s.title}
                                    </span>
                                </div>
                                {idx < steps.length - 1 && (
                                    <div className="flex-1 h-[2px] bg-muted mx-2 mb-6 relative">
                                        <div
                                            className="absolute inset-y-0 left-0 bg-primary transition-all duration-500"
                                            style={{ width: isCompleted ? '100%' : '0%' }}
                                        />
                                    </div>
                                )}
                            </React.Fragment>
                        );
                    })}
                </div>
            </div>

            <form onSubmit={handleSubmit(internalOnSubmit)} className="p-8">
                <AnimatePresence mode="wait">
                    <motion.div
                        key={step}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        transition={{ duration: 0.3 }}
                        className="space-y-6"
                    >
                        {/* Step 1: Basic Information */}
                        {activeStepId === 'basic' && (
                            <div className="space-y-6">
                                {/* Purpose - First Step (Required) */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">Purpose * (First Step)</Label>
                                    <Controller
                                        name="purpose"
                                        control={control}
                                        render={({ field }) => (
                                            <RadioGroup
                                                onValueChange={field.onChange}
                                                value={field.value}
                                                className="grid grid-cols-3 gap-4"
                                            >
                                                {['Sale', 'Rent', 'PG'].map((p) => (
                                                    <div
                                                        key={p}
                                                        className={cn(
                                                            "flex items-center space-x-3 p-4 border rounded-2xl cursor-pointer transition-all",
                                                            field.value === p ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
                                                        )}
                                                    >
                                                        <RadioGroupItem value={p} id={`purpose-${p.toLowerCase()}`} />
                                                        <Label htmlFor={`purpose-${p.toLowerCase()}`} className="cursor-pointer font-semibold">{p}</Label>
                                                    </div>
                                                ))}
                                            </RadioGroup>
                                        )}
                                    />
                                </div>

                                {/* Property Type - Conditionally Required (Hide for PG) */}
                                {watchPurpose !== 'PG' && (
                                    <div className="space-y-2">
                                        <Label className="text-lg font-bold">Property Type *</Label>
                                        <Controller
                                            name="type"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-12 rounded-2xl">
                                                        <SelectValue placeholder="Select Property Type" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl">
                                                        {propertyTypes.filter(t => t.value !== 'pg').map(t => (
                                                            <SelectItem key={t.value} value={t.value}>{t.label}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.type && <p className="text-destructive text-sm font-medium">{errors.type.message}</p>}
                                    </div>
                                )}

                                {/* Property Title - Auto-suggest format based on selection */}
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">Property Title / Name *</Label>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field }) => (
                                            <Input
                                                {...field}
                                                placeholder={
                                                    watchPurpose === 'PG'
                                                        ? "e.g. Boys PG with Food in RS Puram"
                                                        : watchPurpose === 'Rent'
                                                            ? "e.g. 2BHK Semi-Furnished Apartment for Rent in RS Puram"
                                                            : "e.g. 3BHK Villa for Sale in Saravanampatti"
                                                }
                                                className="h-12 text-lg rounded-2xl"
                                            />
                                        )}
                                    />
                                    {errors.title && <p className="text-destructive text-sm font-medium">{errors.title.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 2: Location Details */}
                        {activeStepId === 'location' && (
                            <div className="space-y-6">
                                {/* Use My Location Button */}
                                <div className="flex justify-end">
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={handleUseMyLocation}
                                        disabled={isLoadingLocation}
                                        className="rounded-xl border-primary text-primary hover:bg-primary/5"
                                    >
                                        {isLoadingLocation ? (
                                            <>
                                                <Clock className="w-4 h-4 mr-2 animate-spin" />
                                                Getting Location...
                                            </>
                                        ) : (
                                            <>
                                                <Navigation className="w-4 h-4 mr-2" />
                                                Use My Location
                                            </>
                                        )}
                                    </Button>
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>City (Tamil Nadu) *</Label>
                                        <Controller
                                            name="city"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-12 rounded-2xl">
                                                        <SelectValue placeholder="Select City" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl max-h-[300px]">
                                                        {getAllCityNames().map(city => (
                                                            <SelectItem key={city} value={city}>{city}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.city && <p className="text-destructive text-sm font-medium">{errors.city.message}</p>}
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Area / Locality *</Label>
                                        <Controller
                                            name="area"
                                            control={control}
                                            render={({ field }) => (
                                                <Select onValueChange={field.onChange} value={field.value}>
                                                    <SelectTrigger className="h-12 rounded-2xl">
                                                        <SelectValue placeholder="Select Locality" />
                                                    </SelectTrigger>
                                                    <SelectContent className="rounded-2xl max-h-[300px]">
                                                        {availableLocalities.map(loc => (
                                                            <SelectItem key={loc} value={loc}>{loc}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                            )}
                                        />
                                        {errors.area && <p className="text-destructive text-sm font-medium">{errors.area.message}</p>}
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <Label>Full Address</Label>
                                    <Controller
                                        name="address"
                                        control={control}
                                        render={({ field }) => (
                                            <Input {...field} placeholder="Door No, Street Name, Plot No" className="h-12 rounded-2xl" />
                                        )}
                                    />
                                </div>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Landmark</Label>
                                        <Controller
                                            name="landmark"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} placeholder="e.g. Near Big Bazaar" className="h-12 rounded-2xl" />
                                            )}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Pincode</Label>
                                        <Controller
                                            name="pincode"
                                            control={control}
                                            render={({ field }) => (
                                                <Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" maxLength={6} onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="641001" className="h-12 rounded-2xl" />
                                            )}
                                        />
                                    </div>
                                </div>

                                {/* Map Location Field */}
                                <div className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <Label>Map Location (Optional)</Label>
                                        <Badge variant="secondary" className="rounded-full">Google Maps Link</Badge>
                                    </div>
                                    <Controller
                                        name="mapLocation"
                                        control={control}
                                        render={({ field }) => (
                                            <div className="relative">
                                                <Map className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Input
                                                    {...field}
                                                    placeholder="Paste Google Maps link or coordinates (auto-filled with location)"
                                                    className="h-12 pl-12 rounded-2xl"
                                                />
                                            </div>
                                        )}
                                    />
                                    <p className="text-xs text-muted-foreground">
                                        Paste a Google Maps link (e.g., https://maps.google.com/?q=11.0168,76.9558) or use "Use My Location" button
                                    </p>
                                </div>
                            </div>
                        )}

                        {/* Step 3: Pricing & Deposit */}
                        {activeStepId === 'pricing' && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>
                                            {watchPurpose === 'Sale' ? 'Total Price *' : 'Monthly Rent *'}
                                        </Label>
                                        <div className="relative">
                                            <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-5 h-5" />
                                            <Controller
                                                name="price"
                                                control={control}
                                                render={({ field }) => (
                                                    <Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="0.00" className="h-14 pl-12 text-xl font-bold rounded-2xl" />
                                                )}
                                            />
                                        </div>
                                        {errors.price && <p className="text-destructive text-sm font-medium">{errors.price.message}</p>}
                                    </div>

                                    {watchPurpose === 'Sale' && (
                                        <div className="space-y-2">
                                            <Label>Price Negotiable</Label>
                                            <Controller
                                                name="priceNegotiable"
                                                control={control}
                                                render={({ field }) => (
                                                    <div className="flex items-center space-x-2 h-14 px-4 bg-muted/20 rounded-2xl mt-1">
                                                        <Checkbox checked={field.value} onCheckedChange={field.onChange} id="negotiable" />
                                                        <Label htmlFor="negotiable" className="cursor-pointer">Yes, negotiable</Label>
                                                    </div>
                                                )}
                                            />
                                        </div>
                                    )}

                                    {watchPurpose !== 'Sale' && (
                                        <div className="space-y-2">
                                            <Label>Security Deposit</Label>
                                            <div className="relative">
                                                <IndianRupee className="absolute left-4 top-1/2 -translate-y-1/2 text-muted-foreground w-4 h-4" />
                                                <Controller
                                                    name="securityDeposit"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Deposit Amount" className="h-12 pl-10 rounded-2xl" />
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    )}
                                </div>

                                {watchPurpose === 'PG' && (
                                    <div className="space-y-2">
                                        <Label>Food Included</Label>
                                        <Controller
                                            name="foodIncluded"
                                            control={control}
                                            render={({ field }) => (
                                                <div className="flex items-center space-x-2 h-12 px-4 bg-muted/20 rounded-2xl mt-1">
                                                    <Checkbox checked={field.value} onCheckedChange={field.onChange} id="food" />
                                                    <Label htmlFor="food" className="cursor-pointer">Yes, food included</Label>
                                                </div>
                                            )}
                                        />
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 4: Specifications (Conditional) */}
                        {activeStepId === 'specs' && (
                            <div className="space-y-6">
                                {/* PG-SPECIFIC DETAILS (EXCLUSIVE BLOCK) - Show ONLY IF Purpose = PG */}
                                {watchPurpose === 'PG' ? (
                                    <div className="space-y-6">
                                        <div className="p-4 bg-primary/5 border border-primary/20 rounded-2xl">
                                            <h3 className="text-lg font-bold text-primary flex items-center gap-2">
                                                <User className="w-5 h-5" />
                                                PG-Specific Details
                                            </h3>
                                            <p className="text-sm text-muted-foreground mt-1">Provide details about your PG accommodation</p>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            <div className="space-y-2">
                                                <Label>PG Type *</Label>
                                                <Controller
                                                    name="pgType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select Type" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="boys">Boys</SelectItem>
                                                                <SelectItem value="girls">Girls</SelectItem>
                                                                <SelectItem value="coliving">Co-Living</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Room Type *</Label>
                                                <Controller
                                                    name="pgRoomType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select Room" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="single">Single</SelectItem>
                                                                <SelectItem value="double">Double</SelectItem>
                                                                <SelectItem value="shared">Shared (3+)</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Number of Beds</Label>
                                                <Controller
                                                    name="numBeds"
                                                    control={control}
                                                    render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Total beds" className="h-12 rounded-2xl" />)}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Food Type</Label>
                                                <Controller
                                                    name="pgFoodType"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select Food Type" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="veg">Veg</SelectItem>
                                                                <SelectItem value="non-veg">Non-Veg</SelectItem>
                                                                <SelectItem value="both">Both</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Electricity Charges</Label>
                                                <Controller
                                                    name="pgElectricityIncluded"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex items-center space-x-2 h-12 px-4 bg-muted/20 rounded-2xl mt-1">
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="electricity-pg" />
                                                            <Label htmlFor="electricity-pg" className="cursor-pointer">Electricity Included</Label>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <Label>House Rules</Label>
                                            <Controller
                                                name="pgHouseRules"
                                                control={control}
                                                render={({ field }) => (<Textarea {...field} placeholder="e.g. No visitors after 8 PM, No smoking, etc." className="rounded-2xl min-h-[100px]" />)}
                                            />
                                        </div>
                                    </div>
                                ) : watchType === 'plot' ? (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Plot Area *</Label>
                                                <div className="flex gap-2">
                                                    <Controller
                                                        name="plotArea"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Area" className="h-12 flex-1 rounded-2xl" />
                                                        )}
                                                    />
                                                    <Controller
                                                        name="plotAreaUnit"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger className="h-12 w-24 rounded-2xl">
                                                                    <SelectValue />
                                                                </SelectTrigger>
                                                                <SelectContent>
                                                                    <SelectItem value="sqft">Sqft</SelectItem>
                                                                    <SelectItem value="cents">Cents</SelectItem>
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                                {errors.plotArea && <p className="text-destructive text-sm font-medium">{errors.plotArea.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Plot Facing</Label>
                                                <Controller
                                                    name="plotFacing"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl">
                                                                <SelectValue placeholder="Facing" />
                                                            </SelectTrigger>
                                                            <SelectContent>
                                                                {['East', 'West', 'North', 'South', 'North-East', 'North-West', 'South-East', 'South-West'].map(d => (
                                                                    <SelectItem key={d} value={d}>{d}</SelectItem>
                                                                ))}
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Property Dimensions (ft)</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Controller
                                                        name="propertyLength"
                                                        control={control}
                                                        render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Length" className="h-12 rounded-2xl" />)}
                                                    />
                                                    <Controller
                                                        name="propertyWidth"
                                                        control={control}
                                                        render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Width" className="h-12 rounded-2xl" />)}
                                                    />
                                                </div>
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Road Dimensions (ft)</Label>
                                                <div className="grid grid-cols-2 gap-2">
                                                    <Controller
                                                        name="roadLength"
                                                        control={control}
                                                        render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Length" className="h-12 rounded-2xl" />)}
                                                    />
                                                    <Controller
                                                        name="roadWidth"
                                                        control={control}
                                                        render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="Width" className="h-12 rounded-2xl" />)}
                                                    />
                                                </div>
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Boundary Wall</Label>
                                                <Controller
                                                    name="boundaryWall"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <div className="flex items-center space-x-2 h-12 px-4 bg-muted/20 rounded-2xl mt-1">
                                                            <Checkbox checked={field.value} onCheckedChange={field.onChange} id="boundary" />
                                                            <Label htmlFor="boundary" className="cursor-pointer">Yes, boundary wall exists</Label>
                                                        </div>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="space-y-6">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                            {(watchType !== 'commercial' && watchType !== 'shop') && (
                                                <div className="space-y-2">
                                                    <Label>BHK *</Label>
                                                    <Controller
                                                        name="bhk"
                                                        control={control}
                                                        render={({ field }) => (
                                                            <Select onValueChange={field.onChange} value={field.value}>
                                                                <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="BHK" /></SelectTrigger>
                                                                <SelectContent>
                                                                    {['1 RK', '1 BHK', '2 BHK', '3 BHK', '4 BHK', '5+ BHK'].map(b => (
                                                                        <SelectItem key={b} value={b}>{b}</SelectItem>
                                                                    ))}
                                                                </SelectContent>
                                                            </Select>
                                                        )}
                                                    />
                                                </div>
                                            )}
                                            <div className="space-y-2">
                                                <Label>{(watchType === 'commercial' || watchType === 'shop') ? 'Washrooms' : 'Bathrooms'}</Label>
                                                <Controller
                                                    name="bathrooms"
                                                    control={control}
                                                    render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} className="h-12 rounded-2xl" />)}
                                                />
                                            </div>
                                            {(watchType !== 'commercial' && watchType !== 'shop') && (
                                                <div className="space-y-2">
                                                    <Label>Balconies</Label>
                                                    <Controller
                                                        name="balconies"
                                                        control={control}
                                                        render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} className="h-12 rounded-2xl" />)}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Built-up Area (sq.ft) *</Label>
                                                <Controller
                                                    name="builtUpArea"
                                                    control={control}
                                                    render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="1200" className="h-12 rounded-2xl" />)}
                                                />
                                                {errors.builtUpArea && <p className="text-destructive text-sm font-medium">{errors.builtUpArea.message}</p>}
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Parking</Label>
                                                <Controller
                                                    name="parking"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="None">None</SelectItem>
                                                                <SelectItem value="1 Car">1 Car</SelectItem>
                                                                <SelectItem value="2 Cars">2 Cars</SelectItem>
                                                                <SelectItem value="Bike Only">Bike Only</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label>Floor Number</Label>
                                                <Controller
                                                    name="floor"
                                                    control={control}
                                                    render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="e.g. 3" className="h-12 rounded-2xl" />)}
                                                />
                                            </div>
                                            <div className="space-y-2">
                                                <Label>Total Floors</Label>
                                                <Controller
                                                    name="totalFloors"
                                                    control={control}
                                                    render={({ field }) => (<Input {...field} type="text" inputMode="numeric" pattern="[0-9]*" onChange={(e) => handleNumericChange(e, field.onChange)} placeholder="e.g. 5" className="h-12 rounded-2xl" />)}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 5: Furnishing & Availability (Land and PG hidden) */}
                        {activeStepId === 'status' && (
                            <div className="space-y-6">
                                {(watchType === 'plot' || watchPurpose === 'PG') ? (
                                    <div className="text-center py-10 bg-muted/20 rounded-3xl border border-dashed border-border">
                                        <Info className="w-12 h-12 text-primary mx-auto mb-4" />
                                        <h3 className="text-xl font-bold">Not applicable for {watchPurpose === 'PG' ? 'PG' : 'Plot / Land'}</h3>
                                        <p className="text-muted-foreground mt-2">You can click continue to proceed to amenities.</p>
                                    </div>
                                ) : (
                                    <div className="space-y-8">
                                        <div className="space-y-4">
                                            <Label className="text-lg font-bold">Furnishing Status</Label>
                                            <Controller
                                                name="furnishingStatus"
                                                control={control}
                                                render={({ field }) => (
                                                    <RadioGroup onValueChange={field.onChange} value={field.value} className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                                        {['unfurnished', 'semi-furnished', 'fully-furnished'].map(v => (
                                                            <div key={v} className={cn(
                                                                "flex items-center space-x-3 p-4 border rounded-2xl cursor-pointer transition-all",
                                                                field.value === v ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/50"
                                                            )}>
                                                                <RadioGroupItem value={v} id={v} />
                                                                <Label htmlFor={v} className="cursor-pointer capitalize font-semibold">{v.replace('-', ' ')}</Label>
                                                            </div>
                                                        ))}
                                                    </RadioGroup>
                                                )}
                                            />
                                        </div>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-4">

                                            <div className="space-y-2">
                                                <Label className="flex items-center gap-2"><Clock className="w-4 h-4 text-primary" /> Property Age</Label>
                                                <Controller
                                                    name="propertyAge"
                                                    control={control}
                                                    render={({ field }) => (
                                                        <Select onValueChange={field.onChange} value={field.value}>
                                                            <SelectTrigger className="h-12 rounded-2xl"><SelectValue placeholder="Select Age" /></SelectTrigger>
                                                            <SelectContent>
                                                                <SelectItem value="new">New Construction</SelectItem>
                                                                <SelectItem value="1–3 Years">1–3 Years</SelectItem>
                                                                <SelectItem value="3–5 Years">3–5 Years</SelectItem>
                                                                <SelectItem value="5+ Years">5+ Years</SelectItem>
                                                            </SelectContent>
                                                        </Select>
                                                    )}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}

                        {/* Step 6: Smart Amenities */}
                        {activeStepId === 'amenities' && (
                            <div className="space-y-6">
                                {currentAmenities.length === 0 ? (
                                    <div className="text-center py-10">
                                        <p className="text-muted-foreground">No specific amenities for this property type.</p>
                                    </div>
                                ) : (
                                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                        {currentAmenities.map((amenity) => (
                                            <Controller
                                                key={amenity}
                                                name="amenities"
                                                control={control}
                                                render={({ field }) => {
                                                    const isChecked = field.value?.includes(amenity);
                                                    return (
                                                        <div
                                                            onClick={() => {
                                                                const newValue = isChecked ? field.value?.filter(a => a !== amenity) : [...(field.value || []), amenity];
                                                                field.onChange(newValue);
                                                            }}
                                                            className={cn(
                                                                "flex items-center gap-3 p-4 rounded-2xl border cursor-pointer transition-all h-full",
                                                                isChecked ? "bg-primary/10 border-primary text-primary shadow-sm" : "bg-muted/10 border-border text-muted-foreground hover:border-primary/50"
                                                            )}
                                                        >
                                                            <div className={cn(
                                                                "w-5 h-5 rounded-md border flex items-center justify-center",
                                                                isChecked ? "bg-primary border-primary text-white" : "border-muted-foreground/30"
                                                            )}>
                                                                {isChecked && <Check className="w-3 h-3" />}
                                                            </div>
                                                            <span className="text-sm font-semibold">{amenity}</span>
                                                        </div>
                                                    );
                                                }}
                                            />
                                        ))}
                                    </div>
                                )}
                            </div>

                        )}

                        {/* Step 6.5: Description (New Step before Media) */}
                        {activeStepId === 'details' && (
                            <div className="space-y-6">
                                <div className="space-y-2">
                                    <Label className="text-lg font-bold">Property Description *</Label>
                                    <p className="text-sm text-muted-foreground">Describe your property in detail. do not include contact numbers.</p>
                                    <Controller
                                        name="description"
                                        control={control}
                                        render={({ field }) => (
                                            <Textarea
                                                {...field}
                                                onChange={(e) => {
                                                    // Remove numeric characters
                                                    const value = e.target.value.replace(/[0-9]/g, '');
                                                    if (value !== e.target.value) {
                                                        toast.warning("Numbers are not allowed in description");
                                                    }
                                                    field.onChange(value);
                                                }}
                                                placeholder="Tell us more about the property... (No numbers allowed)"
                                                className="min-h-[200px] rounded-2xl p-4 text-base"
                                            />
                                        )}
                                    />
                                    {errors.description && <p className="text-destructive text-sm font-medium">{errors.description.message}</p>}
                                </div>
                            </div>
                        )}

                        {/* Step 7: Images & Media */}
                        {activeStepId === 'media' && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <div className="flex items-center justify-between"><Label className="text-lg font-bold">Property Photos * (Min 3)</Label><Badge variant="secondary" className="rounded-full">{imagePreviews.length} / 10</Badge></div>
                                    <div onDragOver={(e) => { e.preventDefault(); setIsDragging(true); }} onDragLeave={() => setIsDragging(false)} onDrop={(e) => { e.preventDefault(); setIsDragging(false); handleImageUpload(e); }} onClick={() => document.getElementById('image-upload')?.click()} className={cn("relative border-2 border-dashed rounded-3xl p-10 transition-all flex flex-col items-center justify-center gap-4 cursor-pointer", isDragging ? "bg-primary/5 border-primary shadow-xl" : "bg-muted/20 border-border hover:border-primary/50")}>
                                        <input id="image-upload" type="file" multiple accept="image/*" className="hidden" onChange={handleImageUpload} />
                                        <div className="w-20 h-20 bg-primary/10 rounded-3xl flex items-center justify-center"><Upload className="w-10 h-10 text-primary" /></div>
                                        <div className="text-center">
                                            <p className="text-xl font-bold">Drag & drop your images here</p>
                                            <p className="text-muted-foreground mt-2">
                                                {watchPurpose === 'PG'
                                                    ? 'Include room and washroom images. Max 5MB each.'
                                                    : watchType === 'plot'
                                                        ? 'Include land and road access images. Max 5MB each.'
                                                        : 'Maximum file size 5MB each.'}
                                            </p>
                                        </div>
                                        <Button type="button" variant="outline" className="rounded-xl px-8 h-12 font-bold border-primary text-primary hover:bg-primary/5">Select Files</Button>
                                    </div>
                                    {imagePreviews.length > 0 && (<div className="grid grid-cols-2 md:grid-cols-5 gap-4 mt-6">{imagePreviews.map((img, idx) => (
                                        <div key={idx} className="group relative aspect-square rounded-2xl overflow-hidden shadow-md border border-border">
                                            <img src={img} alt="Preview" className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110" />
                                            <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                                <button type="button" onClick={(e) => { e.stopPropagation(); removeImage(idx); }} className="bg-destructive text-white p-2 rounded-xl"><X className="w-6 h-6" /></button>
                                            </div>
                                        </div>
                                    ))}</div>)}
                                </div>
                                <div className="space-y-4 pt-4">
                                    <Label className="text-lg font-bold">Video Walkthrough (Optional)</Label>
                                    <div className={cn("p-6 border-2 border-dashed rounded-3xl transition-all flex items-center gap-6", videoFile ? "bg-green-500/5 border-green-500/50" : "bg-muted/10 border-border")}>
                                        <div className={cn("w-16 h-16 rounded-2xl flex items-center justify-center", videoFile ? "bg-green-500/20" : "bg-muted/30")}>
                                            {videoFile ? <CheckCircle className="w-8 h-8 text-green-500" /> : <Video className="w-8 h-8 text-muted-foreground" />}
                                        </div>
                                        <div className="flex-1"><p className="font-bold">{videoFile ? videoFile.name : "No video selected"}</p><p className="text-sm text-muted-foreground">{videoFile ? (videoFile.size / (1024 * 1024)).toFixed(2) + " MB" : "MP4, max 50MB"}</p></div>
                                        <Button type="button" variant="secondary" onClick={() => document.getElementById('video-upload')?.click()} className="rounded-xl">{videoFile ? "Change Video" : "Upload Video"}</Button>
                                        <input id="video-upload" type="file" accept="video/*" className="hidden" onChange={handleVideoUpload} />
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Step 8: Review & Submit */}
                        {activeStepId === 'review' && (
                            <div className="space-y-8">
                                <div className="space-y-4">
                                    <h3 className="text-xl font-bold flex items-center gap-2"><Info className="w-6 h-6 text-primary" /> Final Review</h3>
                                    <div className="p-6 bg-muted/20 rounded-3xl border border-border space-y-4">
                                        <div className="grid grid-cols-2 gap-4 text-sm">
                                            <div><p className="text-muted-foreground">Title</p><p className="font-bold">{watch('title')}</p></div>
                                            <div><p className="text-muted-foreground">Location</p><p className="font-bold">{watch('area')}, {watch('city')}</p></div>
                                            <div><p className="text-muted-foreground">Price</p><p className="font-bold text-primary">₹{parseInt(watch('price') || '0').toLocaleString('en-IN')}</p></div>
                                            <div><p className="text-muted-foreground">Type</p><p className="font-bold capitalize">{watch('type')}</p></div>
                                        </div>
                                    </div>

                                </div>
                                <div className="p-6 bg-primary/5 rounded-3xl border border-primary/20">
                                    <div className="flex items-start space-x-3">
                                        <Controller name="termsAccepted" control={control} render={({ field }) => (<Checkbox id="terms" checked={field.value} onCheckedChange={field.onChange} className="mt-1" />)} />
                                        <div className="grid gap-1.5 leading-none">
                                            <Label htmlFor="terms" className="text-sm font-semibold cursor-pointer">I agree to the Terms & Conditions and confirm all details are accurate.</Label>
                                            {errors.termsAccepted && <p className="text-destructive text-xs font-medium mt-1">{errors.termsAccepted.message}</p>}
                                        </div>
                                    </div>
                                </div>
                                {isAdmin && (
                                    <div className="p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl flex items-center gap-3">
                                        <Shield className="w-5 h-5 text-amber-600" />
                                        <p className="text-sm font-bold text-amber-800">Admin Mode: Instant publishing enabled.</p>
                                    </div>
                                )}
                            </div>
                        )}
                    </motion.div>
                </AnimatePresence>

                {/* Navigation Footer */}
                <div className="flex justify-between items-center mt-12 pt-8 border-t border-border">
                    {step > 1 ? (
                        <Button type="button" variant="outline" onClick={prevStep} className="h-12 px-8 rounded-xl flex items-center gap-2 font-bold transition-all border-2 border-primary/20 text-primary hover:bg-primary/5 active:scale-95"><ArrowLeft className="w-4 h-4" /> Back</Button>
                    ) : <div />}

                    {step < steps.length ? (
                        <Button type="button" onClick={nextStep} className="h-14 px-10 rounded-2xl flex items-center gap-2 font-bold bg-primary hover:bg-primary/90 text-white shadow-lg transition-all hover:translate-x-1 active:scale-95">Continue <ArrowRight className="w-5 h-5" /></Button>
                    ) : (
                        <Button type="submit" disabled={isSubmitting} className={cn("h-14 px-12 rounded-2xl flex items-center gap-3 font-bold text-lg shadow-xl transition-all", isAdmin ? "bg-amber-600 hover:bg-amber-700" : "bg-green-600 hover:bg-green-700", "text-white active:scale-95 shadow-lg shadow-green-500/20")}>
                            {isSubmitting ? <><div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> Publishing...</> : <><CheckCircle className="w-6 h-6" /> {isAdmin ? "Publish Direct" : "Submit Listing"}</>}
                        </Button>
                    )}
                </div>
            </form >
        </div >
    );
};
