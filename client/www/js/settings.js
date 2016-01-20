var BookIt = BookIt || {};
BookIt.Settings = BookIt.Settings || {};
BookIt.Settings.signUpUrl = "http://localhost:30000/api/account/register";  //"http://nodejs-1189.appspot.com/api/account/register"; //;
BookIt.Settings.signInUrl = "http://localhost:30000/api/account/logon"; //"http://192.168.1.104:30000/api/account/logon"; //
BookIt.Settings.jobsUrl = "http://localhost:30000/api/jobs"; //"http://192.168.1.104:30000/api/bookings"; //
BookIt.Settings.sessionIdKey = "readyapp-session";
BookIt.Settings.sessionTimeoutInMSec = 86400000 * 30;   // 30 days.
