import { ApiClient } from '@donation-alerts/api';
import { type AuthProvider, StaticAuthProvider } from '@donation-alerts/auth';
import { EventsClient } from '@donation-alerts/events';
import { type INestApplication, type ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { DonationAlertsEventsClientOptionsFactoryModule } from './mock/donation-alerts-events-client-options-factory.module';
import { DonationAlertsEventsClientOptionsFactory } from './mock/donation-alerts-events-client-options-factory.service';
import { EventsClientTestingService } from './mock/events-client-testing-service';
import { DONATION_ALERTS_API_CLIENT, DonationAlertsApiModule } from '../../packages/api/src';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '../../packages/auth/src';
import { DonationAlertsEventsModule, type DonationAlertsEventsOptions } from '../../packages/events/src';
import { MOCK_CLIENT_ID, MOCK_SCOPES } from '../constants';

const createApiClient = (): ApiClient =>
	new ApiClient({
		authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES)
	});

const createTestApp = async (imports: ModuleMetadata['imports']): Promise<INestApplication> => {
	const TestingModule = await Test.createTestingModule({
		imports,
		providers: [EventsClientTestingService]
	}).compile();
	return TestingModule.createNestApplication();
};

const testEventsClient = (eventsClient: EventsClient): void => {
	expect(eventsClient).toBeDefined();
	expect(eventsClient).toBeInstanceOf(EventsClient);
};

describe('Donation Alerts events module test suite', () => {
	describe('Static "register" method', () => {
		test('should register the module', async () => {
			const app = await createTestApp([
				DonationAlertsEventsModule.register({
					apiClient: createApiClient()
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});
	});

	describe('Static "registerAsync" method', () => {
		test('should register the module with "useExisting" factory', async () => {
			const app = await createTestApp([
				DonationAlertsEventsModule.registerAsync({
					imports: [DonationAlertsEventsClientOptionsFactoryModule],
					useExisting: DonationAlertsEventsClientOptionsFactory
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});

		test('should register the module with "useClass" factory', async () => {
			const app = await createTestApp([
				DonationAlertsEventsModule.registerAsync({
					imports: [DonationAlertsEventsClientOptionsFactoryModule],
					useClass: DonationAlertsEventsClientOptionsFactory
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});

		test('should register the module with "useFactory" function', async () => {
			const app = await createTestApp([
				DonationAlertsEventsModule.registerAsync({
					useFactory: () => {
						return { apiClient: createApiClient() };
					}
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});

		test('"useFactory" function should inject specified dependencies', async () => {
			const useFactory = (factory: DonationAlertsEventsClientOptionsFactory): DonationAlertsEventsOptions => {
				expect(factory).toBeInstanceOf(DonationAlertsEventsClientOptionsFactory);
				return {
					apiClient: createApiClient()
				};
			};

			const app = await createTestApp([
				DonationAlertsEventsModule.registerAsync({
					imports: [DonationAlertsEventsClientOptionsFactoryModule],
					inject: [DonationAlertsEventsClientOptionsFactory],
					useFactory
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});

		test('should register the module with DonationAlertsApiModule', async () => {
			const app = await createTestApp([
				DonationAlertsEventsModule.registerAsync({
					imports: [
						DonationAlertsApiModule.registerAsync({
							imports: [
								DonationAlertsAuthModule.register({
									type: 'static',
									clientId: MOCK_CLIENT_ID,
									scopes: MOCK_SCOPES
								})
							],
							inject: [DONATION_ALERTS_AUTH_PROVIDER],
							useFactory: (authProvider: AuthProvider) => {
								return { authProvider };
							}
						})
					],
					inject: [DONATION_ALERTS_API_CLIENT],
					useFactory: (apiClient: ApiClient) => {
						return { apiClient };
					}
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});

		test('should register the module with global DonationAlertsAuthModule', async () => {
			const app = await createTestApp([
				DonationAlertsAuthModule.register({
					isGlobal: true,
					type: 'static',
					clientId: MOCK_CLIENT_ID,
					scopes: MOCK_SCOPES
				}),
				DonationAlertsApiModule.registerAsync({
					isGlobal: true,
					inject: [DONATION_ALERTS_AUTH_PROVIDER],
					useFactory: (authProvider: AuthProvider) => {
						return { authProvider };
					}
				}),
				DonationAlertsEventsModule.registerAsync({
					isGlobal: true,
					inject: [DONATION_ALERTS_API_CLIENT],
					useFactory: (apiClient: ApiClient) => {
						return { apiClient };
					}
				})
			]);

			const eventsClientTestingService = app.get(EventsClientTestingService);
			await app.init();

			testEventsClient(eventsClientTestingService.eventsClient);
		});
	});
});
