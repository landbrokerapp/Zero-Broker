import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useLanguage } from '@/contexts/LanguageContext';

interface OthersPropertyDialogProps {
    children: React.ReactNode;
    onSubmit: (data: { propertyType: string; description: string }) => void;
}

export function OthersPropertyDialog({ children, onSubmit }: OthersPropertyDialogProps) {
    const [open, setOpen] = useState(false);
    const [propertyType, setPropertyType] = useState('');
    const [description, setDescription] = useState('');
    const { t } = useLanguage();

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (propertyType.trim()) {
            onSubmit({ propertyType, description });
            setOpen(false);
            // Reset form
            setPropertyType('');
            setDescription('');
        }
    };

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                {children}
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle className="text-xl font-bold">Specify Property Type</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4 mt-4">
                    <div className="space-y-2">
                        <Label htmlFor="propertyType" className="text-sm font-medium">
                            Property Type *
                        </Label>
                        <Input
                            id="propertyType"
                            placeholder="e.g., Farmhouse, Warehouse, Studio, etc."
                            value={propertyType}
                            onChange={(e) => setPropertyType(e.target.value)}
                            className="w-full"
                            required
                        />
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="description" className="text-sm font-medium">
                            Additional Details (Optional)
                        </Label>
                        <Textarea
                            id="description"
                            placeholder="Add any specific requirements or details..."
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            className="w-full min-h-[100px]"
                            rows={4}
                        />
                    </div>
                    <div className="flex gap-3 pt-2">
                        <Button
                            type="button"
                            variant="outline"
                            className="flex-1"
                            onClick={() => setOpen(false)}
                        >
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="flex-1 bg-primary hover:bg-primary/90"
                            disabled={!propertyType.trim()}
                        >
                            Search
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
