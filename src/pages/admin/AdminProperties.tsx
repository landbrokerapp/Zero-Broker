import React from 'react';
import {
    Building2,
    Search,
    MoreVertical,
    CheckCircle2,
    XCircle,
    Trash2,
    ExternalLink,
    Filter
} from 'lucide-react';
import { useProperties } from '@/contexts/PropertyContext';
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
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';

export default function AdminProperties() {
    const { properties, verifyProperty, deleteProperty } = useProperties();
    const [searchTerm, setSearchTerm] = React.useState('');

    const filteredProperties = properties.filter(p =>
        p.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.locality.toLowerCase().includes(searchTerm.toLowerCase()) ||
        p.id.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const handleVerify = (id: string) => {
        verifyProperty(id);
        toast.success('Property verified successfully');
    };

    const handleDelete = (id: string) => {
        if (confirm('Are you sure you want to delete this listing?')) {
            deleteProperty(id);
            toast.success('Listing removed');
        }
    };

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">Property Listings</h1>
                    <p className="text-muted-foreground mt-1">Manage all listings published on the platform.</p>
                </div>

                <div className="flex items-center gap-2">
                    <div className="relative w-full md:w-80">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                        <Input
                            placeholder="Search by ID, name, or area..."
                            className="pl-10 h-10 rounded-xl"
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                        />
                    </div>
                    <Button variant="outline" size="icon" className="rounded-xl">
                        <Filter className="w-4 h-4" />
                    </Button>
                </div>
            </div>

            <div className="bg-white dark:bg-neutral-900 border border-border rounded-2xl overflow-hidden shadow-sm">
                <Table>
                    <TableHeader className="bg-muted/50">
                        <TableRow>
                            <TableHead className="w-[100px]">ID</TableHead>
                            <TableHead>Property Detail</TableHead>
                            <TableHead>Type/Intent</TableHead>
                            <TableHead>Location</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {filteredProperties.length > 0 ? (
                            filteredProperties.map((p) => (
                                <TableRow key={p.id} className="group hover:bg-muted/30">
                                    <TableCell className="font-mono text-xs text-muted-foreground">
                                        #{p.id.slice(0, 8)}
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-12 h-12 rounded-lg overflow-hidden bg-muted flex-shrink-0">
                                                <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                                            </div>
                                            <div className="max-w-[200px]">
                                                <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                                                <p className="text-xs text-muted-foreground">₹{p.price.toLocaleString()}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="capitalize text-sm">
                                            {p.type}
                                            <span className="mx-1 text-muted-foreground">/</span>
                                            <span className="text-muted-foreground">{p.intent}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {p.locality}
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant={p.verified ? 'default' : 'secondary'} className="rounded-full">
                                            {p.verified ? 'Verified' : 'Pending'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                                    <MoreVertical className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl shadow-xl">
                                                {!p.verified && (
                                                    <DropdownMenuItem onClick={() => handleVerify(p.id)} className="text-green-500 cursor-pointer">
                                                        <CheckCircle2 className="w-4 h-4 mr-2" />
                                                        Verify Listing
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem asChild>
                                                    <a href={`/property/${p.id}`} target="_blank" rel="noreferrer" className="cursor-pointer">
                                                        <ExternalLink className="w-4 h-4 mr-2" />
                                                        View Preview
                                                    </a>
                                                </DropdownMenuItem>
                                                <DropdownMenuItem onClick={() => handleDelete(p.id)} className="text-destructive cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" />
                                                    Delete Entry
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : (
                            <TableRow>
                                <TableCell colSpan={6} className="h-32 text-center text-muted-foreground">
                                    No listings match your search criteria.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
