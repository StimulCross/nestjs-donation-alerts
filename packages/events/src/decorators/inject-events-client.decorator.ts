import { Inject } from '@nestjs/common';
import { DONATION_ALERTS_EVENTS_CLIENT } from '../donation-alerts-events.constants';

/**
 * Injects `EventsClient` instance.
 *
 * @example
 * ```ts
 * import { EventsClient } from '@donation-alerts/events';
 *
 * @Injectable()
 * export class CustomProvider {
 *     constructor(@InjectEventsClient() private readonly _eventsClient: EventsClient) {}
 * }
 * ```
 */
export const InjectEventsClient = (): ParameterDecorator => Inject(DONATION_ALERTS_EVENTS_CLIENT);
