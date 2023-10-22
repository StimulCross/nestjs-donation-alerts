import { type ModuleMetadata, type Type } from '@nestjs/common';
import { type DonationAlertsEventsOptionsFactory } from './donation-alerts-events-options-factory.interface';
import { type DonationAlertsEventsOptions } from './donation-alerts-events-options.interface';

/**
 * Donation Alerts events module extra options.
 */
export interface DonationAlertsEventsModuleExtraOptions {
	/**
	 * Whether the module should be global.
	 */
	isGlobal?: boolean;
}

/**
 * Donation Alerts events module options.
 */
export type DonationAlertsEventsModuleOptions = DonationAlertsEventsModuleExtraOptions & DonationAlertsEventsOptions;

/**
 * Donation Alerts events module async options.
 */
export interface DonationAlertsEventsModuleAsyncOptions
	extends DonationAlertsEventsModuleExtraOptions,
		Pick<ModuleMetadata, 'imports'> {
	/**
	 * Dependencies that a factory may inject.
	 */
	inject?: any[];

	/**
	 * Injection token resolving to a class that will be instantiated as a provider.
	 *
	 * The class must implement {@link DonationAlertsEventsOptionsFactory} interface.
	 */
	useClass?: Type<DonationAlertsEventsOptionsFactory>;

	/**
	 * Injection token resolving to an existing provider.
	 *
	 * The provider must implement {@link DonationAlertsEventsOptionsFactory} interface.
	 */
	useExisting?: Type<DonationAlertsEventsOptionsFactory>;

	/**
	 * Function returning options (or a Promise resolving to options) to configure the auth provider.
	 */
	useFactory?: (...args: any[]) => DonationAlertsEventsOptions | Promise<DonationAlertsEventsOptions>;
}
