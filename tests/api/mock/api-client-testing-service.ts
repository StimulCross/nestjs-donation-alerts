import { ApiClient } from '@donation-alerts/api';
import { Injectable } from '@nestjs/common';
import { InjectApiClient } from '../../../packages/api/src';

@Injectable()
export class ApiClientTestingService {
	constructor(@InjectApiClient() public readonly apiClient: ApiClient) {}
}
