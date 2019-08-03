// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

export const environment = {
  production: false,

  //development server

         //superAdminAPIURL: "http://192.168.0.99:4202/api",
         //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
         //mobileServiceAPIURL: "http://192.168.0.99:5000/api"

      // Local instance

            superAdminAPIURL: "http://192.168.0.7:4202/api",
            legalEntityAPIURL: 'http://192.168.0.7:4201/api',
            mobileServiceAPIURL: "http://192.168.0.7:5000/api"

       //superAdminAPIURL: "http://192.168.0.99:4202/api",
       //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
       //mobileServiceAPIURL: "http://192.168.0.99:5000/api"

       // AWS Demo instance

              //superAdminAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4202/api",
              //legalEntityAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4201/api",
              //mobileServiceAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:5000/api"

       // AWS New Demo Instance (https)

       //superAdminAPIURL: "https://demo-sa.attendme.in/api",
       //legalEntityAPIURL: "https://demo-le.attendme.in/api",
       //mobileServiceAPIURL: "https://demo-android.attendme.in/api"

        // AWS New Production Instance (https)

        //superAdminAPIURL: "http://attendme-sa.attendme.in/api",
        //legalEntityAPIURL: "http://attendme-le.attendme.in/api",
        //mobileServiceAPIURL: "http://attendme-android.attendme.in/api"
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.
