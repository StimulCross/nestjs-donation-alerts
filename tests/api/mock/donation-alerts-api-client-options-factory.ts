import { StaticAuthProvider } from '@donation-alerts/auth';
import { Injectable } from '@nestjs/common';
import { type DonationAlertsApiOptions, type DonationAlertsApiOptionsFactory } from '../../../packages/api/src';
import { MOCK_CLIENT_ID, MOCK_SCOPES } from '../../constants';

@Injectable()
export class DonationAlertsApiClientOptionsFactory implements DonationAlertsApiOptionsFactory {
	async createDonationAlertsApiOptions(): Promise<DonationAlertsApiOptions> {
		return await Promise.resolve({
			authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES),
		});
	}
}
