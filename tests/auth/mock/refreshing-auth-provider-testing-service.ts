import { RefreshingAuthProvider } from '@donation-alerts/auth';
import { Injectable } from '@nestjs/common';
import { InjectAuthProvider } from '../../../packages/auth/src';

@Injectable()
export class RefreshingAuthProviderTestingService {
	constructor(@InjectAuthProvider() public readonly authProvider: RefreshingAuthProvider) {}
}
