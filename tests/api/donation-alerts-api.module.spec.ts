import { ApiClient } from '@donation-alerts/api';
import { type AuthProvider, StaticAuthProvider } from '@donation-alerts/auth';
import { type INestApplication, type ModuleMetadata } from '@nestjs/common';
import { Test } from '@nestjs/testing';
import { ApiClientTestingService } from './mock/api-client-testing-service';
import { DonationAlertsApiClientOptionsFactory } from './mock/donation-alerts-api-client-options-factory';
import { DonationAlertsApiClientOptionsFactoryModule } from './mock/donation-alerts-api-client-options-factory.module';
import { DonationAlertsApiModule, type DonationAlertsApiOptions } from '../../packages/api/src';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '../../packages/auth/src';
import { MOCK_CLIENT_ID, MOCK_SCOPES } from '../constants';

const createTestApp = async (imports: ModuleMetadata['imports']): Promise<INestApplication> => {
	const testingModule = await Test.createTestingModule({ imports, providers: [ApiClientTestingService] }).compile();
	return testingModule.createNestApplication();
};

const testApiClient = (apiClient: ApiClient): void => {
	expect(apiClient).toBeDefined();
	expect(apiClient).toBeInstanceOf(ApiClient);
};

describe('Donation Alerts API module test suite', () => {
	describe('Static "register" method', () => {
		test('should register the module', async () => {
			const app = await createTestApp([
				DonationAlertsApiModule.register({
					authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES),
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});
	});

	describe('Static "registerAsync" method', () => {
		test('should register the module with "useExisting" factory', async () => {
			const app = await createTestApp([
				DonationAlertsApiModule.registerAsync({
					imports: [DonationAlertsApiClientOptionsFactoryModule],
					useExisting: DonationAlertsApiClientOptionsFactory,
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});

		test('should register the module with "useClass" factory', async () => {
			const app = await createTestApp([
				DonationAlertsApiModule.registerAsync({
					imports: [DonationAlertsApiClientOptionsFactoryModule],
					useClass: DonationAlertsApiClientOptionsFactory,
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});

		test('should register the module with "useFactory" function', async () => {
			const app = await createTestApp([
				DonationAlertsApiModule.registerAsync({
					useFactory: () => ({ authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES) }),
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});

		test('"useFactory" function should inject specified dependencies', async () => {
			const useFactory = (factory: DonationAlertsApiClientOptionsFactory): DonationAlertsApiOptions => {
				expect(factory).toBeInstanceOf(DonationAlertsApiClientOptionsFactory);
				return { authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES) };
			};

			const app = await createTestApp([
				DonationAlertsApiModule.registerAsync({
					imports: [DonationAlertsApiClientOptionsFactoryModule],
					inject: [DonationAlertsApiClientOptionsFactory],
					useFactory,
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});

		test('should register the module with DonationAlertsApiModule', async () => {
			const app = await createTestApp([
				DonationAlertsApiModule.registerAsync({
					imports: [
						DonationAlertsAuthModule.register({
							type: 'static',
							clientId: MOCK_CLIENT_ID,
							scopes: MOCK_SCOPES,
						}),
					],
					inject: [DONATION_ALERTS_AUTH_PROVIDER],
					useFactory: (authProvider: AuthProvider) => ({ authProvider }),
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});

		test('should register the module with global DonationAlertsApiModule', async () => {
			const app = await createTestApp([
				DonationAlertsAuthModule.register({
					isGlobal: true,
					type: 'static',
					clientId: MOCK_CLIENT_ID,
					scopes: MOCK_SCOPES,
				}),
				DonationAlertsApiModule.registerAsync({
					inject: [DONATION_ALERTS_AUTH_PROVIDER],
					useFactory: (authProvider: AuthProvider) => ({ authProvider }),
				}),
			]);

			const apiClientTestingService = app.get(ApiClientTestingService);
			await app.init();

			testApiClient(apiClientTestingService.apiClient);
		});
	});
});
