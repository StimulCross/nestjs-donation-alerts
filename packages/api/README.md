# NestJS Donation Alerts API

A NestJS wrapper for [@donation-alerts/api](https://github.com/StimulCross/donation-alerts/tree/main/packages/api) package.

> [!IMPORTANT]
> These packages require `@donation-alerts` version **3.0.0** or higher.

## Installation

This module can be used in combination with [@nestjs-donation-alerts/auth](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/auth) module. Install it if necessary.

**yarn:**

```
yarn add @nestjs-donation-alerts/api @donation-alerts/api
```

**npm:**

```
npm i @nestjs-donation-alerts/api @donation-alerts/api
```

## Usage

For basic information, check out the general documentation at the root of the repository [@nestjs-donation-alerts](https://github.com/StimulCross/nestjs-donation-alerts).

Also take a look at the `@donation-alerts/api` API [reference](https://stimulcross.github.io/donation-alerts/modules/api.html).

### Import and Registration

The module must be register either with [register](https://github.com/StimulCross/nestjs-donation-alerts#sync-module-configuration) or [registerAsync](https://github.com/StimulCross/nestjs-donation-alerts#async-module-configuration) static methods.

To create an API client, you must provide `DonationAlertsApiOptions`. The options below extended from the [ApiConfig](https://stimulcross.github.io/donation-alerts/interfaces/api.ApiConfig.html) interface provided by `@donation-alerts/api` package, so the example below may become outdated at some point.

```ts
interface DonationAlertsApiOptions {
	authProvider: AuthProvider;
	fetchOptions?: DonationAlertsApiCallFetchOptions;
	logger?: Partial<LoggerOptions>;
}
```

Example of using `register` method:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider } from '@donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DonationAlertsApiModule.register({
			isGlobal: true,
			authProvider: new RefreshingAuthProvider({
				// ...
			})
		})
	]
})
export class AppModule {}
```

You can also use `DonationAlertsAuthModule` from [@nestjs-donation-alerts/auth](https://github.com/StimulCross/nestjs-donation-alerts/tree/main/packages/auth) package to inject the auth provider:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { AuthProvider } from '@donation-alerts/auth';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';

@Module({
	imports: [
		ConfigModule.forRoot({ isGlobal: true }),
		DonationAlertsAuthModule.registerAsync({
			// Must be `true` to make it reusable
			isGlobal: true,
			inject: [ConfigService],
			useFactory: (configService: ConfigService) => {
				return {
					type: 'refreshing',
					clientId: configService.get('DA_CLIENT_ID'),
					clientSecret: configService.get('DA_CLIENT_SECRET'),
					scopes: configService.get('DA_SCOPES')
				};
			}
		}),
		DonationAlertsApiModule.registerAsync({
			isGlobal: true,
			inject: [DONATION_ALERTS_AUTH_PROVIDER],
			useFactory: (authProvider: AuthProvider) => {
				// Here we are able to access the auth provider instance
				// provided by DonationAlertsAuthModule
				return { authProvider };
			}
		})
	]
})
export class AppModule {}
```

### Using ApiClient

The module internally creates an [ApiClient](https://stimulcross.github.io/donation-alerts/classes/api.ApiClient.html) instance. You can inject it anywhere you need it using `@InjectApiClient()` decorator:

```ts
import { Injectable } from '@nestjs/common';
import { ApiClient } from '@donation-alerts/api';
import { InjectApiClient } from '@nestjs-donation-alerts/api';

@Injectable()
export class CustomProvider {
	constructor(@InjectApiClient() private readonly _apiClient: ApiClient) {}
}
```

Alternatively, you can use `DONATION_ALERTS_AUTH_PROVIDER` token to inject the `ApiClient` instance:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { DONATION_ALERTS_AUTH_PROVIDER } from '@nestjs-donation-alerts/api';
import { ApiClient } from '@donation-alerts/api';

@Injectable()
export class CustomProvider {
	constructor(@Inject(DONATION_ALERTS_AUTH_PROVIDER) private readonly _apiClient: ApiClient) {}
}
```
