/***************************************************************************************************
 *   File Name  : DatalogPopup.js
 *   Author   : xxxxx xxxxx
 *   Date of Creation: Aug, 2015
 *   Last Modified : September, 2015
 *   Copy rights Information : �2015 All rights reserved by TCS.
 *   Description : This file is used to send the soap request and get the respnse data.
 ****************************************************************************************************/

define(['knockout'], function(ko) {
    return function DatalogPopup() {
        var self = this;
        self.pageId = "DatalogPopup";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        self.upTimeHours = ko.observable();
        self.upTimeMinutes = ko.observable();
        self.upTimeNotes = ko.observable('');
        self.idleTimeHours = ko.observable();
        self.idleTimeMinutes = ko.observable();
        self.idleTimeNotes = ko.observable('');
        self.plannedOutageHrs = ko.observable();
        self.plannedOutageMinutes = ko.observable();
        self.plannedOutageNotes = ko.observable('');
        self.unplannedOutageHrs = ko.observable();
        self.unplannedOutageMinutes = ko.observable();
        self.unplannedOutageNotes = ko.observable('');
        self.dataLogNotes = ko.observable('');
        self.gesnNo = ko.observable();
        self.firstName = ko.observable();
        self.lastName = ko.observable();
        self.pickedDateFromPopup = ko.observable();
        self.datalogDate = ko.observable();
        self.popUpDate = ko.observable();
        var popUpDate;
        var todayDate = '';
        var todayDateThreeLetterMonthFormat = '';
        var todayDateToPost = '';
        var currentTime = '';
        var currentGesn = '';
        var upTimeHours;
        var upTimeMinutes;
        var upTimeNotes = '';
        var idleTimeHours;
        var idleTimeMinutes;
        var idleTimeNotes = '';
        var plannedOutageHrs;
        var plannedOutageMinutes;
        var plannedOutageNotes = '';
        var unplannedOutageHrs;
        var unplannedOutageMinutes;
        var unplannedOutageNotes = '';
        var dataLogNotes = '';
        //        var datalog = new Object();
        var pickedGesnNo;
        var pickedDate = '';
        var userProfile;
        var isEdit;

        /*
         The code below will initialize the current page
         and get data like gesn and userProfile from Previous page.
         in the application.
         @param gesn
         @param userProfileFromPrevPage
         */

        self.init = function(userProfileFromPrevPage, prevPage, gesn, popUpDatePrev) {
            currentPageId = self.pageId;
            // var toDatin3letter = self.currDate();
            // todayDateToPost = new Date(toDatin3letter) / 1000;
            isEdit = "No";
            $("#createDatalogPopup").html("Create log");
            userProfile = userProfileFromPrevPage;
            self.firstName(userProfile.firstName);
            self.lastName(userProfile.lastName);

            pickedDate = currDate();
            //            $(".headerpopupText input").val('');
            if (prevPage == "Asset") {
                popUpDate = popUpDatePrev;
                self.popUpDate(popUpDate);
                currentGesn = gesn;
                self.gesnNo(currentGesn);
                showLoader();
                callService(webServiceURL_getDatalogToCheck + '?serialNumber=' + currentGesn + '&logDate=' + popUpDate, '', 'GET', getDataForSpecificDayGesnSuccessPopUp, getDataForSpecificDayGesnErrorPopUp);
            } else if (prevPage == "Datalog") {
                var datalogData = gesn;
                popUpDate = datalogData.logDate;
                currentGesn = datalogData.gesn;
                self.gesnNo(currentGesn);
                self.popUpDate(popUpDate);
                console.log(datalogData);
                isEdit = "Yes";
                $("#createDatalogPopup").html("Edit log");
                fillDatalogFieldsPopup(datalogData);
            }
            //       $('.hasDatepicker').attr('readonly', 'true');
            //            datePickersInitiation();
        };

        getDataForSpecificDayGesnSuccessPopUp = function(data) {
            data = $.parseJSON(data);
            var datalogDataTemp = ({
                dataLogNotes: data.data_log_notes,
                gesn: data.gesn_unit_detail,
                idleTimeHours: data.idletime_hours,
                idleTimeMinutes: data.idletime_minutes,
                idleTimeNotes: data.idletime_notes,
                logDate: data.log_date,
                plannedOutageNotes: data.planned_outage_notes,
                plannedOutageTimeHours: data.planned_outage_hours,
                plannedOutageTimeMinutes: data.planned_outage_minutes,
                unPlannedOutageNotes: data.unplanned_outage_notes,
                unPlannedOutageTimeHours: data.unplanned_outage_hours,
                unPlannedOutageTimeMinutes: data.unplanned_outage_minutes,
                upTimeHours: data.uptime_hours,
                upTimeMinutes: data.uptime_minutes,
                upTimeNotes: data.uptime_notes
            });
            fillDatalogFieldsPopup(datalogDataTemp);
            isEdit = "Yes";
            showDataLogPopUp();
            $("#createDatalogPopup").html("Edit log");
            hideLoader();
        };

        getDataForSpecificDayGesnErrorPopUp = function(result, status) {
            hideLoader();
            isEdit = "No";
            $("#createDatalogPopup").html("Create log");
            if (status == 404) {
                showDataLogPopUp();
//                alert("No data found, please create new Datalog", "Message");
            } else {
                errorHandling(status);
            }
        };

        $("#DatalogPopup").bind("click touchstart", function(event) {
            $('.ui-datepicker-div').hide();
        });



        /*
         The code below will open
         DataLog popup in the application.
         */

        self.createDataLog = function() {
            //            $(".datalog-input-container input").css('background-color', '#EDEDED');
            //            $(".datalog-input-container textarea").css('background-color', '#EDEDED');
            upTimeHours = self.upTimeHours();
            upTimeMinutes = self.upTimeMinutes();
            upTimeNotes = self.upTimeNotes();
            idleTimeHours = self.idleTimeHours();
            idleTimeMinutes = self.idleTimeMinutes();
            idleTimeNotes = self.idleTimeNotes();
            plannedOutageHrs = self.plannedOutageHrs();
            plannedOutageMinutes = self.plannedOutageMinutes();
            plannedOutageNotes = self.plannedOutageNotes();
            unplannedOutageHrs = self.unplannedOutageHrs();
            unplannedOutageMinutes = self.unplannedOutageMinutes();
            unplannedOutageNotes = self.unplannedOutageNotes();
            dataLogNotes = self.dataLogNotes();
            pickedGesnNo = currentGesn;
            pickedDate = popUpDate; //need to edit


            console.log(pickedDate);
            if (checkTimePopUp(upTimeHours, upTimeMinutes)) {
                if (checkTimePopUp(idleTimeHours, idleTimeMinutes)) {
                    if (checkTimePopUp(plannedOutageHrs, plannedOutageMinutes)) {
                        if (checkTimePopUp(unplannedOutageHrs, unplannedOutageMinutes)) {
                            if (totalTimeValidationPopUp()) {
                                console.log("valid");
                                self.postWebService();
                            } else
                                console.log("total should be 24hours");
                        } else
                            alert("Please enter valid data");
                    } else
                        alert("Please enter valid data");
                } else
                    alert("Please enter valid data");
            } else
                alert("Please enter valid data");




            if (checkTimePopUp(upTimeHours, upTimeMinutes) == false) {
                $("#pop-uptimeHr").css('background-color', '#F1C5C5');
                $("#pop-uptimeMn").css('background-color', '#F1C5C5');
            }
            if (checkTimePopUp(idleTimeHours, idleTimeMinutes) == false) {
                $("#pop-idletimeHr").css('background-color', '#F1C5C5');
                $("#pop-idletimeMn").css('background-color', '#F1C5C5');
            }
            if (checkTimePopUp(plannedOutageHrs, plannedOutageMinutes) == false) {
                $("#pop-plannedHr").css('background-color', '#F1C5C5');
                $("#pop-plannedMn").css('background-color', '#F1C5C5');
            }
            if (checkTimePopUp(unplannedOutageHrs, unplannedOutageMinutes) == false) {
                $("#pop-unplannedHr").css('background-color', '#F1C5C5');
                $("#pop-unplannedMn").css('background-color', '#F1C5C5');
            }
            // $(".time-input-div input").val('');
            // $(".SubBoxHeadFNotes textarea").val('');
            // $(".finalComment textarea").val('');
        };

        self.cancelDataLog = function() {
            hideDataLogPopUp();
            console.log("clicked cancel datalog");
            resetDatalogFieldsPopUp("except date, gesn");
        };

        /*
         The code below will call
         the web service to add DataLog
         in the application.
         */

        self.postWebService = function() {
            showLoader();
            var datalog = editDataLogParseFunctionPopup();
            var jsonDatalog = JSON.stringify(datalog);
            console.log(datalog);
            console.log(jsonDatalog);
            if (isEdit == "Yes") {
                callService(webServiceURL_editDatalog, jsonDatalog, 'POST', postWebServiceSuccessPopUp, postWebServiceErrorPopUp);
            } else if (isEdit == "No") {
                console.log(jsonDatalog);
                callService(webServiceURL_createDatalog, jsonDatalog, 'POST', postWebServiceSuccessPopUp, postWebServiceErrorPopUp);
            }
            //callService(webServiceURL_createDatalog, jsonDatalog, 'POST', postWebServiceSuccessPopUp, postWebServiceErrorPopUp);
        };

        postWebServiceSuccessPopUp = function(result) {
            alert(result);
            //            $(".time-input-div input").val('');
            //            $(".SubBoxHeadFNotes textarea").val('');
            //            $(".finalComment textarea").val('');
            //            $(".headerpopupText input").val('');
            //            $(".time-input-div input").css('background-color', '#EDEDED');
            hideLoader();
            hideDataLogPopUp();
            resetDatalogFieldsPopUp();
        };

        postWebServiceErrorPopUp = function(result) {
            console.log(result);
            //            alert("Please try after some time");
            //            $(".time-input-div input").val('');
            //            $(".SubBoxHeadFNotes textarea").val('');
            //            $(".finalComment textarea").val('');
            //            $(".headerpopupText input").val('');
            //            $(".time-input-div input").css('background-color', '#EDEDED');
            hideLoader();
            resetDatalogFieldsPopUp();
            hideDataLogPopUp();
        };
        editDataLogParseFunctionPopup = function() {
            if (isEdit == "Yes") {
                var datalogEdit = ({
                    data_log: {
                        gesn_unit_detail: pickedGesnNo,
                        globalDUNSNumber: globalDUNSNumber,
                        log_date: popUpDate,
                        uptime_hours: self.upTimeHours(),
                        uptime_minutes: self.upTimeMinutes(),
                        uptime_notes: self.upTimeNotes(),
                        idletime_hours: self.idleTimeHours(),
                        idletime_minutes: self.idleTimeMinutes(),
                        idletime_notes: self.idleTimeNotes(),
                        planned_outage_hours: self.plannedOutageHrs(),
                        planned_outage_minutes: self.plannedOutageMinutes(),
                        planned_outage_notes: self.plannedOutageNotes(),
                        unplanned_outage_hours: self.unplannedOutageHrs(),
                        unplanned_outage_minutes: self.unplannedOutageMinutes(),
                        unplanned_outage_notes: self.unplannedOutageNotes(),
                        data_log_notes: self.dataLogNotes()
                    }
                });
                return datalogEdit;
            } else if (isEdit == "No") {
                var datalogAdd = ({
                    dataLog: {
                        gesn_unit_detail: pickedGesnNo,
                        globalDUNSNumber: globalDUNSNumber,
                        logDate: popUpDate,
                        upTimehours: self.upTimeHours(),
                        upTimeminutes: self.upTimeMinutes(),
                        upTimenotes: self.upTimeNotes(),
                        idleTimehours: self.idleTimeHours(),
                        idleTimeminutes: self.idleTimeMinutes(),
                        idleTimenotes: self.idleTimeNotes(),
                        plannedOutagehours: self.plannedOutageHrs(),
                        plannedOutageminutes: self.plannedOutageMinutes(),
                        plannedOutagenotes: self.plannedOutageNotes(),
                        unplannedOutagehours: self.unplannedOutageHrs(),
                        unplannedOutageminutes: self.unplannedOutageMinutes(),
                        unplannedOutagenotes: self.unplannedOutageNotes(),
                        dataLogNotes: self.dataLogNotes()
                    }
                });
                return datalogAdd;
            }
        };

        /***********************************************/
        /*********For Datalog****************************/
        checkTimePopUp = function(hours, minutes) {
            var hoursNo = Number(hours);
            var minutesNo = Number(minutes);
            console.log(hoursNo);
            console.log(minutesNo);
            var temp1 = hoursNo * 10 / 10;
            var temp2 = minutesNo * 10 / 10;
            var hoursStg = String(temp1);
            var minuteStg = String(temp2);
            if (hours > 24 || hours < 0 || minutes < 0 || minutes > 59 || hours == undefined || minutes == undefined || hours != hoursStg || minutes != minuteStg || hours % 1 != 0 || minutes % 1 != 0)
                return false;
            else
                return true;
        };

        totalTimeValidationPopUp = function() {
            upTimeHours = Number(upTimeHours);
            upTimeMinutes = Number(upTimeMinutes);
            idleTimeHours = Number(idleTimeHours);
            idleTimeMinutes = Number(idleTimeMinutes);
            plannedOutageHrs = Number(plannedOutageHrs);
            plannedOutageMinutes = Number(plannedOutageMinutes);
            unplannedOutageHrs = Number(unplannedOutageHrs);
            unplannedOutageMinutes = Number(unplannedOutageMinutes);
            var totalTimeMinutes = ((upTimeHours * 60) + upTimeMinutes) + (idleTimeHours * 60) + idleTimeMinutes + (plannedOutageHrs * 60) + plannedOutageMinutes + (unplannedOutageHrs * 60) + unplannedOutageMinutes;
            totalTimeMinutes = totalTimeMinutes;
            var actualTime = 24 * 60;
            // console.log(totalTimeMinutes);
            // console.log(actualTime);
            if (totalTimeMinutes > actualTime)

                alert("Log Hours exceeds 24 hours");
            if (totalTimeMinutes < actualTime)

                alert("Log Hours less than 24 hours");
            if (totalTimeMinutes != actualTime)
                return false;
            else
                return true;
        };

        resetDatalogFieldsPopUp = function(condition) {
            self.upTimeHours('');
            self.upTimeMinutes('');
            self.upTimeNotes('');
            self.idleTimeHours('');
            self.idleTimeMinutes('');
            self.idleTimeNotes('');
            self.plannedOutageHrs('');
            self.plannedOutageMinutes('');
            self.plannedOutageNotes('');
            self.unplannedOutageHrs('');
            self.unplannedOutageMinutes('');
            self.unplannedOutageNotes('');
            self.dataLogNotes('');
            $(".datalog-input-container input").css('background-color', '#EDEDED');
            $(".datalog-input-container textarea").css('background-color', '#EDEDED');
        };

        fillDatalogFieldsPopup = function(dataLogFieldsObject) {
            console.log(dataLogFieldsObject);
            self.upTimeHours(dataLogFieldsObject.upTimeHours);
            self.upTimeMinutes(dataLogFieldsObject.upTimeMinutes);
            self.upTimeNotes(dataLogFieldsObject.upTimeNotes);
            self.idleTimeHours(dataLogFieldsObject.idleTimeHours);
            self.idleTimeMinutes(dataLogFieldsObject.idleTimeMinutes);
            self.idleTimeNotes(dataLogFieldsObject.idleTimeNotes);
            self.plannedOutageHrs(dataLogFieldsObject.plannedOutageTimeHours);
            self.plannedOutageMinutes(dataLogFieldsObject.plannedOutageTimeMinutes);
            self.plannedOutageNotes(dataLogFieldsObject.plannedOutageNotes);
            self.unplannedOutageHrs(dataLogFieldsObject.unPlannedOutageTimeHours);
            self.unplannedOutageMinutes(dataLogFieldsObject.unPlannedOutageTimeMinutes);
            self.unplannedOutageNotes(dataLogFieldsObject.unPlannedOutageNotes);
            self.dataLogNotes(dataLogFieldsObject.dataLogNotes);
            $(".datalog-input-container input").css('background-color', '#E1F1D3');
            $(".datalog-input-container textarea").css('background-color', '#E1F1D3');
        }
    };
});