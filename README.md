# NestJS Donation Alerts

A set of NestJS wrapper modules around [@donation-alerts](https://github.com/StimulCross/donation-alerts) packages to easily and natively integrate them into your NestJS project.

Each module is a standalone package, so you can use it independently depending on your needs.

> [!IMPORTANT]
> These packages require `@donation-alerts` version **3.0.0** or higher.

## Packages

Read the documentation for individual packages for details.

-   [@nestjs-donation-alerts/auth](https://github.com/stimulcross/nestjs-donation-alerts/tree/main/packages/auth) - wraps [@donation-alerts/auth](https://github.com/StimulCross/donation-alerts/tree/main/packages/auth)

-   [@nestjs-donation-alerts/api](https://github.com/stimulcross/nestjs-donation-alerts/tree/main/packages/api) - wraps [@donation-alerts/api](https://github.com/StimulCross/donation-alerts/tree/main/packages/api)

-   [@nestjs-donation-alerts/events](https://github.com/stimulcross/nestjs-donation-alerts/tree/main/packages/events) - wraps [@donation-alerts/events](https://github.com/StimulCross/donation-alerts/tree/main/packages/events)

## General Usage

All packages are designed to provide a [dynamic module](https://docs.nestjs.com/fundamentals/dynamic-modules) and thus must be registered either with `register` or `registerAsync` static methods.

### Sync Module Configuration

`register` static method allows you to pass options directly. This can be useful for quick tests.

```ts
import { Module } from '@nestjs/common';
import { StaticAuthProvider } from '@donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';

@Module({
	imports: [
		DonationAlertsApiModule.register({
			isGlobal: true,
			authProvider: new StaticAuthProvider('<CLIENT_ID>')
		})
	]
})
export class AppModule {}
```

### Async Module Configuration

The more flexible way to register modules is using `registerAsync` static method. This method can resolve options dynamically using one of the following factories: `useFactory`, `useExisting`, or `useClass`. The reason you should prefer `registerAsync` over `register` is that you can inject any other providers into the factory method.

#### useFactory

`useFactory` is a function that returns options. We can specify any providers that will be injected into the `useFactory` function:

```ts
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { RefreshingAuthProvider } from '@donation-alerts/auth';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';

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
		}),
		DonationAlertsApiModule.registerAsync({
			isGlobal: true,
			// Use DONATION_ALERTS_AUTH_PROVIDER token
			// to inject the auth provider registered above
			inject: [DONATION_ALERTS_AUTH_PROVIDER],
			useFactory: (authProvider: RefreshingAuthProvider) => {
				// Here we are able to access the auth provider instance
				// from the module above
				return { authProvider };
			}
		})
	]
})
export class AppModule {}
```

In the above example, we first registered `DonationAlertsAuthModule` using `useFactory` function and then injected its provider (`DONATION_ALERTS_AUTH_PROVIDER`) into the `DonationAlertsApiModule`.

As said above, you can inject any provider to the factory function, such as a [config](https://docs.nestjs.com/techniques/configuration) service, so that you can dynamically build the options object.

#### useExisting and useClass

Another option is to use class factories in which you can also inject any providers.

> [!IMPORTANT]
> Each package provides the interface that a factory class must implement to provide the factory method that creates options.

So we can create a provider that creates options something like this:

```ts
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { type DonationAlertsAuthOptions, DonationAlertsAuthOptionsFactory } from '@nestjs-donation-alerts/auth';

@Injectable()
export class DaAuthOptionsFactory implements DonationAlertsAuthOptionsFactory {
	constructor(private readonly _configService: ConfigService) {}

	// This method must be implemented according to `DonationAlertsAuthOptionsFactory` interface
	createDonationAlertsAuthOptions(): DonationAlertsAuthOptions {
		return {
			type: 'refreshing',
			clientId: this._configService.get('DA_CLIENT_ID'),
			clientSecret: this._configService.get('DA_CLIENT_SECRET'),
			scopes: this._configService.get('DA_SCOPES')
		};
	}
}
```

And the module:

```ts
import { Global, Module } from '@nestjs/common';

@Global()
@Module({
	providers: [DaAuthOptionsFactory],
	exports: [DaAuthOptionsFactory]
})
export class DaAuthOptionsFactoryModule {}
```

Now we can use this factory to create options for our `DonationAlertsAuthModule` using either `useExisting` or `useClass` properties. `useExisting` will use the single shared instance of the factory across the entire application, while `useClass` creates a new private instance of the factory for each module.

```ts
import { DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';

@Module({
	imports: [
		// The options factory must be registered as well
		DaAuthOptionsFactoryModule,
		DonationAlertsAuthModule.registerAsync({
			isGlobal: true,
			useClass: DaAuthOptionsFactory
		})
	]
})
export class AppModule {}
```

### Global Modules

Making modules global (`isGlobal: true`) means they can be accessed from anywhere in your app no matter where they were registered. In most cases, this is desirable behavior, since you need only the single instance of auth provider, API client, and events client.

But you can also create an encapsulated module that will be visible only inside the module scope where it was registered.

```ts
import { Module } from '@nestjs/common';
import { StaticAuthProvider } from '@donation-alerts/auth';
import { DonationAlertsApiModule } from '@nestjs-donation-alerts/api';
import { DONATION_ALERTS_AUTH_PROVIDER, DonationAlertsAuthModule } from '@nestjs-donation-alerts/auth';

@Module({
	imports: [
		DonationAlertsApiModule.registerAsync({
			imports: [
				DonationAlertsAuthModule.register({
					type: 'static',
					clientId: '<CLIENT_ID>',
					scopes: ['oauth-user-show', 'oauth-donation-index', 'oauth-custom_alert-store']
				})
			],
			inject: [DONATION_ALERTS_AUTH_PROVIDER],
			useFactory: (authProvider: StaticAuthProvider) => {
				return { authProvider };
			}
		})
	],
	providers: [CustomProvider],
	exports: [CustomProvider]
})
export class CustomModule {}
```

In the above example, we created `DonationAlertsApiModule` that can be accessed only within `CustomModule` (including its provider `CustomProvider`) where we registered it.

Note that `DonationAlertsAuthModule` was registered inside `DonationAlertsApiModule`, so it can be accessed only inside `DonationAlertsApiModule` internally and can't be reused for other modules.

## Tests

Available test commands: `test`, `test:verbose`, `test:cov`, `test:cov:verbose`.

```
yarn test
```

or

```
npm run test
```

### Coverage

`test:cov` script output:

```
 PASS   auth  tests/auth/donation-alerts-auth-module.spec.ts
 PASS   api  tests/api/donation-alerts-api.module.spec.ts
 PASS   events  tests/events/donation-alerts-events.module.spec.ts
--------------------------------------|---------|----------|---------|---------|-------------------
File                                  | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
--------------------------------------|---------|----------|---------|---------|-------------------
All files                             |     100 |      100 |     100 |     100 |
 api/src                              |     100 |      100 |     100 |     100 |
  donation-alerts-api.constants.ts    |     100 |      100 |     100 |     100 |
  donation-alerts-api.module.ts       |     100 |      100 |     100 |     100 |
 api/src/decorators                   |     100 |      100 |     100 |     100 |
  inject-api-client.decorator.ts      |     100 |      100 |     100 |     100 |
 auth/src                             |     100 |      100 |     100 |     100 |
  donation-alerts-auth.constants.ts   |     100 |      100 |     100 |     100 |
  donation-alerts-auth.module.ts      |     100 |      100 |     100 |     100 |
 auth/src/decorators                  |     100 |      100 |     100 |     100 |
  inject-auth-provider.decorator.ts   |     100 |      100 |     100 |     100 |
 events/src                           |     100 |      100 |     100 |     100 |
  donation-alerts-events.constants.ts |     100 |      100 |     100 |     100 |
  donation-alerts-events.module.ts    |     100 |      100 |     100 |     100 |
 events/src/decorators                |     100 |      100 |     100 |     100 |
  inject-events-client.decorator.ts   |     100 |      100 |     100 |     100 |
--------------------------------------|---------|----------|---------|---------|-------------------

Test Suites: 3 passed, 3 total
Tests:       48 passed, 48 total
Snapshots:   0 total
Time:        5.703 s, estimated 8 s
Ran all test suites in 3 projects.
Done in 6.47s.
```
