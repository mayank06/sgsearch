package com.mayank.sg.dao;

import java.util.ArrayList;
import java.util.Calendar;
import java.util.List;
import java.util.Map;

import org.apache.log4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.jdbc.core.JdbcTemplate;

import com.mayank.sg.constant.SGQueries;
import com.mayank.sg.pojo.Count;
import com.mayank.sg.pojo.Greetings;
import com.mayank.sg.pojo.Members;
import com.mayank.sg.pojo.Search;
import com.mayank.sg.utils.SGUtils;

/**
 * 
 * @author Mayank Sinha
 *
 */
public class SGDao {

	private static final Logger logger = Logger.getLogger(SGDao.class);

	@Autowired
	private JdbcTemplate jdbcTemplate;

	public JdbcTemplate getJdbcTemplate() {
		return jdbcTemplate;
	}

	public void setJdbcTemplate(JdbcTemplate jdbcTemplate) {
		this.jdbcTemplate = jdbcTemplate;
	}

	/**
	 * fetches all members details
	 * @return
	 */
	public Search getMembers() {

		logger.debug("request received from resource @"+System.currentTimeMillis());
		Search searchMembers = new Search();
		Members members = null;
		List<Members> memberList = new ArrayList<Members>();

		try {
			logger.debug(jdbcTemplate.getDataSource().getConnection());
			logger.debug("sql query ::"+ SGQueries.queryForAllMembers);

			List<Map<String, Object>> rows = jdbcTemplate.queryForList(SGQueries.queryForAllMembers);

			if(rows!=null){
				logger.debug("Records ::" + rows.size());
			}else{
				logger.debug("no rows found");
			}

			for(Map row : rows)
			{
				members = new Members();
				if(row.get("id")!=null)
				{
					members.setId(Integer.parseInt(row.get("id").toString()));
				} 

				if(row.get("status")!=null)
				{
					members.setStatus((String)row.get("status"));
				}
				else{
					members.setStatus(null);
				}

				int raceCondition = Integer.parseInt(row.get("race").toString());
				members.setRace(SGUtils.raceCondition(raceCondition));  // converts the race values to their corresponding Race 
				
				if(row.get("weight")!=null)
				{
					float weight = Integer.parseInt((row.get("weight").toString()));
					float wt = weight/1000;	// converts the weight in grams to Kg

					String wtValue = String.valueOf(wt);
					members.setWeight(wtValue);
				}

				if(row.get("height")!=null)
				{
					int ht = Integer.parseInt(row.get("height").toString());
					String height = String.valueOf(ht);
					members.setHeight(height);
					//members.setHeight(Integer.parseInt(row.get("height").toString()));
				}

				if(row.get("is_veg")!=null)
				{
					int vegan = Integer.parseInt(row.get("is_veg").toString());
					if(vegan == 0)
					{
						members.setVegan("Veg");
					}
					else
					{
						members.setVegan("Non-Veg");
					}
				}

				memberList.add(members);	
			}
			searchMembers.setMembers(memberList);

		}catch(Exception e) {
			e.printStackTrace();
			logger.error("Exception ", e);
		}

		return searchMembers;
	}

	/**
	 * fetches total count of members
	 * @return
	 */
	public Count getCountOfMembers() {
		logger.debug("request received from resource @"+System.currentTimeMillis());
		Count count = new Count();

		try {
			logger.debug(jdbcTemplate.getDataSource().getConnection());
			logger.debug("sql query ::"+ SGQueries.queryForTotalCountOfMembers);

			int total = jdbcTemplate.queryForInt(SGQueries.queryForTotalCountOfMembers);
			count.setTotalRecords(total);
		}catch(Exception e) {
			e.printStackTrace();
			logger.error("Exception ", e);
		}
		return count;
	}


	/**
	 * get greetings 
	 * @return
	 */
	public Greetings getGreetingMessage() {
		logger.debug("request received from resource @"+System.currentTimeMillis());
		Greetings greetings = new Greetings();
		try {

			int hours = (Calendar.getInstance().get(Calendar.HOUR_OF_DAY)); 
			if(hours > 0 && hours < 12) {
				greetings.setMessage("Bonjour !!");	// Good Morning
				greetings.setTimestamp(Calendar.getInstance().get(Calendar.HOUR_OF_DAY)+":"+Calendar.getInstance().get(Calendar.MINUTE)+":"+Calendar.getInstance().get(Calendar.SECOND));
			}
			else if(hours >=12 && hours < 17) {
				greetings.setMessage("bon après-midi !!"); // Good Afternoon
				greetings.setTimestamp(Calendar.getInstance().get(Calendar.HOUR_OF_DAY)+":"+Calendar.getInstance().get(Calendar.MINUTE)+":"+Calendar.getInstance().get(Calendar.SECOND));

			}
			else{
				greetings.setMessage("bonne soirée !!"); // Good Evening
				greetings.setTimestamp(Calendar.getInstance().get(Calendar.HOUR_OF_DAY)+":"+Calendar.getInstance().get(Calendar.MINUTE)+":"+Calendar.getInstance().get(Calendar.SECOND));

			}
		    
		}catch(Exception e) {
			e.printStackTrace();
			logger.error("Exception ", e);
		}
		return greetings;
	}
}
