# Stripe Identity React Native SDK

Stripe Identity enables online businesses to securely verify the identities of users around the world. Robust identity verification helps prevent fraud, simplify compliance, and increase trust. Stripe will use biometric technology (on images of you and your IDs) and other data sources. With the Stripe Identity React Native SDK, you can confidently verify the authenticity of ID documents from over 33 countries in your React Native application.

## Getting started

Get started with our [📚 integration guides](https://stripe.com/docs/identity) and [example project](#run-the-example-app).

> Updating to a newer version of the SDK? See our [changelog](https://github.com/stripe/stripe-identity-react-native/blob/master/CHANGELOG.md).

## Installation

```sh
npm install stripe-identity-react-native
yarn add stripe-identity-react-native
```

### iOS

You'll need to run `pod install` in your `ios` directory to install the native dependencies.

### Requirements

The SDK uses TypeScript features available in Babel version `7.9.0` and above.
Alternatively use the `plugin-transform-typescript` plugin in your project.

#### Android

- Android 5.0 (API level 21) and above

#### iOS

- Compatible with apps targeting iOS 13 or above.

## Stripe Identity SDK initialization

To initialize Stripe Identity SDK in your React Native app, use the `StripeIdentityProvider` component in the screen where you want to use it.

First you need a server-side endpoint to [create the VerificationSession](https://stripe.com/docs/api/identity/verification_sessions/create), then you can send a POST request to create verification session:

```ts
const getCredentials = async () => {
  try {
    const data = await fetch(`${API_URL}/create-verification-session`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        type: 'document',
        options: {
          document: {
            require_matching_selfie: false,
            require_id_number: false,
            require_live_capture: false,
            allowed_types: ['driving_license', 'passport', 'id_card'],
          },
        },
      }),
    });
    const json = await data.json();
    return json;
  } catch (e) {
    return 'Failed';
  }
};
```

Once you get credentials you can use `StripeIdentityProvider` passing optionsProvider to it.

```tsx
// HomeScreen.tsx
import { StripeIdentityProvider } from 'stripe-identity-react-native';
import logo from './assets/logo.png';

function HomeScreen() {
  const fetchOptions = async () => {
    const credentials = await getCredentials();

    return {
      sessionId: credentials.id,
      ephemeralKeySecret: credentials.ephemeral_key_secret,
      merchantLogo: Image.resolveAssetSource(logo),
    };
  };

  return (
    <StripeIdentityProvider optionsProvider={fetchOptions}>
      <Identity />
    </StripeIdentityProvider>
  );
}
```

## useStripeIdentity hook

To get loading and status or call present function you can use `useStripeIdentity` hook:

```tsx
// Identity.tsx
import { useStripeIdentity } from 'stripe-identity-react-native';

function Identity() {
  const { status, present, loading } = useStripeIdentity();

  const handlePress = useCallback(() => {
    present();
  }, [present]);

  const renderContent = useCallback(() => {
    if (loading) {
      return <ActivityIndicator />;
    }

    return (
      <View>
        <Button title="Verify Identity" onPress={handlePress} />
        <Text>Status: {status}</Text>
      </View>
    );
  }, [loading, status, handlePress]);

  return <View>{renderContent()}</View>;
}
```

## init and present methods

If you don't want to use `StripeIdentityProvider`, you can also use these 2 methods to create your own implementation:

`init` method for initialization, if you want to use it, you need to pass options (sessionId,
ephemeralKeySecret, merchantLogo) from your verification session to it:

```tsx
import { init } from 'stripe-identity-react-native';
import logo from './assets/logo.png';

const customInit = async () => {
  const credentials = await getCredentials();

  const options = {
    sessionId: credentials.id,
    ephemeralKeySecret: credentials.ephemeral_key_secret,
    merchantLogo: Image.resolveAssetSource(logo),
  };

  init(options);
};
```

`present` method will return an object with status: 'Idle' | 'Completed' | 'Canceled' | 'Failed':

```tsx
import { present } from 'stripe-identity-react-native';

const customPresent = async () => {
  try {
    const result = await present();

    return result.status;
  } catch (e) {
    return {};
  }
};
```

## Types

There are two types available: Options and IdentityStatus, you can import these in your TypeScript project directly from Stripe Identity React Native SDK:

```tsx
import type { Options, IdentityStatus } from 'stripe-identity-react-native';
```

## Run the example app

- Go to example folder
  - `cd example`
- Install the dependencies
  - `yarn install`
- Install pods
  - `cd ios && pod install`
- Start the example in the example folder
  - `yarn ios`
  - or
  - `yarn android`

## Contributing

See the [contributor guidelines](CONTRIBUTING.md) to learn how to contribute to the repository.
