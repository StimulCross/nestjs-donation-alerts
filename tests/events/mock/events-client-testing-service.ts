import { EventsClient } from '@donation-alerts/events';
import { Injectable } from '@nestjs/common';
import { InjectEventsClient } from '../../../packages/events/src';

@Injectable()
export class EventsClientTestingService {
	constructor(@InjectEventsClient() public readonly eventsClient: EventsClient) {}
}
