define(['knockout'], function(ko) {
    return function UrgentAssistancePopup() {
        var self = this;
        self.pageId = "UrgentAssistancePopup";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        var userProfile;
        var NotificationData;
        self.name = ko.observable();
        self.addEmail = ko.observable();
        self.contact = ko.observable();
        self.rmTeamIssueDesc = ko.observable();
        self.actionBySiteTeam = ko.observable();
        self.additionalInfo = ko.observable();

        var name = '';
        var addEmail = '';
        var contact = '';
        var rmTeamIssueDesc = '';
        var actionBySiteTeam = '';
        var additionalInfo = '';

        /*
         The code below will initialize the current page
         and get data like user profile and data from notification.
         in the application.
         @param userProfileFromNotifications
         @dataFromNotifications
         */

        self.init = function(userProfileFromNotifications, dataFromNotifications) {
            currentPageId = self.pageId;
            userProfile = userProfileFromNotifications;
            NotificationData = dataFromNotifications;
            self.clickYesforDecRemote();
        };

        /*
        The code below will open popup
        for urgent Assistance
        in the application.
        */

        self.createUrgentAssistance = function() {
            // $(".urgentfinalComment  textarea").val('');
            // $(".urgentname  input").val('');
            // $(".urgentemail  input").val('');
            // $(".urgentphone  input").val('');
            //hideUrgentAssistancePopup();
            name = (self.name());
            addEmail = (self.addEmail());
            contact = (self.contact());
            rmTeamIssueDesc = (self.rmTeamIssueDesc());
            actionBySiteTeam = (self.actionBySiteTeam());
            additionalInfo = (self.additionalInfo());
            console.log(name);
            console.log(addEmail);
            console.log(contact);
            console.log(rmTeamIssueDesc);
            console.log(actionBySiteTeam);
            console.log(additionalInfo);

            if (self.validatetextareaforurgent(name)) {
                if (self.checkEmail(addEmail)) {
                    // if (self.phonenumber(contact)) {

                    if (self.validatetextareaforurgent(rmTeamIssueDesc) || self.validateYesText(rmTeamStatus)) {
                        if (self.validatetextareaforurgent(actionBySiteTeam)) {
                            if (self.validatetextareaforurgent(additionalInfo)) {
                                console.log("valid field of feedback");
                                self.postWebService2();
                            } else
                                alert("Field can not be empty");
                        } else
                            alert("Field can not be empty");
                    } else
                        alert("Field can not be empty");
                    // } else
                    // alert("Phone Number is not valid");
                } else
                    alert("Email is not valid");
            } else
                alert("Name can not be empty");
        };


        /*
        The code below will call
        the post web service to develop mail functionality for urgent Assistance
        in the application.
        */
        self.postWebService2 = function() {
            urgent = ({
                sender: userProfile.email,
                title: NotificationData.title,
                engineSerial: NotificationData.engineSerial,
                organization: NotificationData.organization,
                name: name,
                addEmail: addEmail,
                contact: contact,
                issueStatus: null,
                rmTeamStatus: rmTeamStatus,
                rmTeamIssueDesc: rmTeamIssueDesc,
                actionBySiteTeam: actionBySiteTeam,
                additionalInfo: additionalInfo
            });
            var jsonurgent = JSON.stringify(urgent);
            console.log(urgent);
            console.log(jsonurgent);
            showLoader();
            callService(webServiceURL_urgent_mail, jsonurgent, 'POST', postWebServiceSuccessUrgent, postWebServiceErrorUrgent);

        };
        postWebServiceSuccessUrgent = function(result) {
//            hideLoader();
            alert(result);
            hideUrgentAssistancePopup();
            console.log("null values");
            $(".urgentfinalComment  textarea").val('');
            $(".urgentname  input").val('');
            $(".urgentemail  input").val('');
            $(".urgentphone  input").val('');
            hideUrgentAssistancePopup();
            hideLoader();
       };

        postWebServiceErrorUrgent = function(result) {
                hideLoader();
                alert(result);
       };
            /*
             The code below will show the toggle functionality
             between the radio buttons.
            */

        self.clickYesforDecRemote = function() {
            console.log("clicked yes");
            $("#issueRadioYesforDecRemote").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioNoforDecRemote").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');
            $("#textenabledisable").attr('disabled', 'disabled');
            $("#textenabledisable").val('');
            
            rmTeamStatus = "Yes";
        };
        self.clickNoforDecRemote = function() {
            console.log("clicked no");
            $("#issueRadioNoforDecRemote").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioYesforDecRemote").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');
            $("#textenabledisable").removeAttr('disabled');
            $("#textenabledisable").val('');
       
            rmTeamStatus = "No";

        };

        /*
          The code below will validate
          the textarea field in popup.
          @param textcommentforurgent
          @return true|false;
         */

        self.validatetextareaforurgent = function(textcommentforurgent) {

            if (textcommentforurgent == undefined || textcommentforurgent == '') {

                return false;
            } else {

                return true;
            }
        };


        /*
        The code below will cancel
        popup for urgent Assistance
        in the application
        */
        self.cancelUrgentAssistance = function() {
            hideUrgentAssistancePopup();
            $(".urgentname  input").val('');
            $(".urgentemail  input").val('');
            $(".urgentphone  input").val('');
            $(".urgentfinalComment  textarea").val('');
            console.log("urgent");
        };


        // self.phonenumber = function(phone) {
        //  
        // //var filter1 = /^\+?([0-9]{2})\)?[-. ]?([0-9]{4})[-. ]?([0-9]{4})$/;
        // var phone = document.getElementById('txtPhone');
        // var filter1 = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        // if (!filter1.test(phone)) {
        // return false;
        // phone.focus;
        // } else {
        // return true;
        // }
        // };

        /*
         The code below will validate
         the email field in popup.
         @param email
         @return true|false;
        */
        self.validateYesText = function(Yesforurgent) {

            if (Yesforurgent == "Yes") {

                return true;
            }
            if (Yesforurgent == "no") {

                return false;
            }
        };
        self.checkEmail = function(email) {

            var email = document.getElementById('txtEmail');
            var filter = /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;

            if (!filter.test(email.value)) {

                email.focus;
                return false;
            } else
                return true;
        };
    };
});