var BookIt = BookIt || {};

// Begin boilerplate code generated with Cordova project.

var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        app.receivedEvent('deviceready');
    },
    // Update DOM on a Received Event
    receivedEvent: function (id) {

    }
};

app.initialize();

// End boilerplate code.

$(document).on("mobileinit", function (event, ui) {
    $.mobile.defaultPageTransition = "slide";
});

app.signUpController = new BookIt.SignUpController();
app.signInController = new BookIt.SignInController();
app.jobsController = new BookIt.JobsController();

$(document).on("pagecontainerbeforeshow", function (event, ui) {
    if (typeof ui.toPage == "object") {
        switch (ui.toPage.attr("id")) {
            case "page-signup":
                // Reset the signup form.
                app.signUpController.resetSignUpForm();
                break;
            case "page-signin":
                // Reset signin form.
                app.signInController.resetSignInForm();
                break;
            case "page-jobs":
                //check signed in?
                // Show  the list of bookings.
                app.jobsController.showJobs();
                break;
            case "page-job-editor":
                //app.bookingsController.showBookings();
                break;
        }
    }
});

$(document).on("pagecontainerbeforechange", function (event, ui) {

    if (typeof ui.toPage !== "object") return;
    
    switch (ui.toPage.attr("id")) {
        case "page-index":
            if (!ui.prevPage) {
                // Check session.keepSignedIn and redirect to main menu.
                var session = BookIt.Session.getInstance().get(),
                    today = new Date();
                if (session && session.keepSignedIn && new Date(session.expirationDate).getTime() > today.getTime()) {
                    ui.toPage = $("#page-jobs");
                }
            }
    }
});

$(document).delegate("#page-signup", "pagebeforecreate", function () {

    app.signUpController.init();

    app.signUpController.$btnSubmit.off("tap").on("tap", function () {
        app.signUpController.onSignUpCommand();
    });
});

$(document).delegate("#page-signin", "pagebeforecreate", function () {

    app.signInController.init();

    app.signInController.$btnSubmit.off("tap").on("tap", function () {
        app.signInController.onSignInCommand();
    });
});

$(document).delegate("#page-jobs", "pagebeforecreate", function () {

    app.jobsController.init();

    //app.signInController.$btnRefresh.off("tap").on("tap", function () {
    //    app.bookingsController.onRefreshCommand();
    //});
    
});

$(document).delegate("#page-job-editor", "pagebeforecreate", function () {

    app.jobsController.init();
    
    //app.jobsController.resetEditorForm();

    
    app.jobsController.$btnSubmit.off("tap").on("tap", function () {
        app.jobsController.onSubmitCommand();
    });
    //app.signInController.$btnRefresh.off("tap").on("tap", function () {
    //    app.bookingsController.onRefreshCommand();
    //});
    
});

