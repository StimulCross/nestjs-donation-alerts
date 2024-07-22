import { ApiClient } from '@donation-alerts/api';
import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import { DONATION_ALERTS_API_CLIENT, DONATION_ALERTS_API_OPTIONS } from './donation-alerts-api.constants';
import {
	type DonationAlertsApiModuleAsyncOptions,
	type DonationAlertsApiModuleOptions,
	type DonationAlertsApiOptions,
	type DonationAlertsApiOptionsFactory
} from './interfaces';

/**
 * Donation Alerts API client module.
 *
 * The module must be registered using either `register` or `registerAsync` static methods.
 */
@Module({})
export class DonationAlertsApiModule {
	/**
	 * Registers the module synchronously by passing options directly.
	 *
	 * @param options Donation Alerts API module options.
	 */
	public static register(options: DonationAlertsApiModuleOptions): DynamicModule {
		const apiClient = this._createApiClientProvider();

		return {
			global: options.isGlobal,
			module: this,
			providers: [this._createOptionsProvider(options), apiClient],
			exports: [apiClient]
		};
	}

	/**
	 * Registers the module asynchronously using one of the following factories: `useFactory`, `useExisting`, or
	 * `useClass`.
	 *
	 * @param options Donation Alerts API module async options.
	 */
	public static registerAsync(options: DonationAlertsApiModuleAsyncOptions): DynamicModule {
		const apiClient = this._createApiClientProvider();

		return {
			global: options.isGlobal,
			module: this,
			imports: options.imports,
			providers: [...this._createAsyncOptionsProviders(options), apiClient],
			exports: [apiClient]
		};
	}

	private static _createOptionsProvider(options: DonationAlertsApiOptions): Provider<DonationAlertsApiOptions> {
		return {
			provide: DONATION_ALERTS_API_OPTIONS,
			useValue: options
		};
	}

	private static _createAsyncOptionsProviders(options: DonationAlertsApiModuleAsyncOptions): Provider[] {
		if (options.useExisting ?? options.useFactory) {
			return [this._createAsyncOptionsProvider(options)];
		}

		return [
			this._createAsyncOptionsProvider(options),
			{
				provide: options.useClass!,
				useClass: options.useClass!
			}
		];
	}

	private static _createAsyncOptionsProvider(
		options: DonationAlertsApiModuleAsyncOptions
	): Provider<DonationAlertsApiOptions> {
		if (options.useFactory) {
			return {
				provide: DONATION_ALERTS_API_OPTIONS,
				inject: options.inject ?? [],
				useFactory: options.useFactory
			};
		}

		return {
			provide: DONATION_ALERTS_API_OPTIONS,
			inject: [options.useExisting ?? options.useClass!],
			useFactory: async (factory: DonationAlertsApiOptionsFactory) =>
				await factory.createDonationAlertsApiOptions()
		};
	}

	private static _createApiClientProvider(): Provider<ApiClient> {
		return {
			provide: DONATION_ALERTS_API_CLIENT,
			inject: [DONATION_ALERTS_API_OPTIONS],
			useFactory: (options: DonationAlertsApiOptions) => new ApiClient(options)
		};
	}
}
