import React from 'react';
import { CheckCircle2, Rocket } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useLanguage } from '@/contexts/LanguageContext';

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
        <section className="py-16 lg:py-24 bg-background">
            <div className="container mx-auto px-4">
                <div className="text-center mb-12">
                    <h2 className="font-display text-3xl md:text-4xl font-bold text-foreground mb-4">
                        {t('pricingPlans')}
                    </h2>
                    <p className="text-muted-foreground max-w-2xl mx-auto">
                        {t('pricingSubtitle')}
                    </p>
                </div>

                <div className="max-w-4xl mx-auto">
                    <div className="relative overflow-hidden rounded-[2.5rem] bg-[#1a3689] p-8 md:p-12 text-center shadow-2xl">
                        {/* Background Gradient/Texture */}
                        <div className="absolute inset-0 bg-gradient-to-br from-[#1a3689] to-[#112255] z-0" />

                        {/* Content */}
                        <div className="relative z-10 flex flex-col items-center">
                            {/* Badge */}
                            <div className="inline-flex items-center gap-2 bg-[#eab308] text-[#112255] px-4 py-1.5 rounded-full font-bold text-sm mb-8 shadow-lg">
                                <Rocket className="w-4 h-4 fill-current" />
                                {t('launchOffer')}
                            </div>

                            {/* Heading */}
                            <h3 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                                {t('premiumFree')}
                            </h3>

                            {/* Description */}
                            <p className="text-blue-100 text-lg mb-10 max-w-2xl leading-relaxed">
                                {t('premiumDesc')}
                            </p>

                            {/* Features Grid */}
                            <div className="w-full max-w-3xl bg-white/10 backdrop-blur-sm rounded-2xl p-6 md:p-8 mb-10 border border-white/10">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8 text-left">
                                    {features.map((feature, index) => (
                                        <div key={index} className="flex items-center gap-3">
                                            <div className="flex-shrink-0 w-6 h-6 rounded-full bg-[#eab308] flex items-center justify-center">
                                                <CheckCircle2 className="w-4 h-4 text-[#112255]" />
                                            </div>
                                            <span className="text-white font-medium">{feature}</span>
                                        </div>
                                    ))}
                                </div>
                            </div>

                            {/* CTA Button */}
                            <Button
                                size="lg"
                                className="bg-[#eab308] hover:bg-[#ca8a04] text-[#112255] font-bold text-lg h-14 px-10 rounded-xl shadow-[0_0_20px_rgba(234,179,8,0.3)] transition-all hover:scale-105"
                            >
                                {t('startFreeTrial')}
                            </Button>

                            {/* Footer Text */}
                            <p className="mt-6 text-blue-200 text-xs font-bold tracking-widest uppercase">
                                {t('limitedTimeOffer')}
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};
