import { EventsClient } from '@donation-alerts/events';
import { type DynamicModule, Module, type Provider } from '@nestjs/common';
import {
	DONATION_ALERTS_EVENTS_CLIENT,
	DONATION_ALERTS_EVENTS_CLIENT_OPTIONS
} from './donation-alerts-events.constants';
import {
	type DonationAlertsEventsModuleAsyncOptions,
	type DonationAlertsEventsModuleOptions,
	type DonationAlertsEventsOptions,
	type DonationAlertsEventsOptionsFactory
} from './interfaces';

/**
 * Donation Alerts events module.
 *
 * The module must be registered using either `register` or `registerAsync` static methods.
 */
@Module({})
export class DonationAlertsEventsModule {
	/**
	 * Registers the module synchronously by passing options directly.
	 *
	 * @param options Donation Alerts events module options.
	 */
	public static register(options: DonationAlertsEventsModuleOptions): DynamicModule {
		const eventsClient = this._createEventsClientProvider();

		return {
			global: options.isGlobal,
			module: this,
			providers: [this._createOptionsProvider(options), eventsClient],
			exports: [eventsClient]
		};
	}

	/**
	 * Registers the module asynchronously using one of the following factories: `useFactory`, `useExisting`, or
	 * `useClass`.
	 *
	 * @param options Donation Alerts events module async options.
	 */
	public static registerAsync(options: DonationAlertsEventsModuleAsyncOptions): DynamicModule {
		const eventsClient = this._createEventsClientProvider();

		return {
			global: options.isGlobal,
			module: this,
			imports: options.imports,
			providers: [...this._createAsyncOptionsProviders(options), eventsClient],
			exports: [eventsClient]
		};
	}

	private static _createOptionsProvider(options: DonationAlertsEventsOptions): Provider<DonationAlertsEventsOptions> {
		return {
			provide: DONATION_ALERTS_EVENTS_CLIENT_OPTIONS,
			useValue: options
		};
	}

	private static _createAsyncOptionsProviders(options: DonationAlertsEventsModuleAsyncOptions): Provider[] {
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
		options: DonationAlertsEventsModuleAsyncOptions
	): Provider<DonationAlertsEventsOptions> {
		if (options.useFactory) {
			return {
				provide: DONATION_ALERTS_EVENTS_CLIENT_OPTIONS,
				inject: options.inject ?? [],
				useFactory: options.useFactory
			};
		}

		return {
			provide: DONATION_ALERTS_EVENTS_CLIENT_OPTIONS,
			inject: [options.useExisting ?? options.useClass!],
			useFactory: async (factory: DonationAlertsEventsOptionsFactory) =>
				await factory.createDonationAlertsEventsOptions()
		};
	}

	private static _createEventsClientProvider(): Provider<EventsClient> {
		return {
			provide: DONATION_ALERTS_EVENTS_CLIENT,
			inject: [DONATION_ALERTS_EVENTS_CLIENT_OPTIONS],
			useFactory: (options: DonationAlertsEventsOptions) => new EventsClient(options)
		};
	}
}
