export const environment = {
  production: true,

    //superAdminAPIURL: "http://192.168.0.7:4202/api",
    //legalEntityAPIURL: 'http://attendme-legalentity.ap-south-1.elasticbeanstalk.com/api',
    //mobileServiceAPIURL: "http://attendme-android.ap-south-1.elasticbeanstalk.com/api"

    //Sparkonix development server

         //superAdminAPIURL: "http://192.168.0.99:4202/api",
         //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
         //mobileServiceAPIURL: "http://192.168.0.99:5000/api"

    // This is Local host

           //superAdminAPIURL: "http://192.168.0.7:4201/api",
           //legalEntityAPIURL: 'http://192.168.0.7:4201/api',
           //mobileServiceAPIURL: "http://192.168.0.7:5000/api"

      //superAdminAPIURL: "http://192.168.0.99:4202/api",
      //legalEntityAPIURL: 'http://192.168.0.99:4201/api',
      //mobileServiceAPIURL: "http://attendme-android.ap-south-1.elasticbeanstalk.com/api"

      // AWS Demo instance

        //superAdminAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4202/api",
        //legalEntityAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:4201/api",
        //mobileServiceAPIURL: "http://ec2-13-235-108-50.ap-south-1.compute.amazonaws.com:5000/api"

      // AWS New Demo Instance (https)

        superAdminAPIURL: "https://attendme-le.attendme.in/api",
        legalEntityAPIURL: "https://attendme-le.attendme.in/api",
        mobileServiceAPIURL: "https://attendme-android.attendme.in/api",

        superAdminAPIURLWoApi: "https://attendme-le.attendme.in",
        legalEntityAPIURLWoApi: "https://attendme-le.attendme.in",
        mobileServiceAPIURLWoApi: "https://attendme-android.attendme.in",

        authCookieName: "auth",
        authCookieExpires: 2,
        authCookiePath: "/",
        authCookieDomain: "attendme.in",
        authCookieSecure: false,
        authCookieSameSite: "Strict",

        sessionAuthCookieName: "session_auth",
        sessionAuthCookieExpires: 2,
        sessionAuthCookiePath: "/",
        sessionAuthCookieDomain: "attendme.in",
        sessionAuthCookieSecure: false,

        userDefMenuCookieName: "userdef_menu",
        userDefMenuCookieExpires: 2,
        userDefMenuCookiePath: "/",
        userDefMenuCookieDomain: "attendme.in",
        userDefMenuCookieSecure: false,
        userDefMenuCookieSameSite: "Strict",

        basicAuthUserName: "attendme",
        basicAuthPassword: 'jo%&d!gv',

        // AWS New Production Instance (https)

        //superAdminAPIURL: "https://attendme-le.attendme.in/api",
        //legalEntityAPIURL: "https://attendme-le.attendme.in/api",
        //mobileServiceAPIURL: "https://attendme-android.attendme.in/api"

        //superAdminAPIURL: "https://attendme-le.attendme.in/api",
        //legalEntityAPIURL: "https://attendme-le.attendme.in/api",
        //mobileServiceAPIURL: "https://attendme-android.attendme.in/api",

        //superAdminAPIURLWoApi: "https://attendme-le.attendme.in",
        //legalEntityAPIURLWoApi: "https://attendme-le.attendme.in",
        //mobileServiceAPIURLWoApi: "https://attendme-android.attendme.in",
};
