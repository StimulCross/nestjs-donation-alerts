import { Module } from '@nestjs/common';
import { DonationAlertsAuthRefreshingProviderOptionsFactory } from './donation-alerts-auth-refreshing-provider-options.factory';
import { DonationAlertsAuthStaticProviderOptionsFactory } from './donation-alerts-auth-static-provider-options.factory';

@Module({
	providers: [DonationAlertsAuthStaticProviderOptionsFactory, DonationAlertsAuthRefreshingProviderOptionsFactory],
	exports: [DonationAlertsAuthStaticProviderOptionsFactory, DonationAlertsAuthRefreshingProviderOptionsFactory],
})
export class DonationAlertsAuthOptionsFactoryModule {}
