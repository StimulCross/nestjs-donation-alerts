import { RefreshingAuthProvider, StaticAuthProvider } from '@donation-alerts/auth';
import { type DynamicModule } from '@nestjs/common';
import { type NestApplication } from '@nestjs/core';
import { Test } from '@nestjs/testing';
import { DonationAlertsAuthOptionsFactoryModule } from './mock/donation-alerts-auth-options-factory.module';
import { DonationAlertsAuthRefreshingProviderOptionsFactory } from './mock/donation-alerts-auth-refreshing-provider-options.factory';
import { DonationAlertsAuthStaticProviderOptionsFactory } from './mock/donation-alerts-auth-static-provider-options.factory';
import { RefreshingAuthProviderTestingService } from './mock/refreshing-auth-provider-testing-service';
import { StaticAuthProviderTestingService } from './mock/static-auth-provider-testing-service';
import { DonationAlertsAuthModule, type DonationAlertsAuthOptions } from '../../packages/auth/src';
import {
	MOCK_ACCESS_TOKEN,
	MOCK_CLIENT_ID,
	MOCK_CLIENT_SECRET,
	MOCK_REFRESH_TOKEN,
	MOCK_SCOPES,
	MOCK_USER_ID,
} from '../constants';

const testStaticAuthProvider = (donationAlertsAuthModule: DynamicModule | Promise<DynamicModule>): void => {
	describe('Static auth provider', () => {
		let app: NestApplication;
		let staticAuthProviderTestingService: StaticAuthProviderTestingService;

		beforeAll(async () => {
			const testingModule = await Test.createTestingModule({
				imports: [donationAlertsAuthModule],
				providers: [StaticAuthProviderTestingService],
			}).compile();

			app = testingModule.createNestApplication();
			staticAuthProviderTestingService = app.get(StaticAuthProviderTestingService);
			staticAuthProviderTestingService.authProvider.addUser(MOCK_USER_ID, {
				accessToken: MOCK_ACCESS_TOKEN,
				scopes: MOCK_SCOPES,
			});

			await app.init();
		});

		test('should be defined', () => {
			expect(staticAuthProviderTestingService.authProvider).toBeDefined();
		});

		test('should be static', () => {
			expect(staticAuthProviderTestingService.authProvider).toBeInstanceOf(StaticAuthProvider);
		});

		test('should has valid credentials', () => {
			expect(staticAuthProviderTestingService.authProvider.clientId).toBe(MOCK_CLIENT_ID);
		});

		test('should has valid scopes', () => {
			expect(staticAuthProviderTestingService.authProvider.getScopesForUser(MOCK_USER_ID)).toStrictEqual(
				MOCK_SCOPES,
			);
		});
	});
};

const testRefreshingAuthProvider = (donationAlertsAuthModule: DynamicModule | Promise<DynamicModule>): void => {
	describe('Refreshing auth provider', () => {
		let app: NestApplication;
		let refreshingAuthProviderTestingService: RefreshingAuthProviderTestingService;

		beforeAll(async () => {
			const testingModule = await Test.createTestingModule({
				imports: [donationAlertsAuthModule],
				providers: [RefreshingAuthProviderTestingService],
			}).compile();

			app = testingModule.createNestApplication();
			refreshingAuthProviderTestingService = app.get(RefreshingAuthProviderTestingService);
			refreshingAuthProviderTestingService.authProvider.addUser(MOCK_USER_ID, {
				accessToken: MOCK_ACCESS_TOKEN,
				refreshToken: MOCK_REFRESH_TOKEN,
				expiresIn: 1000,
				obtainmentTimestamp: Date.now(),
				scopes: MOCK_SCOPES,
			});

			await app.init();
		});

		test('should be defined', () => {
			expect(refreshingAuthProviderTestingService.authProvider).toBeDefined();
		});

		test('should be self-refreshing', () => {
			expect(refreshingAuthProviderTestingService.authProvider).toBeInstanceOf(RefreshingAuthProvider);
		});

		test('should has valid credentials', () => {
			expect(refreshingAuthProviderTestingService.authProvider.clientId).toBe(MOCK_CLIENT_ID);
		});

		test('should has valid scopes', () => {
			expect(refreshingAuthProviderTestingService.authProvider.clientId).toBe(MOCK_CLIENT_ID);
		});
	});
};

describe('Donation Alerts auth module test suite', () => {
	describe('Validation', () => {
		test('should throw error if invalid provider type passed', async () => {
			const t = async (): Promise<void> => {
				const testingModule = await Test.createTestingModule({
					imports: [
						DonationAlertsAuthModule.register({
							// @ts-expect-error Invalid type
							type: 'invalid-type',
							clientId: MOCK_CLIENT_ID,
							accessToken: MOCK_ACCESS_TOKEN,
						}),
					],
				}).compile();

				const app = testingModule.createNestApplication();
				await app.init();
			};

			await expect(t).rejects.toThrow();
		});
	});

	describe('Donation Alerts auth register method', () => {
		const staticAuthModule = DonationAlertsAuthModule.register({
			type: 'static',
			clientId: MOCK_CLIENT_ID,
			scopes: MOCK_SCOPES,
		});

		testStaticAuthProvider(staticAuthModule);

		const refreshingAuthModule = DonationAlertsAuthModule.register({
			type: 'refreshing',
			clientId: MOCK_CLIENT_ID,
			clientSecret: MOCK_CLIENT_SECRET,
			scopes: MOCK_SCOPES,
		});

		testRefreshingAuthProvider(refreshingAuthModule);
	});

	describe('Donation Alerts auth registerAsync method', () => {
		describe('Auth provider should be resolved with "useClass" option', () => {
			const staticAuthModule = DonationAlertsAuthModule.registerAsync({
				imports: [DonationAlertsAuthOptionsFactoryModule],
				useClass: DonationAlertsAuthStaticProviderOptionsFactory,
			});

			testStaticAuthProvider(staticAuthModule);

			const refreshingAuthModule = DonationAlertsAuthModule.registerAsync({
				imports: [DonationAlertsAuthOptionsFactoryModule],
				useClass: DonationAlertsAuthRefreshingProviderOptionsFactory,
			});

			testRefreshingAuthProvider(refreshingAuthModule);
		});

		describe('Auth provider should be resolved with "useExisting" option', () => {
			const staticAuthModule = DonationAlertsAuthModule.registerAsync({
				imports: [DonationAlertsAuthOptionsFactoryModule],
				useExisting: DonationAlertsAuthStaticProviderOptionsFactory,
			});

			testStaticAuthProvider(staticAuthModule);

			const refreshingAuthModule = DonationAlertsAuthModule.registerAsync({
				imports: [DonationAlertsAuthOptionsFactoryModule],
				useExisting: DonationAlertsAuthRefreshingProviderOptionsFactory,
			});

			testRefreshingAuthProvider(refreshingAuthModule);
		});

		describe('Auth provider should be resolved with "useFactory" option', () => {
			const staticAuthModule = DonationAlertsAuthModule.registerAsync({
				useFactory: () => ({
					type: 'static',
					clientId: MOCK_CLIENT_ID,
					accessToken: MOCK_ACCESS_TOKEN,
				}),
			});

			testStaticAuthProvider(staticAuthModule);

			const refreshingAuthModule = DonationAlertsAuthModule.registerAsync({
				useFactory: () => ({
					type: 'refreshing',
					clientId: MOCK_CLIENT_ID,
					clientSecret: MOCK_CLIENT_SECRET,
				}),
			});

			testRefreshingAuthProvider(refreshingAuthModule);

			test('imports should be injected to "useFactory" function', async () => {
				const useFactory = (
					factory: DonationAlertsAuthStaticProviderOptionsFactory,
				): DonationAlertsAuthOptions => {
					expect(factory).toBeInstanceOf(DonationAlertsAuthStaticProviderOptionsFactory);

					return {
						type: 'static',
						clientId: MOCK_CLIENT_ID,
						scopes: MOCK_SCOPES,
					};
				};

				const testingModule = await Test.createTestingModule({
					imports: [
						DonationAlertsAuthModule.registerAsync({
							imports: [DonationAlertsAuthOptionsFactoryModule],
							inject: [DonationAlertsAuthStaticProviderOptionsFactory],
							useFactory,
						}),
					],
				}).compile();

				const app = testingModule.createNestApplication();
				await app.init();
			});
		});
	});
});
