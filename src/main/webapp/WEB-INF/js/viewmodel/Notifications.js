define(['knockout'], function(ko) {
    return function Notifications() {
        var self = this;
        self.pageId = "Notifications";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        $(".inside-container").css("height", "80px");
        self.notificationDataArray = ko.observableArray();
        self.countUrgent = ko.observable(0);
        self.countAdvisory = ko.observable(0);
        self.countAll = ko.observable(0);
        var countUrgent = 0;
        var countAdvisory = 0;
        var countAll = 0;
        var offset;
        var notificationDataArray;
        var notificationType = '';
        var lengthOfWebserviceResponse;
        var readStatusArray;
        var userProfile;
        var globalType;
        self.init = function(userProfileFromGloabalMenu) {
            console.log("in init function");
            console.log(organisationName);
            currentPageId = self.pageId;
            userProfile = userProfileFromGloabalMenu;
            getRowsFromSqliteTable();
            resetScrollInNotification();
            //            console.log(userProfile);
            offset = 0;
            sqliteTableValidation();
            self.all();
        };
        //       self.descriptionFunc = function(data) {
        //       console.log(data);
        //       data = data.replace("\n", "<br />");
        //       return data;
        //       };
        sqliteTableValidation = function() {
            console.log("in sqliteTableValidation function");
            db.transaction(function(tx) {
                tx.executeSql('select lastDay, rowid from notificationInfo', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    lastTimeNotificationcountCalled = result[0].lastDay;
                    app.GlobalMenu.vModel.sqliteTableModification(lastTimeNotificationcountCalled);
                }, null);

            });

        };

        self.clickedElementToExpand = function(data, event) {
            console.log("in clickedElementToExpand function");
            getRowsFromSqliteTable();
            //console.log(data);
            //console.log(data.readStatus);
            //console.log(event);
            // console.log(event.currentTarget);
            // console.log(event.currentTarget.nextSibling.parentNode);
            var x = event.currentTarget.nextSibling.parentNode;
            //console.log(x.children[1].style.height);
            var y = x.children[1].style.height;
            //console.log(y);
            // notificationReadStatus(primaryKey, readStatus)
            if (x.children[1].style.height == "80px") {
                self.defaultExpandCollapse();
                x.style.fontWeight = "normal";
                x.style.boxShadow = "-1px 1px 4px #CCCCCC";
                // x.style.backgroundColor = "#FFFFFF";
                x.children[1].style.height = "303px";
                x.children[1].style.overflow = "auto";
                x.children[2].style.display = "block";
                x.children[3].style.backgroundImage = 'url("../img/Notification/X-Notification-up-dropdown-arrow.png")';
                //                db.transaction(function(tx) {
                //                    tx.executeSql('update notificationReadStatus set readStatus = 1 where primaryKey = ' + data.primaryKey);
                //                });
                //                for (var k = 0; k < readStatusArray.length; k++) {
                //                    if (data.primaryKey == readStatusArray[k].primaryKey)
                //                        notificationDataArray[k].readStatus = 1;
                //                };
                //                decrementCount();

                // self.readUnreadStatus(data.primaryKey);
            } else {
                self.defaultExpandCollapse();
            }
        };
        decrementCount = function() {
            console.log("in decrementCount function");
            //zero for unread one for read
            var toDay = new Date();
            toDayUTC = toDay.toUTCString();
            // app.GlobalMenu.vModel.sqliteTableModification(toDayUTC);
            db.transaction(function(tx) {
                tx.executeSql('select count(primaryKey)-1 as counter from notificationReadStatus where readStatus = 0;', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    var len = result.length;
                    count = result[0].counter;
                    // count--;
                    db.transaction(function(tx) {
                        tx.executeSql('update notificationcount set countNot = ' + count + ' where rowid == 1');
                    });
                    app.GlobalMenu.vModel.sqliteTableModification(toDayUTC);
                }, null);

            });
        };

        // decrementCount = function() {
        // var toDay = new Date();
        // toDayUTC = toDay.toUTCString();
        // db.transaction(function(tx) {
        // tx.executeSql('select countNot, rowid from notificationcount', [], function(tx, results) {
        // var result = getDataInLocalVariableFromSQLite(results);
        // var len = result.length;
        // count = result[0].countNot;
        // count--;
        // db.transaction(function(tx) {
        // tx.executeSql('update notificationcount set countNot = ' + count + ' where rowid == 1');
        // });
        // app.GlobalMenu.vModel.sqliteTableModification(toDayUTC);
        // }, null);
        //
        // });
        // };

        self.defaultExpandCollapse = function() {
            console.log("in defaultExpandCollapse function");
            $(".inside-container").css('height', '80px');
            $(".inside-container").css('overflow', 'hidden');
            $(".hide").hide();
            $(".hidefooter").hide();
            $(".dropdown-notification").css('background-image', 'url("../img/Notification/X-Notification-down-dropdown-arrow.png")');
            var notificationContainer = document.getElementsByClassName("inside-container");
            for (i = 0; i < notificationContainer.length; i++) {
                notificationContainer[i].scrollTop = 0;
            };
        };

        self.urgent = function(data, event) {
            console.log("in self.urgent function");
            notificationType = "urgent";
            console.log("urgent");
            urgent();
            $(".notification-summary").css('color', "#5178D3");
            $(".notification-summary").css('background-color', "inherit");
            document.getElementById("urgent-summary").style.backgroundColor = "#5178D3";
            document.getElementById("urgent-summary").style.color = "white";
            //            alert("in self.urgent");
        };

        self.advisory = function(data, event) {
            console.log("in self.advisory function");
            notificationType = "advisory";
            console.log("advisory");
            advisory();
            $(".notification-summary").css('color', "#5178D3");
            $(".notification-summary").css('background-color', "inherit");
            document.getElementById("advisory-summary").style.backgroundColor = "#5178D3";
            document.getElementById("advisory-summary").style.color = "white";
        };

        self.all = function(data, event) {
            console.log("in self.all function");
            notificationType = 'all';
            console.log(lengthOfWebserviceResponse);
            offset = 0;
            // if (lengthOfWebserviceResponse < 10) {
            // notificationBinding(notificationType);
            // } else {
            notificationDataArray = [];
            self.webserviceCallForNotification(notificationType, offset);
            // }
            console.log("all");
            $(".notification-summary").css('color', "#5178D3");
            $(".notification-summary").css('background-color', "inherit");
            document.getElementById("all-summary").style.backgroundColor = "#5178D3";
            document.getElementById("all-summary").style.color = "white";
        };
        self.scrolled = function(data, event) {
            console.log("in self.scrolled function");
            if (event.target.scrollTop == (event.target.scrollHeight - event.target.offsetHeight)) {
                console.log("in scroll if condition: " + lengthOfWebserviceResponse);
                if (lengthOfWebserviceResponse < 5000) {
                    notificationBinding(notificationType);
                    $("#notification-load-more").hide();
                } else {
                    offset = offset + 5000;
                    self.webserviceCallForNotification(notificationType, offset);
                }
            }
        };
        self.loadMore = function() {
            offset = offset + 5000;
            self.webserviceCallForNotification(notificationType, offset);
        };
        self.webserviceCallForNotification = function(type, offset) {
            console.log("in webserviceCallForNotification function");
            $("#notification-scroll-loader").show();
            $("#notification-load-more").hide();
            // disbleGlobalMenu();
            globalType = type;
            showLoader();
            if (lengthOfWebserviceResponse < 5000) {
                notificationDataArray = [];
            }
            callService(webServiceURL_getNotifications + "?offset=" + offset + "&limit=5000&type=all", '', 'GET', webserviceCallForNotificationSuccess, webserviceCallForNotificationError);
        };
        webserviceCallForNotificationSuccess = function(result) {
            result = $.parseJSON(result);
            $("#notification-scroll-loader").hide();
            $("#notification-load-more").show();
            //console.log(result);
            //console.log(result.notifications);
            if (result.notifications == null) {
                offset = offset - 5000;
                hideLoader();
                lengthOfWebserviceResponse = 0;
                $("#notification-load-more").hide();
            } else if (result.notifications.length == 0) {
                hideLoader();
                lengthOfWebserviceResponse = 0;
                $("#notification-load-more").hide();
            } else {
                data = {
                    "notifications": []
                }

                for (i = 0; i < result.notifications.length; i++) {
                    if (result.notifications[i].organization.toLowerCase() == organisationName.toLowerCase())
                        data.notifications.push(result.notifications[i]);
                };
                var tempArray = data.notifications;
                //console.log(tempArray);
                lengthOfWebserviceResponse = result.notifications.length;
                insert10RowsInSqliteTable(data.notifications.length, offset);
                for (var i = 0; i < data.notifications.length; i++) {
                    tempArray[i]["id"] = offset + i;
                    tempArray[i]["primaryKey"] = offset + i;
                    tempArray[i]["readStatus"] = 0;
                    // tempArray[i]["tileDisplay"] = "none";
                    if (data.notifications[i].isUrgent == 'no') {
                        tempArray[i]["statusColor"] = "#FFC000";
                        tempArray[i]["urgentAssistDisplay"] = "inline-block";
                    } else {
                        tempArray[i]["statusColor"] = "#E45756";
                        tempArray[i]["urgentAssistDisplay"] = "inline-block";
                    }
                    if (data.notifications[i].updatedDate == '')
                        tempArray[i]["showDate"] = data.notifications[i].createdDate;
                    else
                        tempArray[i]["showDate"] = data.notifications[i].updatedDate;
                    // console.log(getRowsFromSqliteTable(i, tempArray));
                    // tempArray[i]["readStatus"] = getRowsFromSqliteTable(i, tempArray);
                    notificationDataArray.push(tempArray[i]);

                }
                // enableGlobalMenu();
                hideLoader();
            }
            console.log(notificationDataArray);
            //console.log(tempArray);
            notificationBinding(globalType);
        };
        webserviceCallForNotificationError = function(result, status) {
            //            alert(result);
            offset = offset - 5000;
            hideLoader();
       if(status == 404) {
            $("#notification-scroll-loader").hide();
            $("#notification-load-more").hide();
       } else {
            errorHandling(status);
       }
        };
        insert10RowsInSqliteTable = function(len, offset) {
            console.log("in insert10RowsInSqliteTable function");
            db.transaction(function(tx) {
                for (var i = 0; i < len; i++)
                    tx.executeSql('insert into notificationReadStatus(primaryKey, readStatus) values (' + (i + offset) + ', 0);');
            });
        };
        getRowsFromSqliteTable = function() {
            console.log("in getRowsFromSqliteTable function");
            db.transaction(function(tx) {
                tx.executeSql('select primaryKey, readStatus from notificationReadStatus', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    var len = result.length;
                    //console.log(result);
                    readStatusArray = result;
                }, null);

            });
        };
        self.readUnreadStatus = function(readStatusFromHtml) {
            console.log("in readUnreadStatus function");
            //console.log(readStatusFromHtml);
            if (readStatusFromHtml == 0)
                return "normal";
            else if (readStatusFromHtml == 1)
                return "normal";
        };
        self.readUnreadStatusBoxShadow = function(readStatusFromHtml) {
            console.log("in readUnreadStatusBoxShadow function");
            //console.log(readStatusFromHtml);
            if (readStatusFromHtml == 0)
                return "-1px 1px 4px #CCCCCC";
            else if (readStatusFromHtml == 1)
                return "-1px 1px 4px #CCCCCC";
        };

        self.openfeedbackPopUp = function(data, event) {
            console.log("in openfeedbackPopUp function");
            //console.log(data);
            config.bindViewModel(app.FeedbackPopup, function(viewModel) {
                app.FeedbackPopup.vModel.init(userProfile, data);
                showFeedbackPopup();
            });
        };

        self.openurgentAssistancePopUp = function(data, event) {
            console.log("in openurgentAssistancePopUp function");
            config.bindViewModel(app.UrgentAssistancePopup, function(viewModel) {
                app.UrgentAssistancePopup.vModel.init(userProfile, data);
                showUrgentAssistancePopup();
            });
        };
        notificationBinding = function(type) {
            console.log("in notificationBinding function");
            countAdvisory = 0;
            countUrgent = 0;
            countAll = notificationDataArray.length;
            for (var i = 0; i < countAll; i++) {
                //console.log(notificationDataArray[i].isUrgent);
                if (notificationDataArray[i].isUrgent == "no")
                    countAdvisory++;
                else
                    countUrgent++;
            }
            // console.log(countAll);
            // console.log(countAdvisory);
            // console.log(countUrgent);
            self.countAll(countAll);
            self.countUrgent(countUrgent);
            self.countAdvisory(countAdvisory);
            // self.notificationDataArray(notificationDataArray);
            // enableGlobalMenu();
            $(".RDPApp-loading").hide();
            if (type == "all") {
                all();
            } else if (type == "advisory") {
                advisory();
            } else if (type == "urgent") {
                urgent();
            }
            //console.log(countAll);
            //console.log(countAdvisory);
            console.log("All: " + countAll + ", Advisory: " + countAdvisory + " and Urgent: " + countUrgent);
        };
        urgent = function() {
            console.log("in urgent function");
            var tempArr = [];
            var id = 0;
            for (var i = 0; i < notificationDataArray.length; i++) {
                if (notificationDataArray[i].isUrgent == "yes") {
                    notificationDataArray[i].id = id;
                    for (var k = 0; k < readStatusArray.length; k++) {
                        if (i == readStatusArray[k].primaryKey)
                            notificationDataArray[i].readStatus = readStatusArray[k].readStatus;
                    };
                    tempArr.push(notificationDataArray[i]);
                    id++;
                }
            };
            self.notificationDataArray(tempArr);
        };
        advisory = function() {
            console.log("in advisory function");
            var tempArr = [];
            var id = 0;
            for (var i = 0; i < notificationDataArray.length; i++) {
                if (notificationDataArray[i].isUrgent == "no") {
                    notificationDataArray[i].id = id;
                    for (var k = 0; k < readStatusArray.length; k++) {
                        if (i == readStatusArray[k].primaryKey)
                            notificationDataArray[i].readStatus = readStatusArray[k].readStatus;
                    };
                    tempArr.push(notificationDataArray[i]);
                    id++;
                }
            };
            self.notificationDataArray(tempArr);
        };
        all = function() {
            console.log("in all function");
            var tempArr = [];
            // var tempReadArr = [];
            for (var i = 0; i < notificationDataArray.length; i++) {
                notificationDataArray[i].id = i;
                for (var k = 0; k < readStatusArray.length; k++) {
                    if (i == readStatusArray[k].primaryKey)
                        notificationDataArray[i].readStatus = readStatusArray[k].readStatus;
                };
                tempArr.push(notificationDataArray[i]);
            }
            self.notificationDataArray(tempArr);
        };

        self.searchNotifications = function(data, event) {
            console.log("in searchNotifications function");
            var target = event.target;
            //$('input').removeClass('iDebrief-search-input-magnifier');
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString = $("#search-notifications").val().trim();
                userString = userString.toUpperCase();
                console.log("userString");
                if (KeyID === 8) {
                    $(".notification-outside-container:contains(" + userString + ")").show();
                } else {
                    $(".notification-outside-container:contains(" + userString + ")").show();
                    $(".notification-outside-container:not(:contains(" + userString + "))").hide();
                };
            };

        };
        // advisory = function() {
        // var tempArr = [];
        // var id = 0;
        // for (var i = 0; i < notificationDataArray.length; i++) {
        // if (notificationDataArray[i].isUrgent == "no") {
        // tempArr.push(notificationDataArray[i]);
        // }
        // };
        // var len = tempArr.length;
        // for (var i = 0; i < len; i++)
        // tempArr[i].id = i;
        // console.log(tempArr);
        // self.notificationDataArray(tempArr);
        // };

        resetScrollInNotification = function() {
            var notificationBlock = document.getElementsByClassName("notification-block");
            notificationBlock[0].scrollTop = 0;
            var notificationContainer = document.getElementsByClassName("inside-container");
            for (i = 0; i < notificationContainer.length; i++) {
                notificationContainer[i].scrollTop = 0;
            };
        };

    };

});