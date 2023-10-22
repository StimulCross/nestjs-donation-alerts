import { type DonationAlertsApiOptions } from './donation-alerts-api-options.interface';

/**
 * Factory class to create Donation Alerts API client options.
 */
export interface DonationAlertsApiOptionsFactory {
	/**
	 * Creates Donation Alerts API client options.
	 */
	createDonationAlertsApiOptions(): DonationAlertsApiOptions | Promise<DonationAlertsApiOptions>;
}
