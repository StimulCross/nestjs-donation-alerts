import { type DonationAlertsAuthOptions } from './donation-alerts-auth-options.interface';

/**
 * Factory class to create Donation Alerts authentication provider options.
 */
export interface DonationAlertsAuthOptionsFactory {
	/**
	 * Creates Donation Alerts authentication provider options.
	 */
	createDonationAlertsAuthOptions(): DonationAlertsAuthOptions | Promise<DonationAlertsAuthOptions>;
}
