import { Inject } from '@nestjs/common';
import { DONATION_ALERTS_AUTH_PROVIDER } from '../donation-alerts-auth.constants';

/**
 * Injects the authentication provider instance.
 *
 * One of the following providers will be injected depending on `DonationAlertsAuthModule` config: `StaticAuthProvider`
 * or `RefreshingAuthProvider`.
 *
 * @example
 * ```ts
 * @Injectable()
 * export class CustomProvider {
 *     constructor(@InjectAuthProvider() private readonly _authProvider: RefreshingAuthProvider) {}
 * }
 * ```
 */
export const InjectAuthProvider = (): ParameterDecorator => Inject(DONATION_ALERTS_AUTH_PROVIDER);
