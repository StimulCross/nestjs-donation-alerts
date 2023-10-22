import { StaticAuthProvider } from '@donation-alerts/auth';
import { Injectable } from '@nestjs/common';
import { InjectAuthProvider } from '../../../packages/auth/src';

@Injectable()
export class StaticAuthProviderTestingService {
	constructor(@InjectAuthProvider() public readonly authProvider: StaticAuthProvider) {}
}
