import { ApiClient } from '@donation-alerts/api';
import { StaticAuthProvider } from '@donation-alerts/auth';
import { Injectable } from '@nestjs/common';
import {
	type DonationAlertsEventsOptions,
	type DonationAlertsEventsOptionsFactory
} from '../../../packages/events/src';
import { MOCK_CLIENT_ID, MOCK_SCOPES } from '../../constants';

@Injectable()
export class DonationAlertsEventsClientOptionsFactory implements DonationAlertsEventsOptionsFactory {
	async createDonationAlertsEventsOptions(): Promise<DonationAlertsEventsOptions> {
		return await Promise.resolve({
			apiClient: new ApiClient({
				authProvider: new StaticAuthProvider(MOCK_CLIENT_ID, MOCK_SCOPES)
			})
		});
	}
}
