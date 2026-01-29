import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import {
    LayoutDashboard,
    Building2,
    Users,
    PlusCircle,
    Settings,
    LogOut,
    Building
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

export default function AdminLayout() {
    const { logout } = useAuth();
    const navigate = useNavigate();

    const menuItems = [
        { icon: LayoutDashboard, label: 'Dashboard', path: '/admin' },
        { icon: Building2, label: 'Properties', path: '/admin/properties' },
        { icon: Users, label: 'Users', path: '/admin/users' },
        { icon: PlusCircle, label: 'Post Property', path: '/admin/post-property' },
        { icon: Settings, label: 'Settings', path: '/admin/settings' },
    ];

    const handleLogout = () => {
        logout();
        navigate('/admin/login');
    };

    return (
        <div className="flex h-screen bg-neutral-50 dark:bg-neutral-950">
            {/* Sidebar */}
            <aside className="w-64 bg-white dark:bg-neutral-900 border-r border-border flex flex-col relative">
                <div className="p-6 border-b border-border">
                    <div className="flex items-center gap-2 mb-2">
                        <Building className="w-6 h-6 text-primary" />
                        <span className="font-display font-bold text-xl uppercase tracking-tighter">
                            ZeroBroker<span className="text-primary text-xs ml-1 font-normal capitalize">Admin</span>
                        </span>
                    </div>
                </div>

                <nav className="flex-1 p-4 space-y-2">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.path}
                            to={item.path}
                            end={item.path === '/admin'}
                            className={({ isActive }) =>
                                `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${isActive
                                    ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/20'
                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground'
                                }`
                            }
                        >
                            <item.icon className="w-5 h-5" />
                            {item.label}
                        </NavLink>
                    ))}
                </nav>

                <div className="p-4 border-t border-border">
                    <Button
                        variant="ghost"
                        className="w-full justify-start text-destructive hover:text-destructive hover:bg-destructive/10 rounded-xl"
                        onClick={handleLogout}
                    >
                        <LogOut className="w-5 h-5 mr-3" />
                        Logout
                    </Button>
                </div>
            </aside>

            {/* Main Content */}
            <main className="flex-1 overflow-y-auto">
                <header className="h-16 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-border flex items-center justify-between px-8 sticky top-0 z-10">
                    <h2 className="font-semibold text-lg">Administrative Panel</h2>
                    <div className="flex items-center gap-4">
                        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                            <Users className="w-4 h-4 text-primary" />
                        </div>
                    </div>
                </header>
                <div className="p-8">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
