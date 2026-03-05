import React from 'react';
import { Building2, Search, MoreHorizontal, CheckCircle2, XCircle, Trash2, ExternalLink } from 'lucide-react';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow
} from '@/components/ui/table';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { useProperties } from '@/contexts/PropertyContext';
import { toast } from 'sonner';

export default function AdminProperties() {
    const { properties, deleteProperty, verifyProperty } = useProperties();
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.locality.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleDelete = (id: string) => {
        if (window.confirm('Are you sure you want to delete this property?')) {
            deleteProperty(id);
            toast.success('Property deleted successfully');
        }
    };

    const handleToggleVerify = async (id: string, currentStatus: boolean) => {
        try {
            await verifyProperty(id, !currentStatus);
            toast.success(`Property ${!currentStatus ? 'verified' : 'unverified'} successfully`);
        } catch (error) {
            toast.error(`Failed to ${!currentStatus ? 'verify' : 'unverify'} property. Please check your permissions.`);
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Property Listings</h1>
                    <p className="text-muted-foreground mt-1">Manage and verify all property listings.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by title or location..."
                        className="pl-10 h-10 rounded-xl"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-border rounded-2xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <Table>
                        <TableHeader className="bg-muted/50">
                            <TableRow>
                                <TableHead className="min-w-[250px]">Property</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Price</TableHead>
                                <TableHead>Location</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredProperties.map((property) => (
                                <TableRow key={property.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg bg-muted flex items-center justify-center overflow-hidden shrink-0">
                                                {property.images && property.images[0] ? (
                                                    <img src={property.images[0]} className="w-full h-full object-cover" alt="" />
                                                ) : (
                                                    <Building2 className="w-6 h-6 text-muted-foreground" />
                                                )}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm line-clamp-1">{property.title}</p>
                                                <p className="text-xs text-muted-foreground underline">#{property.id.slice(0, 8)}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize text-xs rounded-full">
                                            {property.type}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-medium">
                                        ₹{property.price.toLocaleString('en-IN')}
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {property.locality}, {property.city}
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={property.verified ? 'default' : 'secondary'}
                                            className="capitalize text-xs rounded-full px-3"
                                        >
                                            {property.verified ? 'Verified' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => window.open(`/property/${property.id}`, '_blank')}>
                                                    <ExternalLink className="w-4 h-4 mr-2" /> View Listing
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="cursor-pointer" onClick={() => handleToggleVerify(property.id, property.verified)}>
                                                    {property.verified ? (
                                                        <><XCircle className="w-4 h-4 mr-2 text-yellow-500" /> Mark Pending</>
                                                    ) : (
                                                        <><CheckCircle2 className="w-4 h-4 mr-2 text-green-500" /> Verify Property</>
                                                    )}
                                                </DropdownMenuItem>
                                                <DropdownMenuItem className="text-destructive cursor-pointer" onClick={() => handleDelete(property.id)}>
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete Listing
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {filteredProperties.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                        No properties found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
