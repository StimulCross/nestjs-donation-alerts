import { type DonationAlertsEventsOptions } from './donation-alerts-events-options.interface';

/**
 * Factory class to create Donation Alerts events client options.
 */
export interface DonationAlertsEventsOptionsFactory {
	/**
	 * Creates Donation Alerts events client options.
	 */
	createDonationAlertsEventsOptions(): DonationAlertsEventsOptions | Promise<DonationAlertsEventsOptions>;
}
