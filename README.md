# TimeSync Monorepo

This is the monorepo for the TimeSync application, containing the backend, admin dashboard, and employee mobile app. It is managed using [Turborepo](https://turbo.build/repo) and npm workspaces.

## Prerequisites

- Java 17 installed and added to your environment variables (JAVA_HOME).
- Android SDK installed and added to your environment variables (ANDROID_HOME).
- Docker & Docker Compose installed.
- Node.js / npm installed.
- Make sure Java 17 is the one used by Gradle.

## Setup Steps

1. In the backend .env, make sure the following are set (Ask Me):
```
SUPABASE_JWT_SECRET=
SUPABASE_DATABASE_URL=
EXPO_PUBLIC_SUPABASE_URL=
ADMIN_EMAIL=
```

2. In the frontend .env, make sure the following are set (Ask Me):
```
EXPO_PUBLIC_API_URL=
EXPO_PUBLIC_SUPABASE_URL=
EXPO_PUBLIC_SUPABASE_ANON_KEY=
```

3. Go to the frontend folder `cd apps/frontend`

4. Run `npx expo prebuild`

5. In the android folder recently created (`apps/frontend/android`) create a `local.properties` file with your Android SDK path. This Path can be found in C:\Users\<YourUsername>\AppData\Local\Android\Sdk -> `sdk.dir=/path/to/android/sdk`

6. In the `gradle.properties` file add your java path -> `org.gradle.java.home=/path/to/java17`.

7. In one terminal run the following series of commands `docker system prune -f` -> `docker compose down -v` -> `docker compose up --build`.

8. In another terminal run `npx expo run:android`, an emulator or phone is needed. If you are using your phone, make sure to enable USB debugging and connect it to your computer. If you are using an emulator, make sure to have one created and selected.

> [!IMPORTANT]
> Make sure JAVA_HOME points to Java 17.
>Make sure ANDROID_HOME points to your Android SDK.


