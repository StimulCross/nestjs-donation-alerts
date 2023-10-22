# NestJS Donation Alerts Auth

A NestJS wrapper for [@donation-alerts/auth](https://github.com/StimulCross/donation-alerts/tree/main/packages/auth) package.

This module can be used alone or in combination with other [@nestjs-doantion-alerts](https://github.com/StimulCross/nestjs-donation-alerts) modules.

> [!IMPORTANT]
> These packages require `@donation-alerts` version **3.0.0** or higher.

## Installation

**yarn:**

```
yarn add @nestjs-donation-alerts/auth @donation-alerts/auth
```

**npm:**

```
npm i @nestjs-donation-alerts/auth @donation-alerts/auth
```

## Usage

For basic information, check out the general documentation at the root of the repository [@nestjs-donation-alerts](https://github.com/StimulCross/nestjs-donation-alerts).

Also take a look at `@donation-alerts/auth` API [reference](https://stimulcross.github.io/donation-alerts/modules/auth.html).

### Import and Registration

The module must be registered either with [register](https://github.com/StimulCross/nestjs-donation-alerts#sync-module-configuration) or [registerAsync](https://github.com/StimulCross/nestjs-donation-alerts#async-module-configuration) static methods. It supports [StaticAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.StaticAuthProvider.html) and [RefreshingAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.RefreshingAuthProvider.html) from `@donation-alerts/auth` package.

To create a static auth provider, you must provide `DonationAlertsStaticAuthProviderOptions`:

```ts
interface DonationAlertsStaticAuthProviderOptions {
	type: 'static';
	clientId: string;
	scopes?: string[];
}
```

To create a refreshing auth provider, you must provide `DonationAlertsRefreshingAuthProviderOptions`.

```ts
interface DonationAlertsRefreshingAuthProviderOptions {
	type: 'refreshing';
	clientId: string;
	clientSecret: string;
	redirectUri?: string;
	scopes?: string[];
}
```

Static auth provider example using the `register` method:

```ts
import { Module } from '@nestjs/common';
import { DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';

@Module({
	imports: [
		DonationAlertsAuthModule.register({
			isGlobal: true,
			type: 'static',
			clientId: '<CLIENT_ID>',
			scopes: ['oauth-user-show', 'oauth-donation-index', 'oauth-custom_alert-store']
		})
	]
})
export class AppModule {}
```

Refreshing auth provider example using the `registerAsync` method:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';

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
					scopes: configService.get('DA_SCOPES')
				};
			}
		})
	]
})
export class AppModule {}
```

### Using the AuthProvider

The module internally creates an `AuthProvider` instance ([StaticAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.StaticAuthProvider.html) or [RefreshingAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.RefreshingAuthProvider.html) depending on the provided options.) You can inject the auth provider instance anywhere you need it using `@InjectAuthProvider()` decorator:

```ts
import { Injectable } from '@nestjs/common';
import { AuthProvider } from '@donation-alerts/auth';
import { InjectAuthProvider } from '@nestjs-donation-alerts/auth';

@Injectable()
export class CustomProvider {
	constructor(@InjectAuthProvider() private readonly _authProvider: AuthProvider) {}
}
```

`AuthProvider` is a generic interface. You can specify the correct auth provider type depending on your `DonationAlertsAuthModule` config: `StaticAuthProvider` or `RefreshingAuthProvider`.

Alternatively, you can use the `DONATION_ALERTS_AUTH_PROVIDER` token to inject the auth provider instance:

```ts
import { Inject, Injectable } from '@nestjs/common';
import { RefreshingAuthProvider } from '@donation-alerts/auth';
import { DONATION_ALERTS_AUTH_PROVIDER } from '@nestjs-donation-alerts/auth';

@Injectable()
export class CustomProvider {
	constructor(@Inject(DONATION_ALERTS_AUTH_PROVIDER) private readonly _authProvider: RefreshingAuthProvider) {}
}
```

### Extended Usage

[@nestjs-donation-alerts/api](https://github.com/stimulcross/nestjs-donation-alerts/tree/main/packages/api) require `AuthProvider` to work. You can use `DonationAlertsAuthModule` module to share the same auth provider instance across all modules:

```ts
import { Module } from '@nestjs/common';
import { AuthProvider } from '@donation-alerts/auth';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';

@Module({
	imports: [
		DonationAlertsAuthModule.registerAsync({
			// Must be true to make it reusable
			isGlobal: true
			// ... other configuration
		}),
		DonationAlertsApiModule.registerAsync({
			isGlobal: true,
			// Inject auth provider to the factory method
			// using DONATION_ALERTS_AUTH_PROVIDER token
			inject: [DONATION_ALERTS_AUTH_PROVIDER],
			useFactory: (authProvider: AuthProvider) => {
				return { authProvider };
			}
		})
	]
})
export class AppModule {}
```
