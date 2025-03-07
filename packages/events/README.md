# NestJS Donation Alerts API

A NestJS wrapper for [@donation-alerts/events](https://github.com/StimulCross/donation-alerts/tree/main/packages/events) package.

> [!IMPORTANT]
> These packages require `@donation-alerts` version **3.0.0** or higher.

## Installation

This module can be used in combination with [@nestjs-donation-alerts/auth](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/auth) and [@nestjs-donation-alerts/api](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/api) modules. Install them if necessary.

**yarn:**

```
yarn add @nestjs-donation-alerts/events @donation-alerts/api @donation-alerts/events
```

**npm:**

```
npm i @nestjs-donation-alerts/events @donation-alerts/api @donation-alerts/events
```

## Usage

For basic information, check out the general documentation at the root of the repository [@nestjs-donation-alerts](https://github.com/StimulCross/nestjs-donation-alerts).

Also take a look at the `@donation-alerts/events` API [reference](https://stimulcross.github.io/donation-alerts/modules/events.html).

### Import and Registration

The module must be registered either with [register](https://github.com/StimulCross/nestjs-donation-alerts#sync-module-configuration) or [registerAsync](https://github.com/StimulCross/nestjs-donation-alerts#async-module-configuration) static methods.

To create an events client, you must provide `DonationAlertsEventsOptions`. The options below extended from the [EventsClientConfig](https://stimulcross.github.io/donation-alerts/interfaces/events.EventsClientConfig.html) interface provided by `@donation-alerts/api` package, so the example below may become outdated at some point.

```ts
interface DonationAlertsEventsOptions {
	apiClient: ApiClient;
	logger?: Partial<LoggerOptions>;
}
```

The right approach would be using this module in combination with [@nestjs-donation-alerts/auth](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/auth) and [@nestjs-donation-alerts/api](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/api) modules.

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthProvider } from '@donation-alerts/auth';
import { ApiClient } from '@donation-alerts/api';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';
import { DONATION_ALERTS_API_CLIENT, DonationAlertsApiModule } from '@nestjs-donation-alerts/api';
import { DonationAlertsEventsModule } from '@nestjs-donation-alerts/events';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DonationAlertsAuthModule.registerAsync({
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: 'refreshing',
					clientId: configService.get('DA_CLIENT_ID'),
					clientSecret: configService.get('DA_CLIENT_SECRET'),
					scopes: configService.get('DA_SCOPES'),
				};
			},
		}),
		DonationAlertsApiModule.registerAsync({
			isGlobal: true,
			inject: [DONATION_ALERTS_AUTH_PROVIDER],
			useFactory: (authProvider: AuthProvider) => {
				// Here we are able to access the auth provider instance
				// provided by DonationAlertsAuthModule
				return { authProvider };
			},
		}),
		DonationAlertsEventsModule.registerAsync({
			isGlobal: true,
			inject: [DONATION_ALERTS_API_CLIENT],
			useFactory: (apiClient: ApiClient) => {
				// Here we are able to access the API client instance
				// provided by DonationAlertsApiModule
				return { apiClient };
			},
		}),
	],
})
export class AppModule {}
```

### Using EventsClient

The module internally creates an [EventsClient](https://stimulcross.github.io/donation-alerts/classes/events.EventsClient.html) instance. You can inject it anywhere you need it using `@InjectEventsClient()` decorator:

```ts
import { Injectable } from '@nestjs/common';
import { EventsClient } from '@donation-alerts/events';
import { InjectEventsClient } from '@nestjs-donation-alerts/events';

@Injectable()
export class CustomProvider {
	constructor(@InjectEventsClient() private readonly _eventsClient: EventsClient) {}
}
```

Alternatively, you can use `DONATION_ALERTS_EVENTS_CLIENT` token to inject the `EventsClient` instance:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { EventsClient } from '@donation-alerts/events';
import { DONATION_ALERTS_EVENTS_CLIENT } from '@nestjs-donation-alerts/events';

@Injectable()
export class CustomProvider {
	constructor(@Inject(DONATION_ALERTS_EVENTS_CLIENT) private readonly _eventsClient: EventsClient) {}
}
```
