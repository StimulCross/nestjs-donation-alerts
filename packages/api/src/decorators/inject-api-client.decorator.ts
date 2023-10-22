import { Inject } from '@nestjs/common';
import { DONATION_ALERTS_API_CLIENT } from '../donation-alerts-api.constants';

/**
 * Injects `ApiClient` instance.
 *
 * @example
 * import { ApiClient } from '@donation-alerts/api';
 *
 * ```ts
 * @Injectable()
 * export class CustomProvider {
 *     constructor(@InjectApiClient() private readonly _apiClient: ApiClient) {}
 * }
 * ```
 */
export const InjectApiClient = (): ParameterDecorator => Inject(DONATION_ALERTS_API_CLIENT);
