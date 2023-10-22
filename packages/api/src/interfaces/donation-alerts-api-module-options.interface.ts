import { type ModuleMetadata, type Type } from '@nestjs/common';
import { type DonationAlertsApiOptionsFactory } from './donation-alerts-api-options-factory.interface';
import { type DonationAlertsApiOptions } from './donation-alerts-api-options.interface';

/**
 * Donation Alerts API module extra options.
 */
export interface DonationAlertsApiModuleExtraOptions {
	/**
	 * Whether the module should be global.
	 */
	isGlobal?: boolean;
}

/**
 * Donation Alerts API module options.
 */
export type DonationAlertsApiModuleOptions = DonationAlertsApiModuleExtraOptions & DonationAlertsApiOptions;

/**
 * Donation Alerts API module async options.
 */
export interface DonationAlertsApiModuleAsyncOptions
	extends DonationAlertsApiModuleExtraOptions,
		Pick<ModuleMetadata, 'imports'> {
	/**
	 * Dependencies that a factory may inject.
	 */
	inject?: any[];

	/**
	 * Injection token resolving to a class that will be instantiated as a provider.
	 *
	 * The class must implement {@link DonationAlertsApiOptionsFactory} interface.
	 */
	useClass?: Type<DonationAlertsApiOptionsFactory>;

	/**
	 * Injection token resolving to an existing provider.
	 *
	 * The provider must implement {@link DonationAlertsApiOptionsFactory} interface.
	 */
	useExisting?: Type<DonationAlertsApiOptionsFactory>;

	/**
	 * Function returning options (or a Promise resolving to options) to configure the auth provider.
	 */
	useFactory?: (...args: any[]) => DonationAlertsApiOptions | Promise<DonationAlertsApiOptions>;
}
