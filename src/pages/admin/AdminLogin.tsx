import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, User, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';

export default function AdminLogin() {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [isLoading, setIsLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);

        // Artificial delay for premium feel
        setTimeout(() => {
            const success = login(username, password);

            if (success) {
                toast.success('Welcome back, Shanmu');
                navigate('/admin');
            } else {
                toast.error('Invalid username or password');
                setIsLoading(false);
            }
        }, 1000);
    };

    return (
        <div className="min-h-screen bg-neutral-950 flex items-center justify-center p-4 relative overflow-hidden">
            {/* Abstract Background Elements */}
            <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full" />
            <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-blue-500/10 blur-[120px] rounded-full" />

            <div className="max-w-md w-full bg-neutral-900/50 backdrop-blur-xl border border-white/5 p-10 rounded-[2.5rem] shadow-2xl relative z-10">
                <div className="flex flex-col items-center mb-10 text-center">
                    <div className="w-20 h-20 bg-gradient-to-br from-primary to-blue-600 rounded-3xl flex items-center justify-center mb-6 shadow-xl shadow-primary/20 transform -rotate-6 hover:rotate-0 transition-transform duration-300">
                        <ShieldCheck className="w-12 h-12 text-white" />
                    </div>
                    <h1 className="text-4xl font-bold text-white mb-2 tracking-tight">Admin Portal</h1>
                    <p className="text-neutral-500 font-medium">ZeroBroker secure management system</p>
                </div>

                <form onSubmit={handleLogin} className="space-y-6">
                    <div className="space-y-2">
                        <Label className="text-neutral-400 ml-1 text-sm font-semibold uppercase tracking-wider">Username</Label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type="text"
                                placeholder="Manager ID"
                                className="h-14 pl-12 bg-neutral-800/50 border-white/10 text-white rounded-2xl focus:ring-primary focus:border-primary/50 transition-all placeholder:text-neutral-600"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label className="text-neutral-400 ml-1 text-sm font-semibold uppercase tracking-wider">Security Access</Label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500 group-focus-within:text-primary transition-colors" />
                            <Input
                                type={showPassword ? "text" : "password"}
                                placeholder="Access Key"
                                className="h-14 pl-12 pr-12 bg-neutral-800/50 border-white/10 text-white rounded-2xl focus:ring-primary focus:border-primary/50 transition-all placeholder:text-neutral-600"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-500 hover:text-white transition-colors"
                                tabIndex={-1}
                            >
                                {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                            </button>
                        </div>
                    </div>

                    <div className="pt-2">
                        <Button
                            type="submit"
                            disabled={isLoading}
                            className="w-full h-14 text-lg font-bold bg-primary hover:bg-primary/90 text-primary-foreground rounded-2xl transition-all shadow-lg hover:shadow-primary/25 active:scale-[0.98] group relative overflow-hidden"
                        >
                            {isLoading ? (
                                <div className="flex items-center gap-3">
                                    <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Verifying...
                                </div>
                            ) : (
                                <div className="flex items-center justify-center">
                                    Authorized Entry
                                    <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                                </div>
                            )}
                        </Button>
                    </div>
                </form>

                <div className="mt-10 text-center">
                    <p className="text-xs text-neutral-600 font-medium uppercase tracking-[0.2em]">
                        Secure End-to-End Encryption
                    </p>
                </div>
            </div>
        </div>
    );
}
