define(['knockout'], function(ko) {
    return function Login() {
        var self = this;
        self.pageId = "Login";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        var userProfile;
        var msgFromLogin;
        var SSOID;
        var Password;
        self.init = function(msg) {
            currentPageId = self.pageId;
            msgFromLogin = msg;
            $("#Login").show();
            console.log("inside log in init");
        };
/* 
 Note: Binding variabls are used to grab the sso and password from input boxes.
       Local variables are used for the validation and pingfed POST Webserivce
 */
        self.UserName = ko.observable(); //Defining knockout variable to bind SSO entered from input box
        self.Password = ko.observable(); //Defining knockout variable to bind password entered from input box
        self.submitInput = function() {
            console.log("Inside submitInput");
           // startTime = new Date();
            SSOID = self.UserName(); //Entered SSO Passed to 'SSOID' variable
            Password = self.Password(); //Entered Password Passed to 'Password' variable

            if (self.validateLogin(SSOID, Password)) {
                globalSSOID = self.UserName();
                showLoader();
                //console.log(globalSSOID);
                $.ajax({
                    url: authorizationRefreshUrl,
                    data: {
                        grant_type: 'password',
                        username: globalSSOID, //Passing the SSO to webservice
                        password: Password, //Passing the Password to webservice
                        client_id: 'GEPW_emPowerMe_Client',
                        // client_secret: 'bV10DI3exqYurdEZOCNWnY9pXi9DRNNbMaorV3zA0narNO0J5cRTgVQTH2u9jRLA', //For Prod
                       client_secret: 'FBYzXoB2umEOMxViqe5j0o10GcGop2FwK8SMJoRGfSWOe1a06VJfFxw1LkvPHeuY', //For stage
                       scope: 'GEPW_emPowerMe_API openid profile B2B_Allow_Policy'
//                       scope: 'GEPW_emPowerMe_API'
                       
                    },
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                    },
                    type: 'POST',
                    success: function(data) {
                        pingfedServerSuccess(data);
                    },
                    error: function(data) {
                        pingfedServerError(data);
                    }
                });

            }
        };
        pingfedServerSuccess = function(data) {
            SSOID = ''; //If pingfed webservice successfull SSOID variable was cleared
            Password = ''; //If pingfed webservice successfull Password variable was cleared
            console.log(data);
            localStorage.setItem("accessToken", data.access_token);
            localStorage.setItem("refreshToken", data.refresh_token);
            self.webserviceCallAfterLogin();
       };

       
        pingfedServerError = function(data, status) {
            SSOID = ''; //If pingfed webservice failed SSOID variable was cleared
            Password = ''; //If pingfed webservice failed Password variable was cleared
            self.Password(''); //If pingfed webservice failed, it will clear the binding variable password
            console.log(data);
            hideLoader();
            if (data.status == 400) {
                alert("Username or Password is incorrect", "&#9888; Warning");
                hideLoader();
            } else if(Math.floor(status / 100) == 5) {
                errorHandling(status);
            }
       };
        self.openPDF = function() {
            var openPDFDoc = window.open('../document/DPS Portal Customer Access Request Process.pdf', '_blank', 'location=no,toolbar=yes,toolbarposition=top');
        };
       
       self.webserviceCallAfterLogin = function() {
            callService(webServiceURL_Login, '', 'GET', loginSuccessValid, loginErrorValid);
//            accessToken = localStorage.getItem("accessToken");
//            $.ajax({
//                    url: webServiceURL_Login,
//                    headers: {
//                        'Authorization': 'Bearer' + accessToken
//                    },
//                    success: function(data) {
//                        loginSuccessValid(data);
//                    },
//                    error: function(data) {
//                        loginErrorValid(data);
//                    }
//                })
       };
       
        loginSuccessValid = function(data) {
            data = $.parseJSON(data);
            //endTime = new Date();
            self.UserName(''); //After complete success of login Binding variable UserName was cleared
            self.Password(''); //After complete success of login Binding variable Password was cleared
            console.log(data);
            if (data.userRole == "GE User") {
                postWebServiceForNotification();
                console.log("GE user");
                console.log(data);
                userProfile = data;
                self.storeOrganizationDataInLocalDb(data);
                // $("#" + currentPageId).hide();
                config.bindViewModel(app.Organisation, function(viewModel) {
                    app.Organisation.vModel.init(data.userRole);
                    // hideLoader();
                });

            } else if (data.userRole == "Non-GE User") {
                SSOID = data.ssoID;
                postWebServiceForNotification();
                console.log("non GE");
                userProfile = data;
                callService(webServiceURL_getSrNo_NonGE + SSOID, '', 'GET', getMachineDataForNonGeSuccess, getMachineDataForNonGeError);

            } else {
                alert("You don't have access to inside");
                hideLoader();
            }
        };

        loginErrorValid = function(data) {
            console.log(data);
//            console.log(status);
            self.UserName('');
            self.Password('');
            try {
                data = $.parseJSON(data);
            } catch(e) {
                console.log(e);
            }
//            if(status != 200) {
//                alert("Service unavailable, please try after some time.", "&#9888; Server Error");
//                clickFunctionSignout();
//            }
            if (Math.floor(status / 100) == 5) {
                alert("Server Error, please login after some time!", "&#9888; "+status+" Server Error");
            } else if(Math.floor(status / 100) == 4 && status != 401) {
                alert("Invalid request, please login after some time!", "&#9888; "+status+" Error");
            } else {
                  alert("Please login again", "&#9888; "+status+" Error");
            }
            clickFunctionSignout();
            hideLoader();
//            if (data.status == 500 || data.status == 503) {
       
//       } else {
//       alert("Service unavailable, please login again.");
//       clickFunctionSignout();
//       }
        };
        getMachineDataForNonGeSuccess = function(data) {
            data = $.parseJSON(data);
            console.log(data);
            var eqList = ({
                'equipmentList': [],
                'errorMessage': ''
            });
            eqList.errorMessage = data.errorMessage;
            var newEqlistObject = new Object(data.equipmentList[0]);
            var len = data.equipmentList.length;
            for (i = 0; i < len; i++) {
                newEqlistObject = data.equipmentList[i];
                newEqlistObject.title = data.equipmentList[i].siteID;
                eqList.equipmentList.push(newEqlistObject);
            }
            organisationName = eqList.equipmentList[0].organization;
            globalDUNSNumber = eqList.equipmentList[0].globalDUNSNumber;
            config.bindViewModel(app.GlobalMenu, function(viewModel) {
                app.GlobalMenu.vModel.init("Non-GE User", userProfile);
                app.GlobalMenu.vModel.getMachineSerialNoFromGlobalDUSN(eqList);
            });

        };

        getMachineDataForNonGeError = function(data, status) {
            data = $.parseJSON(data);
            errorHandling(status);
        };
        
        self.validateLogin = function(SSOID, Password) {
            if ((typeof SSOID !== "undefined") && (typeof Password !== "undefined") && (SSOID.trim().length != 0) && (Password.trim().length != 0)) {
                return true;
            } else {
                if ((typeof SSOID === "undefined") || (SSOID.trim().length == 0)) {
                    alert("Please enter the SSO")
                } else if (typeof Password === "undefined" || (Password.trim().length == 0)) {

                    alert("Please enter the Password");
                }
                return false;
            }
        };

        self.storeOrganizationDataInLocalDb = function(data) {
            console.log(data);
            db.transaction(function(tx) {
                tx.executeSql("drop table if exists organisation;");
            });
            db.transaction(function(tx) {
                tx.executeSql("create table organisation(organisationName varchar2, globalDUNS varchar2);");
            });
            var orgNameArray = [];
            var DUNSNumArray = [];
            for (var i = 0; i < data.organizationList.length; i++) {
                var tempOrg = data.organizationList[i].organization;
                orgNameArray.push(tempOrg.toUpperCase());
                DUNSNumArray.push(data.organizationList[i].globalDUNSNumber);
            }
            var i = 0;
            var temp = 'insert into organisation(organisationName, globalDUNS) values ("' + orgNameArray[i] + '", "' + DUNSNumArray[i] + '");';
            //console.log(temp);
            db.transaction(function(tx) {
                for (var i = 0; i < data.organizationList.length; i++)
                    tx.executeSql('insert into organisation(organisationName, globalDUNS) values ("' + orgNameArray[i] + '", "' + DUNSNumArray[i] + '");');
            });
            self.getOrganizationFromLocalDb();
        };

        self.getOrganizationFromLocalDb = function() {
            db.transaction(function(tx) {
                tx.executeSql('select organisationName, rowid from organisation', [], function(tx, results) {
                    var result = getDataInLocalVariableFromSQLite(results);
                    var len = result.length;
                    var availableTags = [],
                        rowid = [];
                    for (var i = 0; i < len; i++) {
                        availableTags.push({
                            label: result[i].organisationName,
                            value: result[i].rowid
                        });
                    };
                    app.Organisation.vModel.autoCompleteOrganizationListOptions(availableTags, userProfile);
                }, null);
            });
        };

        postWebServiceForNotification = function() {
            var deviceTokenFlag = localStorage.getItem("deviceTokenFlag");
            if (deviceTokenFlag == 'true') {
                return;
            } else {
                db.transaction(function(tx) {
                    tx.executeSql('select strDeviceToken, rowid from tblDeviceToken;', [], function(tx, results) {
                        var len = results.rows.length;
                        var deviceToken;
                        var result = getDataInLocalVariableFromSQLite(results);
                        console.log(result);
                        console.log(result[0].rowid);
                        var rowIdInTableFirst = result[0].rowid;
                        deviceToken = result[0].strDeviceToken;
                        localStorage.setItem("deviceToken", deviceToken);
                        //                        alert(deviceToken);
//                        webServiceURL_tokens = 'http://3.209.197.8:8084/empowerme/tokens';
                        //deviceToken = "";
                        deviceToken = localStorage.getItem("deviceToken");
                        notify = ({
                            "apns_token": {
                                "TokenID": deviceToken,
                                "flag": '',
                                "message": ''
                            }
                        });
                        var jsonNotification = JSON.stringify(notify);
                        console.log(deviceToken);
                        //console.log('jsonNotification');
                        console.log(jsonNotification);
                        callService(webServiceURL_tokens, jsonNotification, "POST", postWebServiceForNotificationSuccess, postWebServiceForNotificationError);
                    }, null);

                });
            }

        };
        postWebServiceForNotificationSuccess = function(result) {
            result = $.parseJSON(result);
            console.log(result);
            alert("Device is registered.");
            if (result.apns_token.flag == "true")
                localStorage.setItem("deviceTokenFlag", "true");
            else
                localStorage.setItem("deviceTokenFlag", "false");
        };
        postWebServiceForNotificationError = function(result, status) {
            result = $.parseJSON(result);
            if (Math.floor(status / 100) == 5) {
                alert("Device is not registered properly!", "&#9888; "+status+" Server Error");
            } else if(Math.floor(status / 100) == 4) {
                alert("Device is not registered properly!", "&#9888; "+status+" Error");
            }
        };

    };
});