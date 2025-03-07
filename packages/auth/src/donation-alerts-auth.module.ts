import { type AuthProvider, RefreshingAuthProvider, StaticAuthProvider } from '@donation-alerts/auth';
import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import { DONATION_ALERTS_AUTH_OPTIONS, DONATION_ALERTS_AUTH_PROVIDER } from './donation-alerts-auth.constants';
import {
	type DonationAlertsAuthModuleAsyncOptions,
	type DonationAlertsAuthModuleOptions,
	type DonationAlertsAuthOptions,
	type DonationAlertsAuthOptionsFactory,
} from './interfaces';

/**
 * Donation Alerts auth module.
 *
 * The module must be registered using either `register` or `registerAsync` static methods.
 */
@Module({})
export class DonationAlertsAuthModule {
	/**
	 * Registers the module synchronously by passing options directly.
	 *
	 * @param options Donation Alerts auth module options.
	 */
	public static register(options: DonationAlertsAuthModuleOptions): DynamicModule {
		const authProvider = this._createAuthProvider();

		return {
			module: this,
			global: options.isGlobal,
			providers: [this._createOptionsProvider(options), authProvider],
			exports: [authProvider],
		};
	}

	/**
	 * Registers the module asynchronously using one of the following factories: `useFactory`, `useExisting`, or
	 * `useClass`.
	 *
	 * @param options Donation Alerts auth module async options.
	 */
	public static registerAsync(options: DonationAlertsAuthModuleAsyncOptions): DynamicModule {
		const authProvider = this._createAuthProvider();

		return {
			module: this,
			global: options.isGlobal,
			imports: options.imports,
			providers: [...this._createAsyncOptionsProviders(options), authProvider],
			exports: [authProvider],
		};
	}

	private static _createOptionsProvider(options: DonationAlertsAuthOptions): Provider<DonationAlertsAuthOptions> {
		return {
			provide: DONATION_ALERTS_AUTH_OPTIONS,
			useValue: options,
		};
	}

	private static _createAsyncOptionsProviders(options: DonationAlertsAuthModuleAsyncOptions): Provider[] {
		if (options.useExisting ?? options.useFactory) {
			return [this._createAsyncOptionsProvider(options)];
		}

		return [
			this._createAsyncOptionsProvider(options),
			{
				provide: options.useClass!,
				useClass: options.useClass!,
			},
		];
	}

	private static _createAsyncOptionsProvider(
		options: DonationAlertsAuthModuleAsyncOptions,
	): Provider<DonationAlertsAuthOptions> {
		if (options.useFactory) {
			return {
				provide: DONATION_ALERTS_AUTH_OPTIONS,
				useFactory: options.useFactory,
				inject: options.inject ?? [],
			};
		}

		return {
			provide: DONATION_ALERTS_AUTH_OPTIONS,
			useFactory: async (factory: DonationAlertsAuthOptionsFactory) =>
				await factory.createDonationAlertsAuthOptions(),
			inject: [options.useExisting ?? options.useClass!],
		};
	}

	private static _createAuthProviderClient(options: DonationAlertsAuthOptions): AuthProvider {
		switch (options.type) {
			case 'refreshing': {
				return new RefreshingAuthProvider({
					clientId: options.clientId,
					clientSecret: options.clientSecret,
					redirectUri: options.redirectUri,
					scopes: options.scopes,
				});
			}

			case 'static': {
				return new StaticAuthProvider(options.clientId, options.scopes);
			}

			default: {
				throw new Error(
					'Invalid auth provider type. The provider type must be "app", "refreshing", or "static".',
				);
			}
		}
	}

	private static _createAuthProvider(): Provider<AuthProvider> {
		return {
			provide: DONATION_ALERTS_AUTH_PROVIDER,
			inject: [DONATION_ALERTS_AUTH_OPTIONS],
			useFactory: (options: DonationAlertsAuthOptions) => this._createAuthProviderClient(options),
		};
	}
}
