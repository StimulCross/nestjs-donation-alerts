import { Module } from '@nestjs/common';
import { DonationAlertsEventsClientOptionsFactory } from './donation-alerts-events-client-options-factory.service';

@Module({
	providers: [DonationAlertsEventsClientOptionsFactory],
	exports: [DonationAlertsEventsClientOptionsFactory],
})
export class DonationAlertsEventsClientOptionsFactoryModule {}
