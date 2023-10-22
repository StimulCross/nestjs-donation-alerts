import { type ModuleMetadata, type Type } from '@nestjs/common';
import { type DonationAlertsAuthOptionsFactory } from './donation-alerts-auth-options-factory.interface';
import { type DonationAlertsAuthOptions } from './donation-alerts-auth-options.interface';

/**
 * Donation Alerts auth module extra options.
 */
export interface DonationAlertsAuthModuleExtraOptions {
	/**
	 * Whether the module should be registered as global.
	 */
	isGlobal?: boolean;
}

/**
 * Donation Alerts auth module options.
 */
export type DonationAlertsAuthModuleOptions = DonationAlertsAuthOptions & DonationAlertsAuthModuleExtraOptions;

/**
 * Donation Alerts auth module async options.
 */
export interface DonationAlertsAuthModuleAsyncOptions
	extends DonationAlertsAuthModuleExtraOptions,
		Pick<ModuleMetadata, 'imports'> {
	/**
	 * Dependencies that a factory may inject.
	 */
	inject?: any[];

	/**
	 * Injection token resolving to a class that will be instantiated as a provider.
	 *
	 * The class must implement {@link DonationAlertsAuthOptionsFactory} interface.
	 */
	useClass?: Type<DonationAlertsAuthOptionsFactory>;

	/**
	 * Injection token resolving to an existing provider.
	 *
	 * The provider must implement {@link DonationAlertsAuthOptionsFactory} interface.
	 */
	useExisting?: Type<DonationAlertsAuthOptionsFactory>;

	/**
	 * Function returning options (or a Promise resolving to options) to configure the auth provider.
	 */
	useFactory?: (...args: any[]) => DonationAlertsAuthOptions | Promise<DonationAlertsAuthOptions>;
}
