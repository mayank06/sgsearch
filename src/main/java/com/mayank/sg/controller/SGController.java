package com.mayank.sg.controller;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.ResponseBody;

import com.mayank.sg.constant.SGConstant;
import com.mayank.sg.pojo.Count;
import com.mayank.sg.pojo.Greetings;
import com.mayank.sg.pojo.Search;
import com.mayank.sg.services.SGService;

/**
 * 
 * @author Mayank Sinha
 *
 */

@Controller
@RequestMapping("/")
public class SGController {

	private static final Logger logger = Logger.getLogger(SGController.class);
	

	@RequestMapping(value="/")
	public String getHomePage(final HttpServletRequest request, final HttpServletResponse response) {

		logger.debug("in getHomePage() : Resource class");
		logger.info("request from mobile client for getHomePage : "+System.currentTimeMillis());

		logger.info("response from middleware for getHomePage : "+System.currentTimeMillis());
		return "home";
	}
	
	
	@Autowired
	SGService sgservice;
	
	/**
	 * fetches the details of all members from the database
	 * @param offset
	 * @param limit
	 * @param status
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value=SGConstant.SEARCH_MEMBERS, method=RequestMethod.GET,produces={"application/json;charset=UTF-8"})
	@ResponseBody Search getMembers(final HttpServletRequest request, final HttpServletResponse response) {

		logger.debug("in getMembers() : Resource class");
		logger.info("request from mobile client for getMembers : "+System.currentTimeMillis());

		Search memberSearch = null;

		try {
			memberSearch = sgservice.getMembers();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("response from middleware for getMembers : "+System.currentTimeMillis());
		return memberSearch;
	}
	
	
	/**
	 * fetches the total count of members in database
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value=SGConstant.COUNT_MEMBERS, method=RequestMethod.GET,produces={"application/json;charset=UTF-8"})
	@ResponseBody Count getCountOfMembers(final HttpServletRequest request, final HttpServletResponse response) {

		logger.debug("in getCountOfMembers() : Resource class");
		logger.info("request from mobile client for getCountOfMembers : "+System.currentTimeMillis());

		Count countOfRecords = null;

		try {
			countOfRecords = sgservice.getCountOfMembers();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("response from middleware for getCountOfMembers : "+System.currentTimeMillis());
		return countOfRecords;
	}
	
	/**
	 * get greetings 
	 * @param request
	 * @param response
	 * @return
	 */
	@RequestMapping(value=SGConstant.GREETINGS, method=RequestMethod.GET,produces={"application/json;charset=UTF-8"})
	@ResponseBody Greetings getGreetings(final HttpServletRequest request, final HttpServletResponse response) {

		logger.debug("in getGreetings() : Resource class");
		logger.info("request from mobile client for getGreetings : "+System.currentTimeMillis());

		Greetings greetings = null;

		try {
			greetings = sgservice.getGreetings();
		}
		catch (Exception e) {
			e.printStackTrace();
		}
		logger.info("response from middleware for getGreetings : "+System.currentTimeMillis());
		return greetings;
	}
}
