import { Module } from '@nestjs/common';
import { DonationAlertsApiClientOptionsFactory } from './donation-alerts-api-client-options-factory';

@Module({
	providers: [DonationAlertsApiClientOptionsFactory],
	exports: [DonationAlertsApiClientOptionsFactory],
})
export class DonationAlertsApiClientOptionsFactoryModule {}
