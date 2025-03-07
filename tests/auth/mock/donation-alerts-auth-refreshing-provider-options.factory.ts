import { Injectable } from '@nestjs/common';
import { type DonationAlertsAuthOptions, type DonationAlertsAuthOptionsFactory } from '../../../packages/auth/src';
import { MOCK_CLIENT_ID, MOCK_CLIENT_SECRET } from '../../constants';

@Injectable()
export class DonationAlertsAuthRefreshingProviderOptionsFactory implements DonationAlertsAuthOptionsFactory {
	createDonationAlertsAuthOptions(): DonationAlertsAuthOptions {
		return {
			type: 'refreshing',
			clientId: MOCK_CLIENT_ID,
			clientSecret: MOCK_CLIENT_SECRET,
		};
	}
}
