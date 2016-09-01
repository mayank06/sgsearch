package com.mayank.sg.services;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;

import com.mayank.sg.dao.SGDao;
import com.mayank.sg.pojo.Count;
import com.mayank.sg.pojo.Greetings;
import com.mayank.sg.pojo.Search;

/**
 * 
 * @author Mayank Sinha
 *
 */
public class SGService {

	private static final Logger logger = Logger.getLogger(SGService.class);

	@Autowired
	SGDao sgdao;
	
	
	public Search getMembers() {
		logger.debug("in getMembers() : Service class");
		return sgdao.getMembers();
	}


	public Count getCountOfMembers() {
		logger.debug("in getCountOfMembers() : Service class");
		return sgdao.getCountOfMembers();
	}


	public Greetings getGreetings() {
		logger.debug("in getGreetings() : Service class");
		return sgdao.getGreetingMessage();
	}

}
