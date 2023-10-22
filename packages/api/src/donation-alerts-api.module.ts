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
	 * Registers the module synchronously by direct options passing.
	 *
	 * @param options Donation Alerts API module options.
	 */
	public static register(options: DonationAlertsApiModuleOptions): DynamicModule {
		const apiClient = DonationAlertsApiModule._createApiClientProvider();

		return {
			global: options.isGlobal,
			module: DonationAlertsApiModule,
			providers: [DonationAlertsApiModule._createOptionsProvider(options), apiClient],
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
		const apiClient = DonationAlertsApiModule._createApiClientProvider();

		return {
			global: options.isGlobal,
			module: DonationAlertsApiModule,
			imports: options.imports,
			providers: [...DonationAlertsApiModule._createAsyncOptionsProviders(options), apiClient],
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
		if (options.useExisting || options.useFactory) {
			return [DonationAlertsApiModule._createAsyncOptionsProvider(options)];
		}

		return [
			DonationAlertsApiModule._createAsyncOptionsProvider(options),
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
