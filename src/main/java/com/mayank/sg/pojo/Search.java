package com.mayank.sg.pojo;

import java.util.List;

/**
 * 
 * @author Mayank
 *
 */
public class Search {

	private List<Members> members;
	private String errorMsg;

	public List<Members> getMembers() {
		return members;
	}

	public void setMembers(List<Members> members) {
		this.members = members;
	}

	public String getErrorMsg() {
		return errorMsg;
	}

	public void setErrorMsg(String errorMsg) {
		this.errorMsg = errorMsg;
	}
	
	
}
