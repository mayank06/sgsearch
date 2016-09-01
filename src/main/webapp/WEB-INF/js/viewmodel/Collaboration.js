/***************************************************************************************************
 *   File Name  : Collaboration.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: July, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function Collaboration() {
        var self = this;
        self.pageId = "Collaboration";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        self.userName = ko.observable();
        self.selectedChoiceforPhone = ko.observable();
        self.phoneNumber = ko.observable();
        self.phoneList = ko.observableArray();
       //self.phoneNumber = ko.observable();
        self.init = function() {
            currentPageId = self.pageId;
            console.log("inside log in init");
            $("#search-tag").hide();
            $("#dropdown-icon-id").hide();
            $("#pointer-for-org").hide();
            var phoneListTemp = ["+14047237668", "+14047913391", "+13175596717", "+17135159785"];
            var phoneList = [];
            for (i = 0; i < phoneListTemp.length; i++) {
                var phoneObject = ({
                    'phoneNumberList': phoneListTemp[i]
                });
                phoneList.push(phoneObject);
            }
            self.phoneList(phoneList);
        };
        self.submitInput = function() {
            console.log(self.userName());
            if (self.userName() && self.userName().length > 0) {
                window.location.href = "facetime:" + self.userName();
            } else {
                alert('Please enter a valid phone number');
            }

        };
        self.onClickPhonenumber = function(data, event) {
            console.log("in oncliockgesn");
            console.log(event);
            $('#phone-no-collab').show();
            $('.phone-number-list').show();
            event.stopPropagation();
        };
       self.changePhoneNumber = function() {
            var phone = $("#phonenumber-tag").val();
            self.userName(phone);
            console.log(self.userName());
       };
        self.searchPhone = function(data, event) {
            document.getElementById("phone-no-collab").style.display = "block";
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString1 = $("#phonenumber-tag").val().trim();
                var userString = userString1.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".phone-number-list:contains(" + userString + ")").show();
                } else {
                    $(".phone-number-list:contains(" + userString + ")").show();
                    $(".phone-number-list:not(:contains(" + userString + "))").hide();
                }
            }

        };
       
        self.clickedNumber = function(data, event) {
            console.log("Inside clickedElement");
            console.log(data);
            self.userName(data.phoneNumberList);
            console.log(self.userName());
            $("#phonenumber-tag").val(data.phoneNumberList);
            //document.getElementById("phone-number-list").style.display = "none";
        };
       
        self.callTabEvent = function() {
            self.defaultIconcol();
            $("#call-tab-section").show();
            $("#calls-tab").css('backgroundImage', 'url("../img/Collaboration/active-video.png")');
            $("#calls-tab").css('background-color', '#4e79d1');
            $("#message-tab-section").hide();
            $("#chat-tab-section").hide();

        };
        self.chatTabEvent = function() {
            self.defaultIconcol();
            $("#chat-tab-section").show();
            $("#chat-tab-section").css('backgroundImage', 'url("../img/Collaboration/Chat@X.png")');
            $("#chats-tab").css('backgroundImage', 'url("../img/Collaboration/active-chat.png")');
            $("#chats-tab").css('background-color', '#4e79d1');
            $("#message-tab-section").hide();
            $("#call-tab-section").hide();
        };

        self.messageTabEvent = function() {
            self.defaultIconcol();
            $("#message-tab-section").show();
            $("#message-tab-section").css('backgroundImage', 'url("../img/Collaboration/mail@x.jpg")');
            $("#message-tab").css('backgroundImage', 'url("../img/Collaboration/active-chat.png")');
            $("#message-tab").css('background-color', '#4e79d1');
            $("#call-tab-section").hide();
            $("#chat-tab-section").hide();
        };

        self.defaultIconcol = function(iconId) {
            $("#calls-tab").css('backgroundImage', 'url("../img/Collaboration/video.png")');
            $("#calls-tab").css('background-color', '#EFEFEF');
            $("#chats-tab").css('backgroundImage', 'url("../img/Collaboration/chat.png")');
            $("#chats-tab").css('background-color', '#EFEFEF');
            $("#message-tab").css('backgroundImage', 'url("../img/Collaboration/X-message-blue-icon.png")');
            $("#message-tab").css('background-color', '#EFEFEF');
        };

        // self.goBack = function() {
        // hideFacetime();
        // };
    };
});