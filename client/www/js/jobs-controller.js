var BookIt = BookIt || {};

BookIt.JobsController = function () {
    this.localStorageKey = "readyapp.jobs";
    this.$jobsPage = null;
    this.$btnRefresh = null;
    this.$btnNew = null;
    this.$ctnErr = null;
    this.$jobsListCtn = null;
    
    this.jobs = [];
    
    this.$jobEditorPage = null;
    this.$btnSubmit = null;
    this.$jobEditorCtnErr = null;
    
    this.$txtClientName = null;
    this.$txtService = null;
    this.$txtDateDue = null;
    this.$txtHours = null;
    this.$txtPhone = null;
    this.$txtEmail = null;
    
};

BookIt.JobsController.prototype.init = function () {
    this.$jobsPage = $("#page-jobs");
    this.$btnRefresh = $("#btn-refresh", this.$jobsPage);
    this.$btnNew = $("#btn-new", this.$jobsPage);
    this.$ctnErr = $("#ctn-err", this.$jobsPage);
    this.$jobsListCtn = $("#jobs-list-ctn", this.$jobsPage)
    
    this.$jobEditorPage = $("#page-job-editor");
    this.$btnSubmit = $("#btn-submit", this.$jobEditorPage);
    this.$jobEditorCtnErr = $("#ctn-err", this.$jobEditorPage);
    
    this.$txtClientName = $("#txt-client-name", this.$jobEditorPage);
    this.$txtService = $("#txt-service", this.$jobEditorPage);
    
    this.$txtDateDue = $("#txt-date-due", this.$jobEditorPage);
    this.$txtHours = $("#txt-hours", this.$jobEditorPage);
    this.$txtPhone = $("#txt-phone", this.$jobEditorPage);
    this.$txtEmail = $("#txt-email", this.$jobEditorPage);

    window.localStorage.setItem(this.localStorageKey,'');
    
};

BookIt.JobsController.prototype.getJobsFromLocalStorage = function () {

    var result = [];

    try {
        result = JSON.parse(window.localStorage.getItem(this.localStorageKey)) || [];
    } catch (e) {
        result = [];
    }

    return result;
};

BookIt.JobsController.prototype.renderJobs = function () {
    var dateGroup,
        jobDate,
        jobsCount,
        job,
        ul,
        li,
        liArray = [],
        lisString,
        view;

   this.$jobsListCtn.empty();

   if (this.jobs.length === 0) {
       $("<p>No jobs found</p>").appendTo(this.$jobsListCtn);
       return;
   }


   ul = $("<ul id=\"jobs-list\" data-role=\"listview\"></ul>").appendTo(this.$jobsListCtn);

    for (i = 0; i < this.jobs.length; i += 1) {

        job = this.jobs[i];

        jobDate = (new Date(job.dateTimeDue).toDateString())

        if (dateGroup != jobDate) {
            dateGroup = jobDate;
            liArray.push("<li data-theme=\"b\" data-role=\"list-divider\">" + dateGroup + "</li>");            
        }

        li = "<li><a><div class=\"bi-list-item-secondary\"><p>" + (new Date(job.dateTimeDue)).toLocaleTimeString(navigator.language, { hour: '2-digit', minute: '2-digit' }) + "</p></div>" +  "<div class=\"bi-list-item-primary\">" + job.clientName + "</div></a></li>";

        liArray.push(li);
    }

    liString = liArray.join("");
    $(liString).appendTo(ul);

    ul.listview();

};

BookIt.JobsController.prototype.showJobsFromServer = function () {
    var me = this;
    this.getJobsFromServer(
        function (resp) {
            window.localStorage.setItem(app.jobsController.localStorageKey, JSON.stringify(resp.extras.jobs));
            me.jobs = resp.extras.jobs;
            me.renderJobs();
        },
        function (error) {
            $.mobile.loading("hide");
            console.log(error);
            // TODO: Use a friendlier error message below.
            me.$ctnErr.html("<p>Please try again in a few minutes.</p>");
            me.$ctnErr.addClass("bi-ctn-err").slideDown();
        }
    );
    
};

BookIt.JobsController.prototype.showJobs = function () {

    this.jobs = this.getJobsFromLocalStorage();

    // Retrieve from server if local storage empty and online (Add offline check).
    if (!this.jobs || this.jobs.length == 0) {

        this.showJobsFromServer();  
    } else {

        this.renderJobs();
    }  
};

BookIt.JobsController.prototype.getJobsFromServer = function (successCallback, errorCallback) {
    var session = BookIt.Session.getInstance().get();

    if (!session) {
        return errorCallback({ err: BookIt.ApiMessages.SESSION_NOT_FOUND });
    }
    $.ajax({
        type: 'GET',
        url: BookIt.Settings.jobsUrl,
        data: '',
        headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Auth-Token' : session.sessionId},
        success: successCallback,
        error: errorCallback
    });
};


BookIt.JobsController.prototype.onRefreshCommand = function () {
    
    this.getJobsFromServer(
        function (resp) {
            // TODO
        },
        function (error) {
            // TODO
        }
    );
};


/* -- job editor --*/

BookIt.JobsController.prototype.resetJobEditorForm = function () {

    var invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    this.$jobEditorCtnErr.html("");
    this.$jobEditorCtnErr.removeClass().addClass(invisibleStyle);
    
    this.$txtClientName.removeClass(invalidInputStyle).val("");
    this.$txtService.removeClass(invalidInputStyle).val("");
    this.$txtDateDue.removeClass(invalidInputStyle).val("");
    this.$txtHours.removeClass(invalidInputStyle).val("");
    this.$txtPhone.removeClass(invalidInputStyle).val("");
    this.$txtEmail.removeClass(invalidInputStyle).val("");
};


BookIt.JobsController.prototype.onSubmitCommand = function () {

    var session = BookIt.Session.getInstance().get();

    if (!session) {
        return errorCallback({ err: BookIt.ApiMessages.SESSION_NOT_FOUND });
    }
    
    
    var me = this,
        clientName = me.$txtClientName.val().trim(),
        service = me.$txtService.val().trim(),
        dateDue = me.$txtDateDue.val().trim(),
        hours = me.$txtHours.val().trim(),
        email = me.$txtEmail.val().trim(),
        phone = me.$txtPhone.val().trim(),
        
        invalidInput = false,
        invisibleStyle = "bi-invisible",
        invalidInputStyle = "bi-invalid-input";

    // Reset styles.
    me.$jobEditorCtnErr.removeClass().addClass(invisibleStyle);
    me.$txtClientName.removeClass(invalidInputStyle);
    me.$txtService.removeClass(invalidInputStyle);
    me.$txtDateDue.removeClass(invalidInputStyle);
    me.$txtHours.removeClass(invalidInputStyle);
    me.$txtEmail.removeClass(invalidInputStyle);
    me.$txtPhone.removeClass(invalidInputStyle);
    
    // Flag each invalid field.
    if (clientName.length === 0) {
        me.$txtClientName.addClass(invalidInputStyle);
        invalidInput = true;
    }
    
    // Make sure that all the required fields have values.
    if (invalidInput) {
        me.$jobEditorCtnErr.html("<p>Please enter all the required fields.</p>");
        me.$jobEditorCtnErr.addClass("bi-ctn-err").slideDown();
        return;
    }
    $.ajax({
        type: 'POST',
        url: BookIt.Settings.jobsUrl+'/add',
        headers: {'Content-Type' : 'application/x-www-form-urlencoded; charset=UTF-8', 'X-Auth-Token' : session.sessionId},
        data: "clientName=" + clientName + "&service=" + service + "&dateTimeDue=" + dateDue + "&hours=" + hours + "&phone=" + phone + "&email=" + email,
        
        success: function (resp) {

            if (resp.success === true) {
                //add to jobs
                //render
                $.mobile.navigate("#page-jobs");
                return;
            } else {
                
                if (resp.extras.msg) {
                    switch (resp.extras.msg) {
                        case BookIt.ApiMessages.DB_ERROR:
                        default:
                            // TODO: Use a friendlier error message below.
                            me.$jobEditorCtnErr.html("<p>Oops! Ready App had a problem and could not add job.  Please try again in a few minutes.</p>");
                            me.$jobEditorCtnErr.addClass("bi-ctn-err").slideDown();
                            break;
                        
                    }
                }
            }
        },
        error: function (e) {
            console.log(e);
            // TODO: Use a friendlier error message below.
            me.$jobEditorCtnErr.html("<p>Oops! Ready App had a problem and could not add job.  Please try again in a few minutes.</p>");
            me.$jobEditorCtnErr.addClass("bi-ctn-err").slideDown();
        }
    });
};
/*BookIt.JobsController.prototype.onJobEditorSubmitCommand = function () {
    
    this.getJobsFromServer(
        function (resp) {
            // TODO
        },
        function (error) {
            // TODO
        }
    );
};
*/