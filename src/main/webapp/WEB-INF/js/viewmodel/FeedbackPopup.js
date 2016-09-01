/***************************************************************************************************
 *   File Name  : FeedbackPopup.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: August, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function FeedbackPopup() {
        var self = this;
        self.pageId = "FeedbackPopup";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        var userProfile;
        var NotificationData;
        self.actionBySiteTeam = ko.observable();
        self.additionalInfo = ko.observable();
        self.issueStatus = ko.observable();
        var actionBySiteTeam = '';
        var additionalInfo = '';
        var issueStatus = '';

        /*
         The code below will initialize the current page id
         and get data like user profile and data from notification.
         in the application.
         @param userProfileFromNotifications
         @dataFromNotifications
         */

        self.init = function(userProfileFromNotifications, dataFromNotifications) {
            currentPageId = self.pageId;
            userProfile = userProfileFromNotifications;
            NotificationData = dataFromNotifications;
            console.log("User: "+userProfile.firstName + userProfile.lastName+" and SSO: "+ userProfile.ssoID);
            //console.log(NotificationData);
            self.clickYesIssue();
            self.clickYesforRemote();
        };

        /*
         The code below will open
         feedback popup in the application.
         */

        self.createFeedback = function() {

            //hideFeedbackPopup();
            actionBySiteTeam = (self.actionBySiteTeam());
            additionalInfo = (self.additionalInfo());
            console.log(actionBySiteTeam);
            console.log(additionalInfo);

            if (self.validatetextarea(actionBySiteTeam)) {
                if (self.validatetextarea(additionalInfo)) {
                    console.log("valid field of feedback");
                    self.postWebService1();

                } else

                    alert("Field can not be empty");
            } else

                alert("Field can not be empty");

        };

        /*
         The code below will call
         the post web service to develop mail
         functionality for feedback
         in the application.
         */

        self.postWebService1 = function() {
            feedback = ({
                sender: userProfile.email,
                title: NotificationData.title,
                engineSerial: NotificationData.engineSerial,
                organization: NotificationData.organization,
                name: "null",
                addEmail: "null",
                contact: "null",
                issueStatus: issueStatus,
                rmTeamStatus: rmTeamStatus,
                rmTeamIssueDesc: "null",
                actionBySiteTeam: actionBySiteTeam,
                additionalInfo: additionalInfo,
            });
            var jsonfeedback = JSON.stringify(feedback);
            console.log(feedback);
            console.log(jsonfeedback);
            showLoader();
            callService(webServiceURL_feedBack_mail, jsonfeedback, 'POST', postWebServiceSuccessFeedback, postWebServiceErrorFeedback);

        };
        postWebServiceSuccessFeedback = function(result) {
            alert(result);
            hideFeedbackPopup();
            $(".feedbackfinalComment  textarea").val('');
            hideLoader();
       };

        postWebServiceErrorFeedback = function(result) {
                alert(result);
                hideLoader();
       };
            /*
             The code below will show the toggle functionality
             between the radio buttons.
             */
        self.clickYesIssue = function() {
            console.log("clicked yes");
            $("#issueRadioYes").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioNo").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');
            issueStatus = "Yes";
            //console.log(issueStatus);
        };
        self.clickNoIssue = function() {
            console.log("clicked no");
            $("#issueRadioNo").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioYes").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');
            issueStatus = "No";
        };

        /*
         The code below will show the toggle functionality
         between the radio buttons.
         */
        self.clickYesforRemote = function() {
            console.log("clicked yes");
            $("#issueRadioYesforRemote").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioNoforRemote").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');

            rmTeamStatus = "Yes";
        };
        self.clickNoforRemote = function() {
            console.log("clicked no");
            $("#issueRadioNoforRemote").css('background-image', 'url("../img/Notification/2X-redio-button-selected.png")');
            $("#issueRadioYesforRemote").css('background-image', 'url("../img/Notification/2X-redio-button-unselected.png")');

            rmTeamStatus = "No";

        };

        /*
         The code below will validate
         the textarea field in popup.
         @param commenttextarea
         @return true|false
         */
        self.validatetextarea = function(commenttextarea) {

            if (commenttextarea == undefined || commenttextarea == '') {

                return false;
            } else {

                return true;
            }
        };

        /*
         The code below will cancel
         feedback popup in the application.
         */

        self.cancelFeedback = function() {
            $(".SubBoxHeadFNotes textarea").val('');
            $(".feedbackfinalComment textarea").val('');
            hideFeedbackPopup();
        };

    };
});