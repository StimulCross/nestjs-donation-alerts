import { type RefreshingAuthProviderConfig } from '@donation-alerts/auth';

/**
 * The type of the Donation Alerts authentication provider.
 */
export type DonationAlertsAuthProviderType = 'static' | 'refreshing';

export interface DonationAlertsAuthProviderBaseOptions {
	/**
	 * The type of the Donation Alerts authentication provider.
	 *
	 * Possible values are `static` and `refreshing`.
	 */
	type: DonationAlertsAuthProviderType;
}

/**
 * Donation Alerts static authentication provider options.
 */
export interface DonationAlertsStaticAuthProviderOptions extends DonationAlertsAuthProviderBaseOptions {
	type: Extract<DonationAlertsAuthProviderType, 'static'>;

	/**
	 * Donation Alerts client ID.
	 */
	clientId: string;

	/**
	 * The list of scopes that all registering tokens must be valid for.
	 */
	scopes?: string[];
}

/**
 * Donation Alerts self-refreshing authentication provider.
 */
export interface DonationAlertsRefreshingAuthProviderOptions
	extends DonationAlertsAuthProviderBaseOptions,
		RefreshingAuthProviderConfig {
	type: Extract<DonationAlertsAuthProviderType, 'refreshing'>;
}

/**
 * Donation Alerts authentication provider.
 *
 * One of the following auth provider type must be specified: `static` or `refreshing`.
 * Depending on the type, the wrapper will internally create the corresponding Twurple auth provider instance:
 * [StaticAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.StaticAuthProvider.html) or
 * [RefreshingAuthProvider](https://stimulcross.github.io/donation-alerts/classes/auth.RefreshingAuthProvider.html).
 */
export type DonationAlertsAuthOptions =
	| DonationAlertsStaticAuthProviderOptions
	| DonationAlertsRefreshingAuthProviderOptions;
