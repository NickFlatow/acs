cpe.log('////////////////' + SerialNumber + ' : ' + 'Run Script fems_CPE_List \\\\\\\\\\\\\\\\');

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
var test = new Array();

// jjj
// /*Foxconn_S-20180323-Wilson add */
// function formFinalNeighborList(inform_InterRATCell, db_InterRATCell)
// {
// 	var max_store_cells = 25;
// 	var db_cell_counts = 0;	
	
// 	//cpe.log("formFinalNeighborList: inform: " + inform_InterRATCell + "| DB: " + db_InterRATCell);
// 	//if no valid cell reported, use DB's cell list
// 	if(inform_InterRATCell.length == 0)
// 		return db_InterRATCell;
	
// 	var db_cell_lists = db_InterRATCell.split(";");
// 	if(db_cell_lists.length == 1)
// 	{
// 		var cellFields = db_cell_lists[0].split(",");
// 		if(cellFields.length > 1)
// 			db_cell_counts = 1;
// 	}else
// 	{
// 		db_cell_counts = db_cell_lists.length;
// 	}
// 	var db_cell_space = max_store_cells - db_cell_counts;
// 	if(db_cell_space <= 0)
// 		return db_InterRATCell;
// 	var candidate_cells='', i, j;
	
// 	var inform_cells = inform_InterRATCell.split(";");
	
// 	for(i=0; i<inform_cells.length; i++)
// 	{
// 		if( 1 == inform_cells[i].split(","))
// 			continue;
//     	for(j=0; j<db_cell_lists.length; j++)
//         {
// 			if( 1 == db_cell_lists[j].split(","))
// 				continue;
//         	if(db_cell_lists[j] == inform_cells[i])
//             {
// 				break;
//             }
//         }
// 		if(j == db_cell_lists.length)
// 		{
// 			if(candidate_cells != '')
// 				candidate_cells += ';';
// 			candidate_cells = candidate_cells + inform_cells[i];
// 			if(--db_cell_space <= 0)
// 				break;
// 		}
// 	}
// 	cpe.log("formFinalNeighborList: inform_cells ["+inform_InterRATCell+"] DB_cells["+db_InterRATCell+ "], curr_db_cell_counts = "+db_cell_counts+", candidate_cells = [" + candidate_cells+ "], db_cell_space = " + db_cell_space);
// 	if((db_cell_counts > 0) && (candidate_cells != ''))
// 		return db_InterRATCell+";"+candidate_cells;
// 	else if(db_cell_counts > 0)
// 		return db_InterRATCell;
// 	else
// 		return candidate_cells;
// }
// /*Foxconn_E-20180323-Wilson modify */

// jjj
// /* Foxconn 20180117 jay add for movement detection */
// function MD_alarm()
// {
// 	//cpe.log(SerialNumber+': ----> fems_CPE_List cpedb.pKey = '+cpedb.pKey+', cpeStatus = '+cpedb.cpeStatus+', cpedb.DeviceType = '+cpedb.DeviceType+'<----');
// 	//if((cpedb.cpeStatus == 'MD_DefGwMac')|| (cpedb.cpeStatus == 'MD_InterRATCell')
// 	if(	(cpedb.pKey == 'Move_Detected') || (cpedb.MD_GMA == 1) || (cpedb.MD_NCL == 1) )
// 	{
// 		//Check alarm already exist or not
// 		//var sql_query="SELECT * FROM `"+cpedb.AlarmDeviceCfgDB+"` WHERE `ProbableCause` = '8101' AND `SpecificProblemID` = '810101' AND `DevType` = '"+cpedb.DeviceType+"' ;";
// 		var sql_query;
// 		var i;
// 		var md_array = [[cpedb.pKey == 'Move_Detected',"8101","810101", "Femto Movement Detected"], [(cpedb.MD_GMA == 1) && (cpedb.DefGwMac != "f0:00:00:00:00:00"),"8102", "810201", "Movement Detection: Default Gateway is changed."], [cpedb.MD_NCL == 1,"8103", "810301", "Movement Detection: Neighbor List is totally different."]];
// 		for(i=0; i<md_array.length; i++)
// 		{
// 			if(md_array[i][0] == false)
// 				continue;
// 			sql_query="SELECT * FROM `"+cpedb.AlarmDeviceCfgDB+"` WHERE `ProbableCause` = '"+md_array[i][1]+"' AND `SpecificProblemID` = '"+md_array[i][2]+"' AND `DevType` = '"+cpedb.DeviceType+"' ;";
// 			var alarmCfg = db.Query (sql_query);   

// 			//cpe.log(SerialNumber+': Rows found in cpedb.AlarmDeviceCfgDB(8101) DB is = '+alarmCfg.length);
// 			if(alarmCfg.length==0)
// 				cpe.log(SerialNumber+': There is no cpedb.AlarmDeviceCfgDB '+md_array[i][1]+' defined in DB.');
// 			else if((alarmCfg.length==1) && (alarmCfg[0].Enable!='Enable'))
// 				cpe.log(SerialNumber+': Alarm config cpedb.AlarmDeviceCfgDB '+md_array[i][1]+' is NOT enabled');
			
// 			if(alarmCfg.length==1 && alarmCfg[0].Enable=='Enable')
// 			{
// 				try 
// 				{
// 					/*
// 					var sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `AlarmIdentifier` = '"+oui_ID+SerialNumber+
// 					"' AND `CellIdentity` = '"+cpedb.cpeCid+"' AND `ProbableCause` = '8101';";
// 					*/
// 					var sql_query;
					
// 					sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `AlarmIdentifier` = '"+oui_ID+SerialNumber+"' AND `CellIdentity` = '"+cpedb.cpeCid+"' AND `ProbableCause` = '"+md_array[i][1]+"';";
					
// 					//cpe.log(SerialNumber+': sql_query = '+ sql_query); 
// 					var rs = db.Query(sql_query);
// 					//cpe.log(SerialNumber+':'+'Rows found in '+cpedb.currAlarmDB+' DB is = '+rs.length);
					
// 					var AddLog="<MSG><Time>"+dateTime+"</Time>";//<CONT>New Alarm</CONT><user>FeMS</user></MSG>";
// 					var strStatus = "New";
// 					var alramType = "New Alarm";			

// 					if(rs.length == 0)
// 					{
// 						var sql_additional_text = '';
// 						AddLog=AddLog+"<CONT>"+alramType+"</CONT><user>FeMS</user></MSG>";
// 						var sql_common_info="(`CellIdentity`,"+
// 						"`BTS`,"+
// 						"`LCR`,"+
// 						"`AdditionalInformation`,"+
// 						" `AlarmIdentifier`, "+
// 						" `EventTime`,"+
// 						" `NotificationType`,"+
// 						" `PerceivedSeverity`,"+
// 						" `ProbableCause`,"+
// 						" `SpecificProblem`";

// 						var sql_common_info2 = cpedb.cpeCid   +
// 						"','"+
// 						cpedb.cpeBTS                 +
// 						"', '"+
// 						cpedb.cpeLCR                  +
// 						"',";
// 						sql_common_info2=sql_common_info2+"'"+md_array[i][3]+"','";
// 						if(md_array[i][1] == "8101")
// 							sql_additional_text = 'Both Default Gateway and NeighborList are changed.';
// 						else if(md_array[i][1] == "8102")
// 						{
// 							sql_additional_text = 'Default Gateway changed from '+cpedb.DB_DefGwMac+ ' to ' +cpedb.DefGwMac+'.';
// 						}
// 						else if(md_array[i][1] == "8103")
// 						{
// 							sql_additional_text = 'Neighbor List changed from ['+cpedb.DB_InterRATCell+ '] to [' +cpedb.InterRATCell+'].';
// 							if(sql_additional_text.length > 256)
// 								sql_additional_text = sql_additional_text.slice(0, 256);
// 						}
// 						sql_common_info2=sql_common_info2+					
// 						oui_ID+SerialNumber           +
// 						"', '"+
// 						dateTime                      +
// 						"',"+
// 						" '"+strStatus+"Alarm"+"',"+
// 						" '"+alarmCfg[0].Severity+"',"+
// 						" '"+md_array[i][1]+"','"+alarmCfg[0].SpecificProblem+"'";

// 						//cpe.log(SerialNumber+': sql_common_info2 is = '+ sql_common_info2);

// 						var sql_move_info=sql_common_info+
// 						",`AdditionalText`,`EventType`,`ManagedObjectInstance`,`Status`,`CMT`) VALUES ('"+
// 						sql_common_info2+",'"+sql_additional_text+"','Communications', 'CWMP'";

// 						var sql_history_info = sql_common_info+",`AdditionalText`,`EventType`,`ManagedObjectInstance`)VALUES('"+sql_common_info2+",'"+sql_additional_text+"','Communications', 'CWMP');";

// 						var sql_action_info = sql_common_info+",`updateTime`,`Status`,`Ack`,`CMT`,`Log`,`User`)  VALUES ('"+sql_common_info2+", '"+dateTime+"','"+strStatus+"','0', '"+alramType+"', '"+AddLog+"', 'FeMS');";

// 						var sql_dm="INSERT INTO `"+cpedb.currAlarmDB+"` "+sql_move_info+",'"+strStatus+"','"+AddLog+"');";
// 						cpe.log(SerialNumber+': currAlarmDB: SQL cmd is = '+ sql_dm);
// 						db.Update (sql_dm);

// 						sql_dm="INSERT INTO `"+cpedb.AlarmHistoryDB+"` "+ sql_history_info;
// 						db.Update (sql_dm);
// 						//cpe.log("AlarmHistoryDB: SQL command ="+sql_dm);

// 						sql_dm="INSERT INTO `"+cpedb.AlarmActionDB+"` "+ sql_action_info;
// 						//cpe.log(SerialNumber+': AlarmActionDB:SQL command ='+sql_dm);
// 						db.Update (sql_dm);
// 						if(md_array[i][1] == "8101")
// 							func_logSave('Log alarm', 'Success', 'Movement Detection - GW and NCL', '', 'Script fems_CPE_List');
// 						else if(md_array[i][1] == "8102")
// 							func_logSave('Log alarm', 'Success', 'Movement Detection - GW', '', 'Script fems_CPE_List');
// 						else if(md_array[i][1] == "8103")
// 							func_logSave('Log alarm', 'Success', 'Movement Detection - NeighborList', '', 'Script fems_CPE_List');
// 					}			
// 				}
// 				catch (e) {
// 					cpe.log("DS exception: "+e.message);
// 				}
// 			}
// 		}
// 	}
// }
// /* Foxconn 20180117 jay add end */

function clearAlarm(RecvdAlarm, dateTimeAlarm)
{
	try 
	{
		//cpe.log(SerialNumber+':'+'alarm alarmId=>'+RecvdAlarm.alarmId+',SpecificProblem => '+RecvdAlarm.alarmSpecificProblem+',alarmEventTime => '+RecvdAlarm.alarmEventTime+',alarmAdditionalInformation => '+RecvdAlarm.alarmAdditionalInformation+',alarmAdditionalText => '+RecvdAlarm.alarmAdditionalText+',RecvdAlarm.alarmAlarmIdentifier => '+RecvdAlarm.alarmAlarmIdentifier);

		// String for operation with history alarm table 
		var sql_history = CreateSql_AlarmHistoryDB(RecvdAlarm, cpedb.cpeBTS, cpedb.cpeLCR);

		// String for operation with alarm action table     
		//var alarmActionStr = CreateSql_AlarmActionDB(RecvdAlarm, cpedb.cpeBTS, cpedb.cpeLCR);
		
		var AddLog="";

		// Add into alarm history event table
		var sql_query="INSERT INTO `"+cpedb.AlarmHistoryDB+"` "+ sql_history;
		cpe.log(SerialNumber+':'+'SQL command ='+sql_query);
		var rs = db.Update (sql_query);
		
        /*Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. */
		//Check alarm already exist or not
		//sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
		//"' AND `CellIdentity` = '"+RecvdAlarm.alarmCID+"';";
		sql_query="SELECT * FROM `"+cpedb.currAlarmDB+"` WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
		"' AND `AlarmIdentifier` = '"+RecvdAlarm.alarmAlarmIdentifier+"';";
                /*Foxconn_E-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. */
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
				//Insert_into_alarm_action_table(RecvdAlarm.alarmAlarmIdentifier, alarmActionStr, dateTimeAlarm, "Clear Alarm", AckDb, "Clear Alarm", AddLog, alarm_user);
			}

            /*Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. */
			//sql_query="Delete from `"+cpedb.currAlarmDB+"`  WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
			//"' AND `CellIdentity` = '"+RecvdAlarm.alarmCID+"';";

			sql_query="Delete from `"+cpedb.currAlarmDB+"`  WHERE `ProbableCause` = '"+RecvdAlarm.alarmProbableCause+
			"' AND `AlarmIdentifier` = '"+RecvdAlarm.alarmAlarmIdentifier+"';";
			
			/*Foxconn_S-20180323-Wilson modify: change from CellIdentity to AlarmIdentifier. */
			cpe.log(SerialNumber+':'+'SQL command ='+sql_query);
			db.Update (sql_query);
		}            

	} catch (e) {
		func_log('DS exception: '+e.message);
	}
}
//20181002, Darren, remove this section.
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

//20181002, Darren, remove this section.
/*
try 
{
	var paramSet_CPEList = new Array ();
	paramSet_CPEList[0]={name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.AutoUpload', value:true, type:'xsd:boolean'};

	if(cpedb.cpeStatus=="Inactive" && AdminState==0)
	cpedb.cpeStatus="Force Inactive";
	//Foxconn 20171109 jay add 
	else if(cpedb.cpeStatus=="Unsubscribed")
	//else if(cpedb.cpeStatus=="Unsubscribed" || (cpedb.cpeStatus=="MD_DefGwMac") || (cpedb.cpeStatus=="MD_InterRATCell") || (cpedb.pKey == 'Move_Detected'))//Foxconn 20180117 jay add for movement detection
	{		
		paramSet_CPEList[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:300, type:'xsd:unsignedInt'}; 
		//cpe.log(SerialNumber+':'+'Send SetParameterValues: Device.ManagementServer.PeriodicInformInterval: 300');

		if(AdminState==1)
		{
			paramSet_CPEList[2]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'}; 
			cpe.log(SerialNumber+':'+' Set Device.Services.FAPService.1.FAPControl.LTE.AdminState: AdminState');
		}
	//Foxconn 20171109 jay add end
	}
	//cpe.log(SerialNumber+':'+'Send SetParameterValues');
	cpe.SetParameterValues (paramSet_CPEList, cpedb.pKey );

}catch (e) 
{
	catchMessage(e);
}
*/

try 
{
	//SerialNumber=cpe.Inform.DeviceId.SerialNumber;   
	//sql_query="SELECT * FROM `"+cpedb.CpeListDB+"` WHERE `SN` = '"+SerialNumber+"';";
	//var rs = db.Query(sql_query);     
	//cpe.log(SerialNumber+':'+'Rows found in '+cpedb.CpeListDB+' DB is = '+rs.length);        

        /*Foxconn_S-20180323-Wilson modify: cpe list DB already queried in fems_Default.js. */
	// Clear
	//if(rs.length==1 && rs[0].Status=="Missing")
	//20181011, Darren, remove alarm setting for HeNB.
	
	if( (cpedb.cpeEntryCount==1) && (cpedb.cpeListStatus =="Missing"))
	{
		var RecvdAlarm={
		alarmCID:cpedb.cpeCid, 
		alarmAdditionalInformation:"Device Missing",
		alarmAdditionalText:"No inform received over 5 minutes",
		alarmAlarmIdentifier:SerialNumber,
		alarmEventTime:dateTime,
		alarmEventType:"Communications",
		alarmManagedObjectInstance:"CWMP",
		alarmNotificationType:"ClearedAlarm",
		alarmPerceivedSeverity:"CRITICAL",
		alarmProbableCause:"8004",
		alarmSpecificProblem:"Device Missing"};

		clearAlarm(RecvdAlarm, dateTime);
	}
	
	//jjj
	// if( 1 == cpedb.forceClearMDGMA)
	// {
	// 	var RecvdAlarm={
	// 	alarmCID:cpedb.cpeCid, 
	// 	alarmAdditionalInformation:"Movement Detection: Default Gateway is changed.",
	// 	alarmAdditionalText:"MD_GMA is set over 24 hours but MD_NCL is not set, clear MD_GMA alarm.",
	// 	alarmAlarmIdentifier:oui_ID+SerialNumber,
	// 	alarmEventTime:dateTime,
	// 	alarmEventType:"Communications",
	// 	alarmManagedObjectInstance:"CWMP",
	// 	alarmNotificationType:"ClearedAlarm",
	// 	alarmPerceivedSeverity:"CRITICAL",
	// 	alarmProbableCause:"8102",
	// 	alarmSpecificProblem:"Femto GW MAC is changed"};

	// 	clearAlarm(RecvdAlarm, dateTime);
	// }
	// jjj
 //        /*Foxconn_E-20180323-Wilson modify: cpe list DB already queried in fems_Default.js. */
	// /* Foxconn 20180117 jay add for movement detection */
	// MD_alarm();	
	// //if(rs.length==1)
	// if(cpedb.cpeEntryCount==1)
	// {
	// 	if((cpedb.DefGwMac == 'undefined') || (cpedb.cpeStatus == 'MD_DefGwMac') || (cpedb.MD_GMA == 1))
	// 	{
	// 		cpedb.DefGwMac=cpedb.DB_DefGwMac;				
	// 	}

	// 	if((cpedb.InterRATCell == 'undefined') || (cpedb.cpeStatus == 'MD_InterRATCell') || (cpedb.MD_NCL == 1))
	// 	{				
	// 		cpedb.InterRATCell=cpedb.DB_InterRATCell;				
	// 	}
	// 	else if(cpedb.DefGwMac != 'undefined_null')
	// 	{
	// 		cpedb.InterRATCell=formFinalNeighborList(cpedb.InterRATCell, cpedb.DB_InterRATCell);
	// 		var db_node = cpedb.InterRATCell.split(";");
	// 		if( (db_node.length < 3) && (cpedb.CollectCounts < collectCountThresh))
	// 		{
	// 			cpe.log("Collect counts "+cpedb.CollectCounts+" of InterRATCell = ["+cpedb.InterRATCell+"] less than "+collectCountThresh+", wait for more data.");
	// 			cpedb.CollectCounts++;
	// 		}
	// 	}
	// 	//Assume device is already MD(inform.pkey is Move_Detected), we want to keep MD reason (MD_DefGwMac or MD_InterRATCell) in database.
	// 	//if((cpedb.cpeStatus == 'undefined') && (cpedb.pKey == 'Move_Detected'))
	// 	//{
	// 	//	cpedb.cpeStatus = cpedb.cpeListStatus;			
	// 	//}
	// }
	// else
	// {
	// 	if(cpedb.DefGwMac == 'undefined')
	// 		cpedb.DefGwMac='none';			

	// 	if(cpedb.InterRATCell == 'undefined')				
	// 		cpedb.InterRATCell='none';
	// 	else
	// 	{
	// 		cpedb.InterRATCell=formFinalNeighborList(cpedb.InterRATCell, cpedb.DB_InterRATCell);
	// 		var db_node = cpedb.InterRATCell.split(";");
	// 		if( (db_node.length < 3) && (cpedb.CollectCounts < collectCountThresh))
	// 		{
	// 			cpe.log("Collect counts "+cpedb.CollectCounts+" of InterRATCell = ["+cpedb.InterRATCell+"] less than "+collectCountThresh+", wait for more data.");
	// 			cpedb.CollectCounts++;
	// 		}
	// 	}

	// 	if(cpedb.cpeStatus == "undefined" && cpedb.pKey == 'Move_Detected')
	// 		cpedb.cpeStatus = 'Move_Detected';		
	// }
	// //cpe.log("InterRATCell = ["+cpedb.InterRATCell+"]");

/* Foxconn 20180117 jay add end */

/* Foxconn 20180117 jay add for movement detection
	var sql_str=  "`area`,"+
	"`SN`,"+
	"`BTS`,"+
	"`LCR`,"+
	"`CellIdentity`,"+
	"`DeviceType`,"+
	"`Service`,"+
	"`IPAddress`,"+
	"`AdminState`,"+
	"`RFTxStatus`,"+
	"`OpState`,"+
	"`Utiliz`,"+
	"`PhyCellIDInUse`,"+
	"`SoftwareVersion`,"+
	"`ConnectionRequestURL`,"+
	"`ParameterKey`,"+
	"`Status`,"+
	"`Alarm`,"+
	"`MaxTxPowerInUse`,"+
	"`Note`,"+ 
	"`CBC`"+
	") VALUES ('"+                      
	cpedb.area+                 "', '"+
	SerialNumber+               "', '"+
	cpedb.cpeBTS+               "', '"+
	cpedb.cpeLCR+               "', '"+
	cpedb.cpeCid+               "', '"+
	cpedb.DeviceType+           "', '"+
	cpedb.ServiceName+          "', '"+
	cpedb.IPAddress+            "', '"+
	AdminState+                 "', '"+
	cpedb.RFTxStatus+           "', '"+
	cpedb.OpState+              "', '"+
	Utiliz+                     "', '"+
	PhyCellIDInUse+             "', '"+
	cpedb.SoftwareVersion+      "', '"+
	cpedb.ConnectionRequestURL+ "', '"+
	cpedb.pKey+                 "', '"+
	cpedb.cpeStatus+            "', '"+
	cpedb.CurrentAlarmNum+      "', '"+
	MaxTxPower+                 "', '"+
	NoteInfo+                   "', '"+
	cpedb.CBC+                  "');";
*/
	var sql_str=  "`area`,"+
	"`SN`,"+
	"`BTS`,"+
	"`LCR`,"+
	"`CellIdentity`,"+
	"`DeviceType`,"+
	"`Service`,"+
	"`IPAddress`,"+
	"`AdminState`,"+
	"`RFTxStatus`,"+
	"`OpState`,"+
	"`Utiliz`,"+
	"`PhyCellIDInUse`,"+
	"`SoftwareVersion`,"+
	"`ConnectionRequestURL`,"+
	"`ParameterKey`,"+
	"`Status`,"+
	"`Alarm`,"+
	"`MaxTxPowerInUse`,"+
	"`Note`,"+ 
	"`CBC`,"+ 
	"`PCIinUSE`,"+
	"`EARFCNinUSE`,"+
	"`Username`";
	///jjj
	// if(cpedb.DefGwMac != 'undefined_null')
	// {
	// 	sql_str += ", `DefGwMac`";
	// 	sql_str += ", `InterRATCell`";
	// 	sql_str += ", `MD_GMA`";
	// 	sql_str += ", `MD_NCL`";
	// 	sql_str += ", `CollectCounts`";
	// 	//if(cpedb.MD_GMA_TriggerTime != "undefined")
	// 	sql_str += ", `MD_GMA_TriggerTime`";
	// }
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
	cpedb.cpeCid+               "', '"+
	cpedb.DeviceType+           "', '"+
	cpedb.ServiceName+          "', '"+
	cpedb.IPAddress+            "', '"+
	AdminState+                 "', '"+
	cpedb.RFTxStatus+           "', '"+
	cpedb.OpState+              "', '"+
	Utiliz+                     "', '"+
	PhyCellIDInUse+             "', '"+
	cpedb.SoftwareVersion+      "', '"+
	cpedb.ConnectionRequestURL+ "', '"+
	cpedb.pKey+                 "', '"+
	cpedb.cpeStatus+            "', '"+
	cpedb.CurrentAlarmNum+      "', '"+
	MaxTxPower+                 "', '"+
	NoteInfo+                   "', '"+
	cpedb.CBC+                  "', '"+
	cpedb.PCIinUSE+             "', '"+
	cpedb.EARFCNinUSE+          "', '"+
	cpedb.UserName+             "'";
	// jjj
	// if(cpedb.DefGwMac != 'undefined_null')
	// {			
	// 	sql_str += ", '"+cpedb.DefGwMac+"'";
	// 	sql_str += ", '"+cpedb.InterRATCell+"'";
	// 	sql_str += ", '"+cpedb.MD_GMA+"'";
	// 	sql_str += ", '"+cpedb.MD_NCL+"'";
	// 	sql_str += ", '"+cpedb.CollectCounts+"'";
	// 	if(cpedb.MD_GMA_TriggerTime == "undefined")
	// 		sql_str += ", null";
	// 	else
	// 		sql_str += ", '"+cpedb.MD_GMA_TriggerTime+"'";
	// }

	sql_str +=  ");";


	var sqlUpdateAlternative = "`area` = " + "'" + cpedb.area + "'" + "," +
		"`SN` = "  + "'" + SerialNumber + "'" + "," +
		"`BTS` = " + "'" + cpedb.cpeBTS + "'" + "," +
		"`LCR` = " + "'" + cpedb.cpeLCR + "'" + "," +
		"`CellIdentity` = " + "'" + cpedb.cpeCid + "'" + "," +
		"`DeviceType` = "   + "'" + cpedb.DeviceType + "'" + "," + 
		"`Service` = "      + "'" + cpedb.ServiceName + "'" + "," +
		"`IPAddress` = "    + "'" + cpedb.IPAddress + "'" + "," +
		"`AdminState` = "   + "'" + AdminState + "'" + "," +
		"`RFTxStatus` = "   + "'" + cpedb.RFTxStatus + "'" + "," +
		"`OpState` = "      + "'" + cpedb.OpState + "'" + "," +
		"`Utiliz` = "       + "'" +  randomNum + "'" + "," +
		"`PhyCellIDInUse` = "  + "'" + PhyCellIDInUse + "'" + "," +
		"`SoftwareVersion` = " + "'" + cpedb.SoftwareVersion + "'" + "," +
		"`ConnectionRequestURL` = " + "'" + cpedb.ConnectionRequestURL + "'" + "," +
		"`ParameterKey` = " + "'" + cpedb.pKey + "'" + "," +
		"`Status` = " + "'" + cpedb.cpeStatus + "'" + "," +
		"`Alarm` = " + "'" + cpedb.CurrentAlarmNum + "'" + "," +
		"`MaxTxPowerInUse` = " + "'" + MaxTxPower + "'" + "," +
		"`Note` = " + "'" + NoteInfo + "'" + "," + 
		"`CBC` = " + "'" + cpedb.CBC + "'" + " WHERE SN = " + "'" + SerialNumber + "'" + ";";


	if(hclass == 'sXGP_FAP_FC4064' || hclass == 'FAP_FC4064')
	{
		var dp_sql_query = "SELECT * FROM `" + cpedb.DpListDB + "` WHERE `SN` = '" + SerialNumber + "';";
		var DPSql = db.Query(dp_sql_query);

		if (DPSql.length != 0) 
		{
			dp_sql_update = "UPDATE dp_device_info SET `EARFCN` = \'" + cpedb.EARFCNinUSE +"\', `TxPower` =\'"+cpedb.MaxTxPower+ "\' WHERE `SN` = \'" +SerialNumber + "\'";
			cpe.log(SerialNumber+": SQL cmd for DOMAIN PROXY " + dp_sql_update);
			db.Update(dp_sql_update);
		}
		else 
		{
			dp_sql_update = "INSERT INTO dp_device_info (`SN`,`EARFCN`,`TxPower`) Values(\'"+SerialNumber+"\',\'"+ cpedb.EARFCNinUSE + "\',\'" +cpedb.MaxTxPower+ "\')"
			cpe.log(SerialNumber+": SQL cmd for DOMAIN PROXY " + dp_sql_update);
			db.Update(dp_sql_update);
		}
	}
	
	/* Foxconn 20180117 jay add end */
	//if(rs.length==1)
	if(cpedb.cpeEntryCount==1)
	{
	
		sql_update="REPLACE INTO `"+cpedb.CpeListDB+"`("+sql_str;
		cpe.log(SerialNumber+':'+'SQL cmd is = '+ sql_update);
		db.Update (sql_update);
		//cpe.log(SerialNumber+':'+'update '+SerialNumber+' to '+cpedb.CpeListDB+' DB done');
	}
	else
	{
		sql_update= "INSERT INTO `"+cpedb.CpeListDB+"`("+sql_str;
		cpe.log(SerialNumber+':'+'SQL cmd is = '+ sql_update);
		db.Update (sql_update);
		//cpe.log(SerialNumber+':'+'Add new device '+SerialNumber+' to '+cpedb.CpeListDB+' DB done');
	}
} catch (e) {
	func_log('DS exception: '+e.message);
}

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fems_CPE_List end \\\\\\\\\\\\\\\\');
