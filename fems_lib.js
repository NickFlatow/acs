function func_log(para)
{
	cpe.log('[DMT '+SerialNumber+' ]'+ para);
}

function func_log_Save(para)
{
	if(cpedb.cpelog) 
		cpedb.cpelog= cpedb.cpelog+'|'+para;    
	else
		cpedb.cpelog= '[DMT '+SerialNumber+' of DM provisionbean_lte]'+para;
}

function func_logSave(act,success,para,schedule,byWho)
{   
	try 
	{
		var sql_add= "INSERT INTO `"+cpedb.ActionHistoryDB+"`( `SN`, `BTS`, `LCR`, `Action`, `Success`, `Result`, `User`) VALUES ('"+
		SerialNumber+  "', '"+
		cpedb.cpeBTS+  "', '"+
		cpedb.cpeLCR+  "', '"+
		act+           "', '"+
		success+       "', '"+
		para+          "', '"+
		byWho+         "');";

		//cpe.log(SerialNumber+':'+sql_add);
		var rs = db.Update(sql_add); 

	} catch (e) {
		cpe.log(SerialNumber+':'+'DS exception: '+e.message);
	}
}


function Insert_into_alarm_action_table(alarmID, cmd, updateTime,Status, Ack, CMT, Log, user)
{
	try
	{	
		var sql_cmd = cmd + updateTime + "', '"+ 
		Status+      "', '"+
		Ack+         "', '"+ 
		CMT+         "', '"+
		Log+         "', '"+
		user+        "');";
		db.Update(sql_cmd);
		//cpe.log(SerialNumber+':'+'Insert alarm '+alarmID+' to '+cpedb.AlarmActionDB+' DB done');
	}
	catch(e)
	{
		func_log ("DS exception: "+e.message);
	}
}

function func_TmpCfgGet(cfgStr)
{
	var tmpStart=cfgStr.indexOf("[[(");
	var tmpEnd= cfgStr.indexOf(")]]");
	//cpe.log(SerialNumber+':'+'tmpStart='+tmpStart+', tmpEnd='+ tmpEnd);
	if(tmpStart && tmpEnd && tmpStart>=0 && tmpEnd>=0 &&  tmpStart < tmpEnd)
		return cfgStr.substring(tmpStart+3, tmpEnd);
	else
		return "";
}

function func_getCfgValue(ServiceCfgStr, paraName)
{
	var cfgGet = new Array();   
	var i  =0;

	cfgGet=ServiceCfgStr.split(";");
	for(i=0;i<cfgGet.length;i++)
	{
		//cpe.log(SerialNumber+': cfgGet['+i+']='+cfgGet[i]);
		var strindex=cfgGet[i].indexOf("=");
		if(strindex!=-1)
		{
			var split_str=cfgGet[i].split("=");
			//cpe.log(SerialNumber+': split_str:tag['+split_str[0]+'] value['+split_str[1]+']'); 
			var tag     = split_str[0];
			var cfgValue= split_str[1];

			if(tag==paraName)
			{   
				return cfgValue;
			}
		}
	}
	return "";
}

/* Foxconn 20171024 jay add: Delete Unsubscribe-reset-to-default from cpedb.ActionQDB */
function func_deleteUnsubscribedResetDefault()
{
	try
	{	
		var sql_query="SELECT * FROM `"+cpedb.ActionQDB+"` WHERE `SN` = '"+SerialNumber+"' AND `Action` = 'Unsubscribed-reset-to-default';";
		cpe.log(SerialNumber+':'+sql_query);
		var AQrs = db.Query(sql_query);       
		cpe.log(SerialNumber+':'+'Rows found in Action queue DB is = '+AQrs.length);

		if(AQrs.length>0)
		{
			sql_query="DELETE FROM `"+cpedb.ActionQDB+"` WHERE `SN` = '"+SerialNumber+"' AND `Action` = 'Unsubscribed-reset-to-default';";
			cpe.log(SerialNumber+':'+'sql = '+sql_query);            
			db.Update(sql_query);
		}
	}catch(e)
	{
		func_log ("DS exception: "+e.message);
	}
}
//20180926, Darren, separate function for HeNB and SiriusFly respectively.
function func_deleteUnsubscribedResetDefaultSiriusFly()
{
	try
	{	
		var sql_query="SELECT * FROM `"+cpedb.ActionQDB_SiriusFly+"` WHERE `SN` = '"+SerialNumber+"' AND `Action` = 'Unsubscribed-reset-to-default';";
		cpe.log(SerialNumber+':'+sql_query);
		var AQrs = db.Query(sql_query);       
		cpe.log(SerialNumber+':'+'Rows found in Action queue DB is = '+AQrs.length);

		if(AQrs.length>0)
		{
			sql_query="DELETE FROM `"+cpedb.ActionQDB_SiriusFly+"` WHERE `SN` = '"+SerialNumber+"' AND `Action` = 'Unsubscribed-reset-to-default';";
			cpe.log(SerialNumber+':'+'sql = '+sql_query);            
			db.Update(sql_query);
		}
	}catch(e)
	{
		func_log ("DS exception: "+e.message);
	}
}
/* Foxconn 20171024 jay add */

/* Foxconn 20180117 jay add */
function catchMessage(e)
{
	var message = e.message;
	if(message == 'request timed out')
	{
		func_log("CWMP Error: "+message);
	}
	else
	{
		var CwmpFaultCode = e.CwmpFaultCode;		
		var FaultCode = e.FaultCode;
		var CwmpFaultString = e.CwmpFaultString;
		var FaultString = e.FaultString;
		var SetParameterValuesFault = e.SetParameterValuesFault;
		func_log("CWMP Error : "+CwmpFaultCode+":"+message+":"+FaultCode+":"+CwmpFaultString+":"+FaultString);
		if(SetParameterValuesFault != null)
		{
			for(var i = 0;i <SetParameterValuesFault.length;i++)
			{
				func_log("Detail Fault: ParameterName : "+SetParameterValuesFault[i].ParameterName);
				func_log("Detail Fault: FaultCode : "+SetParameterValuesFault[i].FaultCode);
				func_log("Detail Fault: FaultString : "+SetParameterValuesFault[i].FaultString);
			}
		}
	}	
}
/* Foxconn 20180117 jay add end*/

function CreateSql_AlarmHistoryDB(RecvdAlarm,cpeBTS,cpeLCR)
{
	var sql ="(`CellIdentity`,           "+
                     " `BTS`,                    "+
                     " `LCR`,                    "+
                     " `AdditionalInformation`,  "+
                     " `AdditionalText`,         "+
                     " `AlarmIdentifier`,        "+
                     " `EventTime`,              "+
                     " `EventType`,              "+
                     " `ManagedObjectInstance`,  "+
                     " `NotificationType`,       "+
                     " `PerceivedSeverity`,      "+
                     " `ProbableCause`,          "+
                     " `SpecificProblem`,          "+
                     " `Username`)VALUES('"+
                    RecvdAlarm.alarmCID+                    "', '"+
                    cpeBTS+                           "', '"+
                    cpeLCR+                           "', '"+
                    RecvdAlarm.alarmAdditionalInformation+  "', '"+
                    RecvdAlarm.alarmAdditionalText+         "', '"+
                    RecvdAlarm.alarmAlarmIdentifier+        "', '"+
                    RecvdAlarm.alarmEventTime+              "', '"+
                    RecvdAlarm.alarmEventType+              "', '"+
                    RecvdAlarm.alarmManagedObjectInstance+  "', '"+
                    RecvdAlarm.alarmNotificationType+       "', '"+
                    RecvdAlarm.alarmPerceivedSeverity+      "', '"+
                    RecvdAlarm.alarmProbableCause+          "', '"+
                    RecvdAlarm.alarmSpecificProblem+        "', '"+
                    cpedb.UserName +                        "');";
	return sql;	
}

function CreateSql_currAlarmDB(RecvdAlarm,cpeBTS,cpeLCR)
{
	var sql ="(`CellIdentity`,           "+
		" `BTS`,                    "+
		" `LCR`,                    "+
		" `AdditionalInformation`,  "+
		" `AdditionalText`,         "+
		" `AlarmIdentifier`,        "+
		" `EventTime`,              "+
		" `EventType`,              "+
		" `ManagedObjectInstance`,  "+
		" `NotificationType`,       "+
		" `PerceivedSeverity`,      "+
		" `ProbableCause`,          "+
		" `SpecificProblem`,        "+
		" `Status`,                 "+
		" `Username`,               "+                    
		" `CMT`) VALUES ('"+
		RecvdAlarm.alarmCID+                    "', '"+
		cpeBTS+                                 "', '"+
		cpeLCR+                                 "', '"+
		RecvdAlarm.alarmAdditionalInformation+  "', '"+
		RecvdAlarm.alarmAdditionalText+         "', '"+
		RecvdAlarm.alarmAlarmIdentifier+        "', '"+
		RecvdAlarm.alarmEventTime+              "', '"+
		RecvdAlarm.alarmEventType+              "', '"+
		RecvdAlarm.alarmManagedObjectInstance+  "', '"+
		RecvdAlarm.alarmNotificationType+       "', '"+
		RecvdAlarm.alarmPerceivedSeverity+      "', '"+
		RecvdAlarm.alarmProbableCause+          "', '"+
		RecvdAlarm.alarmSpecificProblem+        "', '";
		
		return sql;
}

function CreateSql_AlarmActionDB(RecvdAlarm,cpeBTS,cpeLCR)
{
	var sql = "INSERT INTO "+cpedb.AlarmActionDB+
		"( `CellIdentity`,           "+
		"`BTS`,                    "+
		"`LCR`,                    "+
		"`EventTime`,              "+
		"`AlarmIdentifier`,        "+
		"`NotificationType`,       "+
		"`PerceivedSeverity`,      "+
		"`ProbableCause`,          "+
		"`SpecificProblem`,        "+
		"`AdditionalInformation`,  "+
		"`updateTime`,             "+
		"`Status`,                 "+
		"`Ack`,                    "+
		"`CMT`,                    "+
		"`Log`,                    "+
		"`User`)  VALUES ('"+ 
		RecvdAlarm.alarmCID+                    "', '"+
		cpeBTS+                                 "', '"+
		cpeLCR+                                 "', '"+
		RecvdAlarm.alarmEventTime+              "', '"+
		RecvdAlarm.alarmAlarmIdentifier+        "', '"+
		RecvdAlarm.alarmNotificationType+       "', '"+
		RecvdAlarm.alarmPerceivedSeverity+      "', '"+
		RecvdAlarm.alarmProbableCause+          "', '"+
		RecvdAlarm.alarmSpecificProblem+        "', '"+
		RecvdAlarm.alarmAdditionalInformation+  "', '";
		
		return sql;
}
function cbsd(hclass)
{
	if(hclass == 'FAP_FC4064Q1CA')
	{
		return True;
	}
	else
	{
		return False;
	}
}