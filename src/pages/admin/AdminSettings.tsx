import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Shield, Bell, Globe, Database, Save } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminSettings() {
    const handleSave = () => {
        toast.success('Settings updated successfully');
    };

    return (
        <div className="max-w-4xl space-y-8 animate-in fade-in duration-500">
            <div>
                <h1 className="text-3xl font-bold">System Settings</h1>
                <p className="text-muted-foreground mt-1">Configure global platform parameters and security.</p>
            </div>

            <div className="grid gap-6">
                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                            <Shield className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Platform Security</CardTitle>
                            <CardDescription>Configure authentication and verification protocols.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Manual Verification Required</Label>
                                <p className="text-sm text-muted-foreground">All new listings must be approved by an admin before going live.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                        <div className="flex items-center justify-between">
                            <div className="space-y-0.5">
                                <Label>Two-Factor Auth for Admins</Label>
                                <p className="text-sm text-muted-foreground">Require OTP verification for all administrative logins.</p>
                            </div>
                            <Switch defaultChecked />
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-500">
                            <Bell className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Notifications</CardTitle>
                            <CardDescription>Manage system alerts and user emails.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div className="space-y-2">
                                <Label>Support Email</Label>
                                <Input defaultValue="support@zerobroker.com" className="rounded-xl" />
                            </div>
                            <div className="space-y-2">
                                <Label>Admin Alert Notification</Label>
                                <Input defaultValue="admin-alerts@zerobroker.com" className="rounded-xl" />
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="rounded-2xl border-border shadow-sm">
                    <CardHeader className="flex flex-row items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-orange-500/10 flex items-center justify-center text-orange-500">
                            <Database className="w-5 h-5" />
                        </div>
                        <div>
                            <CardTitle>Database & Storage</CardTitle>
                            <CardDescription>Manage data retention and backups.</CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="p-4 bg-muted/50 rounded-2xl flex items-center justify-between">
                            <div className="text-sm">
                                <p className="font-medium">System Backup Status</p>
                                <p className="text-muted-foreground">Last backup: Today, 03:00 AM</p>
                            </div>
                            <Button variant="outline" size="sm" className="rounded-lg">Run Manual Backup</Button>
                        </div>
                    </CardContent>
                </Card>
            </div>

            <div className="flex justify-end pt-4">
                <Button onClick={handleSave} className="h-12 px-8 rounded-xl font-bold gap-2">
                    <Save className="w-4 h-4" />
                    Save configuration
                </Button>
            </div>
        </div>
    );
}
