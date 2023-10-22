import { Injectable } from '@nestjs/common';
import { type DonationAlertsAuthOptions, type DonationAlertsAuthOptionsFactory } from '../../../packages/auth/src';
import { MOCK_CLIENT_ID, MOCK_SCOPES } from '../../constants';

@Injectable()
export class DonationAlertsAuthStaticProviderOptionsFactory implements DonationAlertsAuthOptionsFactory {
	async createDonationAlertsAuthOptions(): Promise<DonationAlertsAuthOptions> {
		return {
			type: 'static',
			clientId: MOCK_CLIENT_ID,
			scopes: MOCK_SCOPES
		};
	}
}
