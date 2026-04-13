# Android Setup

## What is already installed

The local machine setup completed during this project includes:

- Homebrew `gradle`
- Android command-line tools
- Android platform tools
- Android SDK platform `android-35`
- Android build tools `35.0.0`
- Gradle wrapper

Relevant project files:

- [gradlew](/Users/nina/Documents/Codex/FirstProject/gradlew)
- [local.properties](/Users/nina/Documents/Codex/FirstProject/local.properties)
- [app/build.gradle.kts](/Users/nina/Documents/Codex/FirstProject/app/build.gradle.kts)
- [AndroidManifest.xml](/Users/nina/Documents/Codex/FirstProject/app/src/main/AndroidManifest.xml)

## Current Android app scope

The Android app is no longer just a visual scaffold.

Implemented now:

- customer login screen
- customer registration screen
- authenticated customer session storage
- upcoming trainings fetch through backend API
- book and cancel actions through backend API
- logout flow

Important files:

- [ClubFlowRoot.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/ClubFlowRoot.kt)
- [AuthScreen.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/auth/AuthScreen.kt)
- [AuthViewModel.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/auth/AuthViewModel.kt)
- [HomeScreen.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/ui/home/HomeScreen.kt)
- [KtorClubFlowApi.kt](/Users/nina/Documents/Codex/FirstProject/app/src/main/java/com/clubflow/app/data/remote/KtorClubFlowApi.kt)

## Recommended local environment

Use:

- Android Studio latest stable
- JDK 21 for Gradle and Android builds
- Android SDK 35

## Open the project

1. Open Android Studio
2. Open the folder `/Users/nina/Documents/Codex/FirstProject`
3. Wait for Gradle sync
4. Select the `devDebug` variant for local development

## Build variants

The app currently uses:

- Flavors: `dev`, `staging`, `prod`
- Build types: `debug`, `release`

Useful combinations:

- `devDebug`: local development against local backend
- `stagingDebug`: QA checks
- `prodRelease`: production build

## Base URL configuration

The Android app now supports configurable backend URLs.

Default values:

- `dev`: `http://10.0.2.2:3000/`
- `staging`: `https://api.staging.clubflow.example/`
- `prod`: `https://api.clubflow.example/`

Override options:

- Gradle property: `-Pclubflow.baseUrl.dev=http://192.168.1.50:3000/`
- Environment variable: `CLUBFLOW_BASE_URL_DEV=http://192.168.1.50:3000/`

Use `10.0.2.2` for emulator access to the local machine. Use your Mac's LAN IP for a real Android phone.

## Required backend for realistic testing

Start the admin web app locally because it currently hosts the customer API routes too:

```bash
cd /Users/nina/Documents/Codex/FirstProject/admin-web
npm run dev
```

Customer API routes now available:

- `POST /api/v1/customer/auth/login`
- `POST /api/v1/customer/auth/register`
- `GET /api/v1/customer/trainings/upcoming`
- `POST /api/v1/customer/trainings/{id}/book`
- `POST /api/v1/customer/trainings/{id}/cancel`
- `GET /api/v1/customer/me/bookings`

## Commands

Build local debug APK:

```bash
env JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home ./gradlew assembleDevDebug
```

Build with LAN override for phone testing:

```bash
env JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk-21.jdk/Contents/Home \
  ./gradlew assembleDevDebug -Pclubflow.baseUrl.dev=http://192.168.1.50:3000/
```

## Common setup issues

### Emulator works but phone does not

A physical phone cannot reach `10.0.2.2`. Use your Mac's LAN IP instead.

### Login fails immediately

Check that the admin web app is running and that the Android app base URL matches the host and port.

### Cleartext HTTP blocked

The app manifest now enables cleartext traffic for local development.
