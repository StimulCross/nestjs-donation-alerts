import { Inject } from '@nestjs/common';
import { DONATION_ALERTS_AUTH_PROVIDER } from '../donation-alerts-auth.constants';

export const InjectAuthProvider = (): ParameterDecorator => Inject(DONATION_ALERTS_AUTH_PROVIDER);
