define(['knockout'], function(ko) {
    return function Organisation() {
        var self = this;
        self.pageId = "Organisation";
        var db = openDatabase('RDPApp', '1.0', 'Test DB', 2 * 1024 * 1024);
        document.getElementById("org-list").style.display = "none";
        self.organisationListOpt = ko.observableArray();
        self.organisationListLabel = ko.observable();
        self.organisationListValue = ko.observable();
        self.organisationListValueUpp = ko.observable();
        self.org = ko.observableArray();
        self.orgList = ko.observableArray();
        self.rowId = ko.observableArray();
        var organizationlistarray = "";
        var userRole;
        var userProfile;
        var startTime;
        var endTime;
        var curOrg;
       var OrgVal;
        self.selectedItem = ko.observable();
        self.asdf = ko.observable();
        self.init = function(user) {
            currentPageId = self.pageId;
            console.log("inside org in init");
            $("#Login").hide();
            hideLoaderWhite();
       
            $("#tags").val("");
       var constantMinus1 = -1;
       self.organisationListValue(constantMinus1);
            userRole = user;
            self.organisationListLabel('');
            // self.callWebService();
            // self.start();
            $('html').click(function() {
                $('#org-list').hide();
                $('.orgname').hide();
            });

            $('#tags').click(function(event) {
                console.log(event);
                $('#org-list').show();
                $('.orgname').show();
                event.stopPropagation();
            });
       hideLoader();

        };
        console.log("it is outside");

        self.autoCompleteOrganizationListOptions = function(availableTags, userProfilefromLogin) {
            userProfile = userProfilefromLogin;
            console.log("No of Organisations: " + availableTags.length);
            self.orgList(availableTags);
            //console.log(self.orgList()[0].label);
            $("#Login").hide();
            $("#" + currentPageId).show();
            hideLoader();
        };

        self.clickedElement = function(data, event) {
            console.log("Inside clickedElement");
            console.log("selected: "+data.label);
            self.organisationListLabel(data.label);
            self.organisationListValue(data.value);
            var temp = data.value;
            self.organisationListValueUpp(data.value);
            document.getElementById("org-list").style.display = "none";
            // $("#org-list").hide();
        };

        self.onFocus = function(data, event) {
            // var temp = document.getElementById("org-list").style.display;
            // if (temp == "none")
            // document.getElementById("org-list").style.display = "block";
            // else
            // document.getElementById("org-list").style.display = "none";
        };

        self.onBlur = function(data, event) {
            // self.clickedElement(data, event);
            document.getElementById("org-list").style.display = "none";
        };

        self.searchOrganisation = function(data, event) {
            document.getElementById("org-list").style.display = "block";
            var target = event.target;
            if (typeof event !== "undefined") {
                var KeyID = event.keyCode;
                var userString1 = $("#tags").val().trim();
                var userString = userString1.toUpperCase();
                //console.log("userString");
                if (KeyID === 8) {
                    $(".orgname:contains(" + userString + ")").show();
                } else {
                    $(".orgname:contains(" + userString + ")").show();
                    $(".orgname:not(:contains(" + userString + "))").hide();
                }
            }

        };

        self.emptyInput = function(data, event) {
            // $("#tags").val("");
            console.log("hello");
            console.log(event);
            console.log(data);
            // var x = document.getElementById("org-list").style.display;
            var x = event.currentTarget.nextElementSibling.style.display;

            console.log(x);
            if (x == "none") {
                // $(".orgname").css('display', 'block');
                // document.getElementById("org-list").style.display = "block";
                event.currentTarget.nextElementSibling.style.display = "block";
            } else if (x == "block") {
                // document.getElementById("org-list").style.display = "none";
                event.currentTarget.nextElementSibling.style.display = "none";
            }
        };

        self.submitOrg = function(data, event) {
            showLoader();
            //console.log("data of organisation");
            //console.log(event);
            var DUNSNo;
            console.log("Inside submitOrg");
            var OrgVal = self.organisationListValue();
            if (OrgVal == -1 || OrgVal == null || OrgVal == undefined) {
                hideLoader();
                alert("Please enter Organisation");
            } else {
                var rowID = self.rowId();
                //console.log("OrgVal");
                console.log("Id of organization: "+OrgVal);
                //console.log(rowID);
                db.transaction(function(tx) {
                    tx.executeSql('select organisationName, globalDUNS from organisation where rowid = "' + OrgVal + '";', [], function(tx, results) {
                        var len = results.rows.length;
                        //console.log(results.rows);
                        var xArray;
                        var result = getDataInLocalVariableFromSQLite(results);
                        //console.log(result);
                        DUNSNo = result[0].globalDUNS;
                        curOrg = result[0].organisationName;
                        globalDUNSNumber = DUNSNo;
                        organisationName = curOrg;
                        console.log("Organisation: "+curOrg+" and DUNSNo: "+DUNSNo);
                        startTime = new Date();
                        callService(webServiceURL_getSrNo_GE + DUNSNo, '', 'GET', submitOrgSuccess, submitOrgError);
                    }, null);

                });
            }
        };

        submitOrgSuccess = function(data) {
            endTime = new Date();
            data = JSON.parse(data);
            //alert(((endTime-startTime)/1000));
            //console.log(((endTime - startTime) / 1000));
            console.log(data);
            //console.log(data.equipmentList);
            var temp = data.equipmentList;
            //							var eqNo = [];
            //							for (var i = 0; i < temp.length; i++) {
            //								eqNo.push(data.equipmentList[i].globalSerialNumber);
            //							}
            //							console.log(eqNo);
            // $("#" + currentPageId).hide();
            var availableTags = self.orgList();
            OrgVal = -1;
            config.bindViewModel(app.GlobalMenu, function(viewModel) {
                app.GlobalMenu.vModel.init(userRole, userProfile);
                app.GlobalMenu.vModel.getMachineSerialNoFromGlobalDUSN(data);
                app.GlobalMenu.vModel.sendOrganizationData(availableTags, curOrg);
            });

        };

        submitOrgError = function(data, status) {
            errorHandling(status);
        };

    };

});