import React from 'react';
import { Users as UsersIcon, Mail, Phone, MoreHorizontal, UserCheck, ShieldOff, Trash2, Search } from 'lucide-react';
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
import { toast } from 'sonner';

export default function AdminUsers() {
    const [searchTerm, setSearchTerm] = React.useState('');

    // Mock users data for demonstration
    const [users] = React.useState([
        { id: '1', name: 'Rajesh Kumar', email: 'rajesh@example.com', phone: '9876543210', role: 'seller', status: 'active', joined: '20-Jan-2026' },
        { id: '2', name: 'Priya Sharma', email: 'priya@example.com', phone: '8765432109', role: 'seller', status: 'active', joined: '21-Jan-2026' },
        { id: '3', name: 'Anita Das', email: 'anita@example.com', phone: '7654321098', role: 'admin', status: 'active', joined: '01-Jan-2026' },
        { id: '4', name: 'Suresh Raina', email: 'suresh@example.com', phone: '6543210987', role: 'seller', status: 'suspended', joined: '15-Jan-2026' },
    ]);

    const filteredUsers = users.filter(u =>
        u.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        u.phone.includes(searchTerm)
    );

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold">User Management</h1>
                    <p className="text-muted-foreground mt-1">View and manage registered accounts.</p>
                </div>

                <div className="relative w-full md:w-80">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                        placeholder="Search by name or phone..."
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
                                <TableHead className="min-w-[200px]">User Profile</TableHead>
                                <TableHead className="min-w-[200px]">Contact Info</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="min-w-[120px]">Joined</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {filteredUsers.map((user) => (
                                <TableRow key={user.id} className="hover:bg-muted/30">
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center font-bold text-primary">
                                                {user.name.charAt(0)}
                                            </div>
                                            <div>
                                                <p className="font-medium text-sm">{user.name}</p>
                                                <p className="text-xs text-muted-foreground underline">#{user.id}</p>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="space-y-1">
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Mail className="w-3 h-3 mr-1" /> {user.email}
                                            </div>
                                            <div className="flex items-center text-xs text-muted-foreground">
                                                <Phone className="w-3 h-3 mr-1" /> {user.phone}
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge variant="outline" className="capitalize text-xs rounded-full">
                                            {user.role}
                                        </Badge>
                                    </TableCell>
                                    <TableCell>
                                        <Badge
                                            variant={user.status === 'active' ? 'default' : 'destructive'}
                                            className="capitalize text-xs rounded-full px-3"
                                        >
                                            {user.status}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="text-sm text-muted-foreground">
                                        {user.joined}
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="rounded-xl">
                                                    <MoreHorizontal className="w-4 h-4" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end" className="w-48 rounded-xl">
                                                <DropdownMenuItem className="cursor-pointer">
                                                    <UserCheck className="w-4 h-4 mr-2" /> View Activity
                                                </DropdownMenuItem>
                                                {user.status === 'active' ? (
                                                    <DropdownMenuItem className="text-yellow-500 cursor-pointer">
                                                        <ShieldOff className="w-4 h-4 mr-2" /> Suspend
                                                    </DropdownMenuItem>
                                                ) : (
                                                    <DropdownMenuItem className="text-green-500 cursor-pointer">
                                                        <UserCheck className="w-4 h-4 mr-2" /> Reactivate
                                                    </DropdownMenuItem>
                                                )}
                                                <DropdownMenuItem className="text-destructive cursor-pointer">
                                                    <Trash2 className="w-4 h-4 mr-2" /> Delete User
                                                </DropdownMenuItem>
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>
        </div>
    );
}
