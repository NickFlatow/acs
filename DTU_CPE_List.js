cpe.log('////////////////' + SerialNumber + ' : ' + 'Run Script SiriusFly_fems_CPE_List \\\\\\\\\\\\\\\\');

var RootDev      = 'Device';    
var oui_ID       = cpe.Inform.DeviceId.OUI;
var hclass       = cpe.Inform.DeviceId.ProductClass;
var manufacturer = cpe.Inform.DeviceId.Manufacturer;
var SerialNumber = cpe.Inform.DeviceId.SerialNumber;

var AdminState           ='Unknown';    
var NoteInfo             ='N/A';
var MaxTxPower           ='Unknown';
var PhyCellIDInUse       ='Unknown';
var Utiliz               = 0;
var randomNum            = Math.floor( Math.random() * 1024 );

/*
function clearAlarm(RecvdAlarm, dateTimeAlarm)
{
	try 
	{
		//cpe.log(SerialNumber+':'+'alarm alarmId=>'+RecvdAlarm.alarmId+',SpecificProblem => '+RecvdAlarm.alarmSpecificProblem+',alarmEventTime => '+RecvdAlarm.alarmEventTime+',alarmAdditionalInformation => '+RecvdAlarm.alarmAdditionalInformation+',alarmAdditionalText => '+RecvdAlarm.alarmAdditionalText+',RecvdAlarm.alarmAlarmIdentifier => '+RecvdAlarm.alarmAlarmIdentifier);

		// String for operation with history alarm table 
		var sql_history = CreateSql_AlarmHistoryDB(RecvdAlarm, cpedb.cpeBTS, cpedb.cpeLCR);

		// String for operation with alarm action table     
		var alarmActionStr = CreateSql_AlarmActionDB(RecvdAlarm, cpedb.cpeBTS, cpedb.cpeLCR);
		
		var AddLog="";

		// Add into alarm history event table
		var sql_query="INSERT INTO `"+cpedb.AlarmHistoryDB+"` "+ sql_history;
		cpe.log(SerialNumber+':'+'SQL command ='+sql_query);
		var rs = db.Update (sql_query);
		
                //Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. 
		//Check alarm already exist or not
		//sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
		//"' AND `CellIdentity` = '"+RecvdAlarm.alarmCID+"';";
		sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
		"' AND `AlarmIdentifier` = '"+RecvdAlarm.alarmAlarmIdentifier+"';";
                //Foxconn_E-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. 
		//cpe.log(SerialNumber+':'+'SQL command ='+sql_query);
		var rs = db.Query(sql_query);     
		//cpe.log(SerialNumber+':'+'Rows found in '+cpedb.currAlarmDB+' DB is = '+rs.length);
		var alarmExist=0; 
		
		if(rs.length>0)
		{   
			alarmExist=1; 
			var AckDb=0;
			if(rs[0].Ack=="1")
				AckDb=1;
			else
				AckDb=0;
		}

		if(RecvdAlarm.alarmNotificationType=="ClearedAlarm")
		{
			if(alarmExist==1)
			{
				// jjj
				 var alarm_user = "Device";
				// if(RecvdAlarm.alarmProbableCause == "8102")
				// {
				// 	alarm_user = "FeMS";					
				// }
				AddLog="<MSG><Time>"+dateTimeAlarm+"</Time><CONT>Clear Alarm</CONT><user>"+alarm_user+"</user></MSG>"+rs[0].CMT;
				Insert_into_alarm_action_table(RecvdAlarm.alarmAlarmIdentifier, alarmActionStr, dateTimeAlarm, "Clear Alarm", AckDb, "Clear Alarm", AddLog, alarm_user);
			}

                        //Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. 
			//sql_query="Delete from `"+cpedb.currAlarmDB+"`  WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
			//"' AND `CellIdentity` = '"+RecvdAlarm.alarmCID+"';";
			sql_query="Delete from `"+cpedb.currAlarmDB+"`  WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
			"' AND `AlarmIdentifier` = '"+RecvdAlarm.alarmAlarmIdentifier+"';";
                        //Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. 
			cpe.log(SerialNumber+':'+'SQL command ='+sql_query);
			db.Update (sql_query);
		}            

	} catch (e) {
		func_log('DS exception: '+e.message);
	}
}
*/
//20180726, fox, Darren, remove redundant parameters(CellIdentity/AdminState/MaxPowerInUse).
/*
try
{
	if(cpedb.cpeCid =='Unknown' || MaxTxPower=='Unknown' )    
	{
		var getParameters_CPEList = new Array ();
		getParameters_CPEList[0] =RootDev+'.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity';
		getParameters_CPEList[1] =RootDev+'.Services.FAPService.1.FAPControl.LTE.AdminState';
		getParameters_CPEList[2] =RootDev+'.X_FOXCONN_FAP.CellConfig.MaxPowerInUse'; 

		//cpe.log(SerialNumber+':'+'Send GetParameterValues');
		var response = cpe.GetParameterValues (getParameters_CPEList); 

		//print parameter values                                                             
		//cpe.log(SerialNumber+':'+'Got '+response.length+' Parameter Values response');
		for (i=0;i < response.length; i++)                                                   
		{
			// func_logSave('  '+response[i].name+'='+response[i].value);     
			//cpe.log(SerialNumber+':'+'  '+response[i].name+'='+response[i].value);                 
			if(response[i].name==RootDev+'.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity')
			{
				cpedb.cpeCid=response[i].value;		  
			}
			if(response[i].name==RootDev+'.Services.FAPService.1.FAPControl.LTE.AdminState')
			{
				AdminState=response[i].value;			
			}
			if(response[i].name==RootDev+'.X_FOXCONN_FAP.CellConfig.MaxPowerInUse')
			{
				MaxTxPower=response[i].value;			
			}
			if(response[i].name==RootDev+'.X_FOXCONN_FAP.CellConfig.PhyCellIDInUse ')
			{
				PhyCellIDInUse=response[i].value;			
			}
		}
	}    
}catch (e) {
	catchMessage(e);
}
*/
NoteInfo=pKey;

var sql_query  ="";
var sql_update ="";

//20180726, fox, Darren, remove autoupload parameter.
//try 
//{
//	var paramSet_CPEList = new Array ();
//	paramSet_CPEList[0]={name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.AutoUpload', value:true, type:'xsd:boolean'};
//
//	if(cpedb.cpeStatus=="Inactive" && AdminState==0)
//	cpedb.cpeStatus="Force Inactive";
//	/* Foxconn 20171109 jay add */
//	else if(cpedb.cpeStatus=="Unsubscribed")
//	//else if(cpedb.cpeStatus=="Unsubscribed" || (cpedb.cpeStatus=="MD_DefGwMac") || (cpedb.cpeStatus=="MD_InterRATCell") || (cpedb.pKey == 'Move_Detected'))/* Foxconn 20180117 jay add for movement detection */
//	{		
//		paramSet_CPEList[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:300, type:'xsd:unsignedInt'}; 
//		//cpe.log(SerialNumber+':'+'Send SetParameterValues: Device.ManagementServer.PeriodicInformInterval: 300');
//
//		if(AdminState==1)
//		{
//			paramSet_CPEList[2]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'}; 
//			cpe.log(SerialNumber+':'+' Set Device.Services.FAPService.1.FAPControl.LTE.AdminState: AdminState');
//		}
//	/* Foxconn 20171109 jay add end*/
//	}
//	//cpe.log(SerialNumber+':'+'Send SetParameterValues');
//	cpe.SetParameterValues (paramSet_CPEList, cpedb.pKey );

//}catch (e) 
//{
//	catchMessage(e);
//}

//2018/09/26, Darren, add for signal quality reading.
try 
{
	//SerialNumber=cpe.Inform.DeviceId.SerialNumber;   
	//sql_query="SELECT * FROM `"+cpedb.CpeListDB_SiriusFly+"` WHERE `SN` = '"+SerialNumber+"';";
	//var rs = db.Query(sql_query);     
	//cpe.log(SerialNumber+':'+'Rows found in '+cpedb.CpeListDB_SiriusFly+' DB is = '+rs.length);        

        /*Foxconn_S-20180323-Wilson modify: cpe list DB already queried in fems_Default.js. */
	// Clear
	//if(rs.length==1 && rs[0].Status=="Missing")
	/*
	if( (cpedb.cpeEntryCount==1) && (cpedb.cpeListStatus =="Missing"))
	{
		var RecvdAlarm={
		alarmCID:cpedb.cpeCid, 
		alarmAdditionalInformation:"Device Missing",
		alarmAdditionalText:"",
		alarmAlarmIdentifier:oui_ID+SerialNumber,
		alarmEventTime:dateTime,
		alarmEventType:"Communications",
		alarmManagedObjectInstance:"CWMP",
		alarmNotificationType:"ClearedAlarm",
		alarmPerceivedSeverity:"CRITICAL",
		alarmProbableCause:"8004",
		alarmSpecificProblem:"Device Missing"};

		clearAlarm(RecvdAlarm, dateTime);
	}
	*/
	var sql_str=  "`area`,"+
	"`SN`,"+
	"`BTS`,"+
	"`LCR`,"+
	//"`CellIdentity`,"+
	"`DeviceType`,"+
	"`Service`,"+
	"`IPAddress`,"+
	//"`AdminState`,"+
	//"`RFTxStatus`,"+
	//"`OpState`,"+
	"`Utiliz`,"+
	//"`PhyCellIDInUse`,"+
	"`SoftwareVersion`,"+
	"`ConnectionRequestURL`,"+
	"`ParameterKey`,"+
	"`Status`,"+
	"`Alarm`,"+
	//"`MaxTxPowerInUse`,"+
	"`Note`,"+ 
	//"`CBC`,"+
	"`RSRP`,"+
	"`RSSI`,"+
	"`RSRQ`,"+
	"`SINR`,"+
	"`SysUpTime`,"+
	"`Username`";

//2018/09/26, Darren, add for signal quality reading.
	//Wilson_S: Workaround if GetParameterValues failed
	if('Unknown' == AdminState)
		AdminState = cpedb.AdminState;
	if('Unknown' == MaxTxPower)
		MaxTxPower = cpedb.MaxTxPower;
	//Wilson_E: Workaround if GetParameterValues failed

	sql_str +=  ") VALUES ('"+                      
	cpedb.area+                 "', '"+
	SerialNumber+               "', '"+
	cpedb.cpeBTS+               "', '"+
	cpedb.cpeLCR+               "', '"+
	//cpedb.cpeCid+               "', '"+
	cpedb.DeviceType+           "', '"+
	cpedb.ServiceName+          "', '"+
	cpedb.IPAddress+            "', '"+
	//AdminState+                 "', '"+
	//1+           "', '"+
	//cpedb.OpState+              "', '"+
	Utiliz+                     "', '"+
	//PhyCellIDInUse+             "', '"+
	cpedb.SoftwareVersion+      "', '"+
	cpedb.ConnectionRequestURL+ "', '"+
	cpedb.pKey+                 "', '"+
	cpedb.cpeStatus+            "', '"+
	cpedb.CurrentAlarmNum+      "', '"+
	//MaxTxPower+                 "', '"+
	NoteInfo+                   "', '"+
	//cpedb.CBC+                  "', '"+
	cpedb.RSRP+                 "', '"+
	cpedb.RSSI+                 "', '"+
	cpedb.RSRQ+                 "', '"+
	cpedb.SINR+                 "', '"+
	cpedb.SysUpTime+            "', '"+
	cpedb.UserName+               "'";
	sql_str +=  ");";


	//20180926, Darren, set for signal quality all 0's situation.
	var sqlUpdateAlternative = "`area` = " + "'" + cpedb.area + "'" + "," +
		"`SN` = "  + "'" + SerialNumber + "'" + "," +
		"`BTS` = " + "'" + cpedb.cpeBTS + "'" + "," +
		"`LCR` = " + "'" + cpedb.cpeLCR + "'" + "," +
		//"`CellIdentity` = " + "'" + cpedb.cpeCid + "'" + "," +
		"`DeviceType` = "   + "'" + cpedb.DeviceType + "'" + "," + 
		"`Service` = "      + "'" + cpedb.ServiceName + "'" + "," +
		"`IPAddress` = "    + "'" + cpedb.IPAddress + "'" + "," +
		//"`AdminState` = "   + "'" + AdminState + "'" + "," +
		//"`RFTxStatus` = "   + "'" + 1 + "'" + "," +
		//"`OpState` = "      + "'" + cpedb.OpState + "'" + "," +
		"`Utiliz` = "       + "'" +  randomNum + "'" + "," +
		//"`PhyCellIDInUse` = "  + "'" + PhyCellIDInUse + "'" + "," +
		"`SoftwareVersion` = " + "'" + cpedb.SoftwareVersion + "'" + "," +
		"`ConnectionRequestURL` = " + "'" + cpedb.ConnectionRequestURL + "'" + "," +
		"`ParameterKey` = " + "'" + cpedb.pKey + "'" + "," +
		"`Status` = " + "'" + cpedb.cpeStatus + "'" + "," +
		"`Alarm` = " + "'" + cpedb.CurrentAlarmNum + "'" + "," +
		//"`MaxTxPowerInUse` = " + "'" + MaxTxPower + "'" + "," +
		"`Note` = " + "'" + NoteInfo + "'" + "," + 
		//"`CBC` = " + "'" + cpedb.CBC + "'" + "," + 
		"`SysUpTime` = " + "'" + cpedb.SysUpTime + "'" + " WHERE SN = " + "'" + SerialNumber + "'" + ";";

	
	/* Foxconn 20180117 jay add end */

	//if(rs.length==1)
	if(cpedb.cpeEntryCount==1)
	{
		
		if( cpedb.RSRP == 0 && cpedb.RSSI == 0 && cpedb.RSRQ == 0 && cpedb.SINR == 0 )
		{
			sql_update = "UPDATE `" + cpedb.CpeListDB_SiriusFly + "` SET " + sqlUpdateAlternative;
			cpe.log( SerialNumber + ':' + 'SQL cmd is = ' + sql_update + 'Design for signal quality all 0 situation');
			db.Update (sql_update);
		}
		else
		{
			sql_update="REPLACE INTO `"+cpedb.CpeListDB_SiriusFly+"`("+sql_str;
			cpe.log(SerialNumber+':'+'SQL cmd is = '+ sql_update);
			db.Update (sql_update);
		}	
		//cpe.log(SerialNumber+':'+'update '+SerialNumber+' to '+cpedb.CpeListDB_SiriusFly+' DB done');
	}
	else
	{
		sql_update= "INSERT INTO `"+cpedb.CpeListDB_SiriusFly+"`("+sql_str;
		cpe.log(SerialNumber+':'+'SQL cmd is = '+ sql_update);
		db.Update (sql_update);
		//cpe.log(SerialNumber+':'+'Add new device '+SerialNumber+' to '+cpedb.CpeListDB_SiriusFly+' DB done');
	}
} catch (e) {
	func_log('DS exception: '+e.message);
}

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script SiriusFly_fems_CPE_List end \\\\\\\\\\\\\\\\');