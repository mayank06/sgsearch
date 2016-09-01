// Here's my data model

var ViewModel = function() {
	paginationNumbering = function(first, second, third, fourth, fifth, last) {
		self.firstPage(first);
		self.secondPage(second);
		self.thirdPage(third);
		self.fourthPage(fourth);
		self.fifthPage(fifth);
		self.lastPage(last);
	};
	pagenationBinding = function() {
		var totalResultCount = newXyz.length;
		var noOfPages = totalResultCount / 6;
		// noOfPages = 20;
		noOfPages = Math.ceil(noOfPages);
		console.log(noOfPages);
		if (noOfPages > 5) {
			paginationNumbering(1, 2, 3, 4, 5, '. . .');
		} else if (noOfPages == 1) {
			paginationNumbering(1, '', '', '', '', '');
		} else if (noOfPages == 2) {
			paginationNumbering(1, 2, '', '', '', '');
		} else if (noOfPages == 3) {
			paginationNumbering(1, 2, 3, '', '', '');
		} else if (noOfPages == 4) {
			paginationNumbering(1, 2, 3, 4, '', '');
		} else if (noOfPages == 5) {
			paginationNumbering(1, 2, 3, 4, 5, '');
		}
		self.hellYes(newXyz);
	};
	var self = this;
	self.searchString = ko.observable();
	self.firstPage = ko.observable('1');
	self.secondPage = ko.observable();
	self.thirdPage = ko.observable();
	self.fourthPage = ko.observable();
	self.fifthPage = ko.observable();
	self.lastPage = ko.observable();
	self.hellYes = ko.observableArray();
	self.lastName = ko.observable();
	var xyz = [{
		firstName : "asdf"
	}, {
		firstName : "ghjk"
	}, {
		firstName : "qwert"
	}, {
		firstName : "tyuyu"
	}, {
		firstName : "yyy"
	}, {
		firstName : "kgkg"
	}, {
		firstName : "sds"
	}, {
		firstName : "sdgsg"
	}, {
		firstName : "kjgkg"
	}, {
		firstName : "xcvbcv"
	}, {
		firstName : "sdgdg"
	}, {
		firstName : "lkj"
	}];
	var newXyz = xyz;
	// self.hellYes(xyz);
	pagenationBinding();
	self.searchContent = function(data, event) {
		console.log("searched");
		var target = event.target;
		if ( typeof event !== "undefined") {
			var KeyID = event.keyCode;
			var userString = $("#search-info").val().trim();
			console.log("userString");
			newXyz = [];
			for ( i = 0; i < xyz.length; i++) {
				if (xyz[i].firstName.search(userString) != -1) {
					newXyz.push(xyz[i]);
				};
			};
			pagenationBinding();
		}
	};
	clickedOnPage = function(pageDiv, pageNo) {
		$(".page-no").css('backgroundColor', 'white');
		pageDiv.style.backgroundColor = "#DDDDDD";
		var firstResult = ((pageNo-1)*6);
		console.log(firstResult);
	// 1 --> 0 to 5
	// 2 --> 6 to 11
	// 3 --> 12 to 17				
		var xyzPage = [];
		for(i=firstResult;i<firstResult+6;i++) {
			xyzPage.push(newXyz[i]);
		};
		self.hellYes(xyzPage);
	};
	self.clickedOnFirstPage = function(data, event) {
		console.log(event.currentTarget);
		console.log(event.currentTarget.innerHTML);
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
	self.clickedOnSecondPage = function(data, event) {
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
	self.clickedOnThirdPage = function(data, event) {
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
	self.clickedOnFourthPage = function(data, event) {
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
	self.clickedOnFifthPage = function(data, event) {
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
	self.clickedOnLastPage = function(data, event) {
		clickedOnPage(event.currentTarget, event.currentTarget.innerHTML);
	};
};

ko.applyBindings(new ViewModel());
