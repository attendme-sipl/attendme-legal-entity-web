// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //development server

         //superAdminAPIURL: "http://192.168.0.99:4202/api",
         //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
         //mobileServiceAPIURL: "http://192.168.0.99:5000/api",

         //superAdminAPIURLWoApi: "http://192.168.0.99:4202",
         //legalEntityAPIURLWoApi: 'http://192.168.0.99:4201',
         //mobileServiceAPIURLWoApi: "http://192.168.0.99:5000",

      // Local instance

            superAdminAPIURL: "http://192.168.0.7:4201/api",
            legalEntityAPIURL: 'http://192.168.0.7:4201/api',
            mobileServiceAPIURL: "http://192.168.0.7:5000/api",

            superAdminAPIURLWoApi: "http://192.168.0.7:4201",
            legalEntityAPIURLWoApi: 'http://192.168.0.7:4201',
            mobileServiceAPIURLWoApi: "http://192.168.0.7:5000",

            // cookie parameters

            authCookieName: "auth",
            authCookieExpires: 2,
            authCookiePath: "/",
            authCookieDomain: "localhost",
            authCookieSecure: false,

            userDefMenuCookieName: "userdef_menu",
            userDefMenuCookieExpires: 2,
            userDefMenuCookiePath: "/",
            userDefMenuCookieDomain: "localhost",
            userDefMenuCookieSecure: false,

            sessionAuthCookieName: "session_auth",
            sessionAuthCookieExpires: 2,
            sessionAuthCookiePath: "/",
            sessionAuthCookieDomain: "localhost",
            sessionAuthCookieSecure: false,

            basicAuthUserName: "attendme",
            basicAuthPassword: 'jo%&d!gv',

       //superAdminAPIURL: "http://192.168.0.99:4202/api",
       //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
       //mobileServiceAPIURL: "http://192.168.0.99:5000/api"

       // AWS Demo instance

              //superAdminAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4202/api",
              //legalEntityAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4201/api",
              //mobileServiceAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:5000/api"

       // AWS New Demo Instance (https)

       //superAdminAPIURL: "http://demo-sa.attendme.in/api",
       //legalEntityAPIURL: "http://demo-le.attendme.in/api",
       //mobileServiceAPIURL: "http://demo-android.attendme.in/api",

       //superAdminAPIURLWoApi: "http://demo-sa.attendme.in",
       //legalEntityAPIURLWoApi: "http://demo-le.attendme.in",
       //mobileServiceAPIURLWoApi: "http://demo-android.attendme.in"

        // AWS New Production Instance (https)

        //superAdminAPIURL: "https://attendme-le.attendme.in/api",
        //legalEntityAPIURL: "https://attendme-le.attendme.in/api",
        //mobileServiceAPIURL: "https://attendme-android.attendme.in/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
