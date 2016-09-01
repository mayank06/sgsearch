package com.mayank.sg.utils;

public class SGUtils {

	public static String raceCondition(int raceCondition) {
	
		String race="";
		switch(raceCondition) {
		case 0:
			race = "Asian";
			break;
		
		case 1:
			race = "Indian";
			break;
		
		case 2:
			race = "African Americans";
			break;
			
		case 3:
			race = "Asian Americans";
			break;
			
		case 4:
			race = "European";
			break;
			
		case 5:
			race = "British";
			break;
			
		case 6:
			race = "Jewish";
			break;
			
		case 7:
			race = "Latino";
			break;
			
		case 8:
			race = "Native American";
			break;
			
		case 9:
			race = "Arabic";
			break;
			
		}
		
		return race;
	}
}
