import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Users, Building2, CheckCircle2, XCircle, TrendingUp, Clock } from 'lucide-react';
import { useProperties } from '@/contexts/PropertyContext';
import { Badge } from '@/components/ui/badge';

export default function AdminDashboard() {
    const { properties } = useProperties();

    const stats = [
        {
            title: 'Total Listings',
            value: properties.length,
            icon: Building2,
            color: 'text-blue-500',
            bg: 'bg-blue-500/10'
        },
        {
            title: 'Verified Properties',
            value: properties.filter(p => p.verified).length,
            icon: CheckCircle2,
            color: 'text-green-500',
            bg: 'bg-green-500/10'
        },
        {
            title: 'Pending Approval',
            value: properties.filter(p => !p.verified).length,
            icon: Clock,
            color: 'text-yellow-500',
            bg: 'bg-yellow-500/10'
        },
        {
            title: 'Active Users',
            value: '1,280',
            icon: Users,
            color: 'text-purple-500',
            bg: 'bg-purple-500/10'
        }
    ];

    return (
        <div className="space-y-8 animate-in fade-in duration-500">
            <div className="flex flex-col gap-1">
                <h1 className="text-2xl md:text-3xl font-bold tracking-tight">System Overview</h1>
                <p className="text-muted-foreground text-base md:text-lg">Real-time metrics for ZeroBroker community.</p>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
                {stats.map((stat) => (
                    <Card key={stat.title} className="border-border shadow-sm hover:shadow-md transition-shadow rounded-2xl">
                        <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                            <CardTitle className="text-sm font-medium text-muted-foreground">
                                {stat.title}
                            </CardTitle>
                            <div className={`${stat.bg} p-2 rounded-xl`}>
                                <stat.icon className={`h-5 w-5 ${stat.color}`} />
                            </div>
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stat.value}</div>
                            <div className="flex items-center text-xs text-green-500 mt-2 font-medium">
                                <TrendingUp className="h-3 w-3 mr-1" />
                                +12% from last week
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader>
                        <CardTitle>Recent Activity</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {properties.slice(0, 5).map((p) => (
                                <div key={p.id} className="flex items-center justify-between p-3 rounded-xl hover:bg-muted/50 transition-colors">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 rounded-lg bg-muted flex items-center justify-center overflow-hidden">
                                            <img src={p.images[0]} className="w-full h-full object-cover" alt="" />
                                        </div>
                                        <div>
                                            <p className="font-medium text-sm line-clamp-1">{p.title}</p>
                                            <p className="text-xs text-muted-foreground">{p.locality}</p>
                                        </div>
                                    </div>
                                    <Badge variant={p.verified ? 'default' : 'secondary'} className="rounded-full">
                                        {p.verified ? 'Verified' : 'Pending'}
                                    </Badge>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border shadow-sm bg-gradient-hero text-primary-foreground border-none overflow-hidden relative">
                    <CardHeader>
                        <CardTitle className="text-primary-foreground">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <p className="opacity-80">Manage your workspace efficiently. Need help with the system?</p>
                        <div className="flex flex-wrap gap-2">
                            <button className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-xl backdrop-blur-md transition-colors text-sm font-medium">
                                Download Report
                            </button>
                            <button className="px-4 py-2 bg-white text-primary rounded-xl font-bold text-sm">
                                Post New Alert
                            </button>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
