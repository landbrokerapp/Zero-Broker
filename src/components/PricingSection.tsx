import React from 'react';
import { CheckCircle2, Rocket, Sparkles, ShieldCheck, Zap, Building2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';
import { motion } from 'framer-motion';

export const PricingSection = () => {
    const { t } = useLanguage();
    const features = [
        t('unlimitedListings'),
        t('rmManager'),
        t('verifiedLeads'),
        t('prioritySupport'),
        t('featuredTag'),
        t('noCreditCard')
    ];

    return (
        <section className="py-24 lg:py-32 bg-background relative overflow-hidden">
            {/* Decorative Background Elements */}
            <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl -translate-y-1/2" />
            <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-3xl translate-y-1/2" />

            <div className="container mx-auto px-4 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-4 tracking-tight">
                        {t('pricingPlans')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                        {t('pricingSubtitle')}
                    </p>
                </motion.div>

                <div className="max-w-4xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        whileInView={{ opacity: 1, scale: 1 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8, ease: "easeOut" }}
                        className="relative overflow-hidden rounded-[3rem] p-1 md:p-1.5 bg-gradient-to-br from-primary/20 via-primary/5 to-accent/20 shadow-2xl"
                    >
                        <div className="relative overflow-hidden rounded-[2.85rem] bg-[#0f172a] p-8 md:p-16 text-center">
                            {/* Animated Background Gradient */}
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_0%,_rgba(30,58,138,0.5)_0%,_transparent_50%)] z-0" />
                            <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_80%,_rgba(59,130,246,0.1)_0%,_transparent_50%)] z-0" />

                            {/* Content */}
                            <div className="relative z-10 flex flex-col items-center">
                                {/* Badge */}
                                <motion.div
                                    initial={{ opacity: 0, y: -10 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 0.3 }}
                                    className="inline-flex items-center gap-2 bg-gradient-to-r from-yellow-400 to-orange-500 text-white px-5 py-2 rounded-full font-bold text-sm mb-10 shadow-lg shadow-orange-500/20"
                                >
                                    <Rocket className="w-4 h-4" />
                                    <span className="uppercase tracking-wider">{t('launchOffer')}</span>
                                </motion.div>

                                {/* Heading with Sparkles */}
                                <div className="relative mb-6">
                                    <Sparkles className="absolute -top-8 -left-8 w-8 h-8 text-yellow-500/30 animate-pulse" />
                                    <h3 className="text-4xl md:text-6xl font-bold text-white leading-tight">
                                        {t('premiumFree')}
                                    </h3>
                                    <Sparkles className="absolute -bottom-4 -right-8 w-6 h-6 text-blue-500/30 animate-pulse" />
                                </div>

                                {/* Description */}
                                <p className="text-blue-100/80 text-lg md:text-xl mb-12 max-w-2xl leading-relaxed">
                                    {t('premiumDesc')}
                                </p>

                                {/* Features Grid - Glassmorphism */}
                                <div className="w-full max-w-3xl bg-white/[0.03] backdrop-blur-md rounded-[2rem] p-8 md:p-12 mb-12 border border-white/10 shadow-inner">
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-y-6 gap-x-12 text-left">
                                        {features.map((feature, index) => (
                                            <motion.div
                                                key={index}
                                                initial={{ opacity: 0, x: -10 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                transition={{ delay: 0.1 * index }}
                                                className="flex items-center gap-4 group"
                                            >
                                                <div className="flex-shrink-0 w-8 h-8 rounded-xl bg-gradient-to-br from-yellow-400 to-orange-500 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                                                    <CheckCircle2 className="w-5 h-5 text-white" />
                                                </div>
                                                <span className="text-white/90 font-medium text-lg leading-tight">{feature}</span>
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>

                                {/* CTA Button - Premium Variant */}
                                <div className="relative group">
                                    <div className="absolute -inset-1 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-2xl blur opacity-25 group-hover:opacity-50 transition duration-1000 group-hover:duration-200"></div>
                                    <Button
                                        size="lg"
                                        className="relative bg-gradient-to-r from-yellow-400 to-orange-500 hover:from-yellow-500 hover:to-orange-600 text-white font-bold text-xl h-16 px-12 rounded-2xl shadow-xl transition-all hover:scale-[1.02] active:scale-[0.98]"
                                    >
                                        {t('startFreeTrial')}
                                        <Zap className="ml-2 w-5 h-5 fill-current" />
                                    </Button>
                                </div>

                                {/* Footer Text */}
                                <p className="mt-8 text-blue-300/60 text-sm font-bold tracking-[0.2em] uppercase">
                                    {t('limitedTimeOffer')}
                                </p>
                            </div>

                            {/* Decorative Corner Icons */}
                            <ShieldCheck className="absolute top-12 right-12 w-24 h-24 text-white/[0.02] -rotate-12" />
                            <Building2 className="absolute bottom-12 left-12 w-32 h-32 text-white/[0.02] rotate-12" />
                        </div>
                    </motion.div>
                </div>
            </div>
        </section>
    );
};
