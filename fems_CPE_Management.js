cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script fems_CPE_Management \\\\\\\\\\\\\\\\');

var SerialNumber=cpe.Inform.DeviceId.SerialNumber;
var getParameters_Mgt = new Array ();
var setParameters_Mgt = new Array ();
var pKey=cpedb.pKey;
var ScheduleTime="";


function action_SPV(act, para)
{
	try{
	if(para)
	{        
		setParameters_Mgt[0]=para;
		cpe.SetParameterValues (setParameters_Mgt, pKey); 
		func_logSave(act, 'Success', 'Success to Set '+ para.name +' to '+para.value, ScheduleTime, cpedb.UserName);
	}
	}catch (e) 
	{
		catchMessage(e);
		func_logSave(act, 'Fail', 'Set '+ para.name +' to '+para.value+ 'fail'+'e.message', ScheduleTime, cpedb.UserName);
	}    

	return;
}

function action_Reboot()
{
	try{
		cpe.Reboot(pKey);
		func_logSave('Reboot', 'Success', 'Send Reboot to HeNB', ScheduleTime, cpedb.UserName);
	} catch (e) {
		catchMessage(e);
		func_logSave('Reboot', 'Fail', '[System exception] '+e.message, ScheduleTime, cpedb.UserName);
		return 0;
	}
	return 1;
}

function action_Reset_to_default()
{
	//var rebootWaitTime={name:'Device.X_FOXCONN_MGMT.Software.rebootWaitTime', value:5, type:'xsd:unsignedInt'}; 
	//action_SPV("Set RebootWaitTime to 5sec", rebootWaitTime);

	try{        
		cpe.FactoryReset();
		func_logSave('Reset to default', 'Success', 'Send Reset to HeNB', ScheduleTime, cpedb.UserName);
	} catch (e) {
		catchMessage(e);
		func_logSave('Reset to default', 'Fail', '[System exception] '+e.message, ScheduleTime, cpedb.UserName);
		return 0;
	}
	return 1;
}

/* Foxconn 20171025 jay add */
function action_Unsubscribed_Reset_to_default()
{    
	try{        
		cpe.FactoryReset();
		func_logSave('Unsubscribed_Reset_to_default', 'Success', 'In progress', ScheduleTime, cpedb.UserName);
	} catch (e) {
		catchMessage(e);
		func_logSave('Unsubscribed_Reset_to_default', 'Fail', 'Err='+e.message, ScheduleTime, cpedb.UserName);
		return 0;
	}
	return 1;
}
/* Foxconn 20171025 jay add end */
function action_Turn_off_service()
{
	action_SPV("Turn off service", cpedb.RF_off_para);
	return;
}

function action_Turn_on_service()
{
	action_SPV("Turn on service", cpedb.RF_on_para);
	return;
}

function action_Force_log_upload()
{
	action_SPV("Log upload", cpedb.ForceLogUpload);
	return;
}

function action_Force_Configuration_upload()
{
	action_SPV("Config upload", cpedb.ForceCMUpload);
	return;
}

function action_Set_Parameter_value()
{
	/* 2019/09/28, Darren, set parameter values */
	/* cpedb.Save() is used */
	try
	{		
		var spv_read_idx = 1; /* for database */
		var qry = "SELECT * FROM `fems_spv` WHERE `SN` = '" + SerialNumber +"';";
		var result_qry = db.Query(qry);
		//var ary_idx = 0;

		/* Read datamodel from database and put it to gpv containter */
		for( spv_read_idx = 1; spv_read_idx <= result_qry.length; spv_read_idx++ )
		{
			/* Organize */
			if( (result_qry[spv_read_idx - 1].setValueType).toLowerCase() == 'unsignedint' )
			{
				setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:result_qry[spv_read_idx - 1].setValue, type:'xsd:unsignedInt'};
			}
			else if( (result_qry[spv_read_idx - 1].setValueType).toLowerCase() == 'int' )
			{
				setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:result_qry[spv_read_idx - 1].setValue, type:'xsd:int'};
			}
			else if( (result_qry[spv_read_idx - 1].setValueType).toLowerCase() == 'boolean' )
			{
				if( (result_qry[spv_read_idx - 1].setValue).toLowerCase() == 'true' || result_qry[spv_read_idx - 1].setValue == '1' )
				{
					setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:true, type:'xsd:boolean'};
				}
				else if( (result_qry[spv_read_idx - 1].setValue).toLowerCase() == 'false' || result_qry[spv_read_idx - 1].setValue == '0' )
				{
					setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:false, type:'xsd:boolean'};
				}
				else
				{
					func_logSave( 'SPV', 'Fail', 
						'SPV Unknown parameter ' + result_qry[spv_read_idx - 1].dbpath + ' with value' + result_qry[spv_read_idx - 1].setValue + ' for boolean', 
						ScheduleTime, cpedb.UserName );
				}
			}
			else if( (result_qry[spv_read_idx - 1].setValueType).toLowerCase() == 'datetime' )
			{
				setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:result_qry[spv_read_idx - 1].setValue, type:'xsd:dateTime'};
			}
			else if( (result_qry[spv_read_idx - 1].setValueType).toLowerCase() == 'string' )
			{
				setParameters_Mgt[spv_read_idx - 1] = {name:result_qry[spv_read_idx - 1].dbpath, value:result_qry[spv_read_idx - 1].setValue, type:'xsd:string'};
			}
			else
			{
				/* Unknown case */
				/* When this happened to the first element of array or in the middle of it, it will cause array start from wrong index
				   and this will cause SPV failed.
				*/

				func_logSave( 'SPV', 'Fail', 
					'SPV Unknown type for parameters ' + result_qry[spv_read_idx - 1].dbpath + ' with type ' + result_qry[spv_read_idx - 1].setValueType, 
					ScheduleTime, cpedb.UserName );

				/*
				if( ary_idx == 0 )
				{
					continue;
				}
				else
				{
					ary_idx--;
					continue;
				}*/

				/* Insert a dummy datamodel */
			}
			
			//ary_idx++;

			cpe.log( SerialNumber + ' : read spv database from index ' + spv_read_idx + ' ' 
				+ result_qry[spv_read_idx - 1].dbpath + ' type -> ' + result_qry[spv_read_idx - 1].setValueType + 
				' Value -> ' + result_qry[spv_read_idx - 1].setValue ); 
		}

		func_logSave( 'SPV', 'Success', 'Send SPV to HeNB', ScheduleTime, cpedb.UserName );

		var spv_response = cpe.SetParameterValues( setParameters_Mgt, pKey );
		cpe.log( SerialNumber + ':' + 'Got ' + spv_response + ' Set Parameter Values response' ); 

		if( spv_response == -1 )
		{
			func_logSave( 'SPV', 'Success', 'SPV to HeNB failed', ScheduleTime, cpedb.UserName );
		}
		else
		{
			func_logSave( 'SPV', 'Success', 'SPV to HeNB successfully', ScheduleTime, cpedb.UserName );
		}

		

	}
	catch(e)
	{
		catchMessage(e);
		/* This shall indicate whether response is good or not. And this can. */
		func_logSave( 'SPV', 'Fail', '[System exception] ' + e.message, ScheduleTime, cpedb.UserName );
		/* Cancel action queue anyway, do not block action queue */
		return 1;
	}

	return 1;


}

function action_Get_Parameter_value()
{
	/* 2019/09/24, Darren, get parameter values */

	try
	{
		var gpv_idx = 1; /* for get response */
		
		var gpv_read_idx = 1; /* for database */
		var child_read_idx = null;
		var qry = "SELECT * FROM `fems_gpv` WHERE `SN` = '" + SerialNumber +"';";
		var result_qry = db.Query(qry);
		var match = null;
		var save_qry; /* for save */
		var child_save_qry;

		/* Read datamodel from database and put it to gpv containter */
		for( gpv_read_idx = 1; gpv_read_idx <= result_qry.length; gpv_read_idx++ )
		{
			getParameters_Mgt[gpv_read_idx - 1] = result_qry[gpv_read_idx - 1].dbpath;
			cpe.log( SerialNumber + ' : read gpv database from index ' + gpv_read_idx + ' ' + result_qry[gpv_read_idx - 1].dbpath ); 
		}

		/* DO NOT overlap index if there's child case, but UI will handle this for me, so do NOT worry */
		child_read_idx = result_qry.length + 1;

		func_logSave( 'GPV', 'Success', 'Send GPV to HeNB', ScheduleTime, cpedb.UserName );

		var gpv_response = cpe.GetParameterValues( getParameters_Mgt );
		cpe.log( SerialNumber + ':' + 'Got ' + gpv_response.length + ' Parameter Values response' ); 

		/* Does this represent good enough for gpv response? Please ensure */
		/* Parse response */
		for( gpv_idx = 0; gpv_idx < gpv_response.length; gpv_idx++ )
		{
			/* Individual response checking */

			/* Reset match */
			match = 0;

			/* Does it match to database? */
			for( gpv_read_idx = 1; gpv_read_idx <= result_qry.length; gpv_read_idx++ )
			{
				/* 
				   WARNING, if response name is in the subset of parent node(i.e. result_qry[gpv_read_idx - 1].dbpath) and also match the response name here,
				   Will only update here. Not going to INSERT case. It's hard to know if the response name is exactly in parent node.
				   Unless we build a data model database.
				 */
				/* Gocha */
				if( result_qry[gpv_read_idx - 1].dbpath == gpv_response[gpv_idx].name )
				{
					save_qry = "UPDATE fems_gpv SET getValue= '" + gpv_response[gpv_idx].value + "' WHERE gpv_index = '" + result_qry[gpv_read_idx - 1].gpv_index + "' and SN = '" + SerialNumber + "';";
					//cpe.log( SerialNumber + ' save qry str -> ' + save_qry );
					/* Proceed to save it at database */
					db.Update(save_qry);
					match = 1
					continue;
				}
								
			}


			if( match == 1 )
			{
				/* Already update for absolute response name */
				continue;
			}
			else /* Child case left */
			{
				child_save_qry = "INSERT INTO `fems_gpv` (`SN`, `gpv_index`, `dbpath`, `getValue`) VALUES ('" + SerialNumber + "', '" + child_read_idx + "', '" + gpv_response[gpv_idx].name + "', '" + gpv_response[gpv_idx].value + "');";
				
				db.Update(child_save_qry);
				child_read_idx++;
			}

			cpe.log( SerialNumber + ':' + 'GPV ' + gpv_response[gpv_idx].name + ' -> ' + gpv_response[gpv_idx].value );
		}

		cpe.log( SerialNumber + ':' + 'GPV response length -> ' + gpv_response.length );

		/* Shall we clean database for every GPV? This is done at UI management page side */
		func_logSave( 'GPV', 'Success', 'GPV from HeNB successfully', ScheduleTime, cpedb.UserName );

	}
	catch(e)
	{
		catchMessage(e);
		/* This shall indicate whether response is good or not. And this can. */
		func_logSave( 'GPV', 'Fail', '[System exception] ' + e.message, ScheduleTime, cpedb.UserName );
		/* Cancel action queue anyway, do not block action queue */
		return 1;
	}

	return 1;

}

function action_Set_Parameter_Attribute()
{
	cpe.log(SerialNumber+':'+'Function action_Set_Parameter_Attribute is TBD');
	func_logSave('Set Parameter Attribute', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Get_Parameter_Attribute()
{
	cpe.log(SerialNumber+':'+'Function action_Get_Parameter_Attribute is TBD');
	func_logSave('Get Parameter Attribute', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Get_Supported_Method()
{
	cpe.log(SerialNumber+':'+'Function action_Get_Supported_Method is TBD');
	func_logSave('Get Supported Method', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Get_Parameter_Names()
{
	cpe.log(SerialNumber+':'+'Function action_Get_Parameter_Names is TBD');    
	func_logSave('Get Parameter Names', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}
//20181026, Darren, modify HeNB provision function.
function action_Provisionig()
{
	try
	{
		if( cpedb.ServiceName== "undefined" || cpedb.cpeStatus=="Unsubscribed")
		{ 
			setParameters_Mgt[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:3600, type:'xsd:unsignedInt'}; 
			pKey = 'LTE_PROV_NO DB_FOUND1';
			cpe.SetParameterValues (setParameters_Mgt, pKey);
			func_logSave('Trigger Provision', 'fail', 'Unsubscribed device access. Please check if device profile is in subscription setting', ScheduleTime, cpedb.UserName);
		}
		else
		{
			setParameters_Mgt[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState', value:false,type:'xsd:boolean'}; 
			setParameters_Mgt[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'}; 
			pKey = 'LTE_FIOS_START';
			cpe.SetParameterValues (setParameters_Mgt, pKey);
			func_logSave('Trigger Provision', 'Success', 'Send trigger to HeNB', ScheduleTime, cpedb.UserName);
		}   
		func_log('Set pKey as = '+pKey);
	}
	catch(e)
	{
		catchMessage(e);
		func_logSave('Trigger Provision', 'Fail', '[System exception] '+e.message, ScheduleTime, cpedb.UserName);
		return 0;
	}	
	return 1;
}

function action_Sync_device_data()
{
	try{        
		cpe.BackupCWMPTree();
		func_logSave('Sync device data', 'Success', 'Done', ScheduleTime, cpedb.UserName);
	} catch (e) {
		func_log ("DS exception: "+e.message);
		func_logSave('Sync device data', 'Fail', 'Err='+e.message, ScheduleTime, cpedb.UserName);
	}
	return;
}

function action_subscription_update()
{
	try{
		call("fems_update_device_settings");
		func_logSave('Update device settings', 'Success', 'Done', ScheduleTime, cpedb.UserName);
	} catch (e) {
		func_log ("DS exception: "+e.message);
		func_logSave('Update device settings', 'Fail', 'Err='+e.message, ScheduleTime, cpedb.UserName);
	}
	return;
}

function action_Firmware_upgrade()
{
	cpe.log(SerialNumber+':'+'Function action_Firmware_upgrade is TBD');
	func_logSave('Firmware upgrade', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Script_A()
{
	cpe.log('=======================RF_OFF RF_OFF RF_OFF =========================');
	cpe.log(SerialNumber+':'+'turn RF off');
	cpe.log('pkey -> ' + cpedb.pkey);
	cpe.log('AdminState ->' + cpedb.AdminState);
	cpe.log('EnableSerives -> ' + cpedb.EnableService);
	cpe.log('=======================RF_OFF RF_OFF RF_OFF =========================');

	setParameters_Mgt[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState', value:false,type:'xsd:boolean'};
	cpe.SetParameterValues (setParameters_Mgt, pKey);
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return 1;
}

function action_Script_B()
{
	cpe.log('=======================RF_ON RF_ON RF_ON =========================');
	cpe.log(SerialNumber+':'+'turn RF on');
	cpe.log('pkey -> ' + cpedb.pKey)
	cpe.log('AdminState ->' + cpedb.AdminSate);
	cpe.log('EnableService ->' + cpedb.EnableService);
	cpe.log('=======================RF_ON RF_ON RF_ON =========================');
	// cpedb.EnableService = 'on';
	// cpedb.RF_on_para;


	setParameters_Mgt[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState', value:true,type:'xsd:boolean'};

	cpe.SetParameterValues (setParameters_Mgt, cpedb.pKey);
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return 1;
}

function action_Script_C()
{
	// var cpe_sql_query="SELECT * FROM `"+cpedb.CpeListDB+"` WHERE `SN` = '"+SerialNumber+"';";
	// var DMSql = db.Query (cpe_sql_query);
	 
	// if(DMSql.length!=0)
	// {
	// 	//jjj we should comment here ?    
	// 	cpedb.cpeEntryCount = DMSql.length;
	// 	cpedb.cpeListStatus = DMSql[0].Status;
	// 	cpedb.AdminState = DMSql[0].AdminState;
	// 	cpedb.DB_DefGwMac = DMSql[0].DefGwMac;
	// 	cpedb.DB_InterRATCell = DMSql[0].InterRATCell;
	// 	cpedb.MaxTxPower = DMSql[0].MaxTxPowerInUse;
	// }
	cpe.log("!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n!!!!!!!!!!!!!!!!!!!!!!!!!!!!!\n");
	var qry = "SELECT * FROM `device_list` WHERE `SN` = '" + SerialNumber +"';";
	var result_qry = db.Query(qry);
	cpe.log(result_qry)

	// cpe.pkey='LTE_FIOS_STEP4';
	// setParameters_Mgt[0]={name:'Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDL', value:'46890,47140',type:'xsd:string'};
	// // setParameters_Mgt[1]={name:'Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDLInUse', value:'46890',type:'xsd:string'};
	// cpe.log(SerialNumber+':'+'Using action_script_C to change EARFCN values');  
	// cpe.SetParameterValues (setParameters_Mgt, cpedb.pKey);  
	// func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);

	return 1;
}

function action_Script_D()
{
	cpe.log(SerialNumber+':'+'Function action_Script_D is TBD');    
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Auto_Test_R_W()
{
	cpe.log(SerialNumber+':'+'Function action_Auto_Test_R_W is TBD');    
	func_logSave('Auto_Test_R/W', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}




func_log('pKey = '+pKey ) ;

try
{
	//var sql_query="SELECT * FROM `"+cpedb.ActionQDB+"`  WHERE `SN` = '"+SerialNumber+"';";
	var sql_query="SELECT * FROM `"+cpedb.ActionQDB+"` ORDER BY `ScheduleTime` ASC;";

	cpe.log(SerialNumber+':'+sql_query);        

	var AQrs = db.Query(sql_query);   

	cpe.log(SerialNumber+':'+'Rows found in Action queue DB is = '+AQrs.length);

	for( j = 0; j < AQrs.length; j++ )
	{
		cpe.log( SerialNumber + ':' + 'SN -> ' + AQrs[j].SN + ' ; Action is -> ' + AQrs[j].Action + ' ; id is -> ' + AQrs[j].id + ' ; ST is -> ' + AQrs[j]. ScheduleTime );
		//cpe.log( SerialNumber + ':' + 'AQrs before loop -> ' + AQrs[j] );
	}



	if(AQrs.length>0)
	{
		//for( i=0; i<AQrs.length; i++)
		for( i = 0; i < 1; i++ )
		{
			var g_AQ=AQrs[i];
			//20181115, Darren, duplicated IP cases on HeNB list.
			if( SerialNumber != g_AQ.SN )
			{
				cpe.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );
				cpe.log( '!!!!                                      WARNING                                 !!!!' );
				cpe.log( '!!!!     Current HeNB Serial Number is different from Target HeNB SerialNumber    !!!!' );
				cpe.log( '!!!!     There are duplicated IPs in the HeNB List?                               !!!!' );
				cpe.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!' );

				/* Are we going to end up here? */
				/* 2020/03/17, Darren, stick to the principle to remove the queue
				 */
				sql_query =	"DELETE FROM `" + cpedb.ActionQDB + "`  WHERE `id` = '" + g_AQ.id + "' AND `SN` = '" + g_AQ.SN + "';";				
				var rlt = db.Update(sql_query);
				cpe.log( 'Remove the actions queue which does not belongs to the right target HeNB' );
				break;
			}			

			cpe.log(SerialNumber+':'+'ScheduleTime ='+g_AQ.ScheduleTime);

			var  split_str=g_AQ.ScheduleTime.split(".");

			//cpe.log( SerialNumber + ':' + 'Current i -> ' + i + ' ; split_str -> ' + split_str.length );

			if(split_str.length == 2)
			{
				ScheduleTime= split_str[0];
				var Schedule=ScheduleTime.split(" ");
				var day= Schedule[0];
				var time= Schedule[1];				
				var  tmpday=day.split("-");
				var year=tmpday[0];
				var month=tmpday[1];
							
				var dday=tmpday[2];
				var  tmptime=time.split(":");
				var hour=tmptime[0];
				var minute=tmptime[1];
				var sec=tmptime[2];
				//var Schedu = new Date(year,month,dday,hour,minute,sec);
				var data_string = month+'/'+dday+'/'+year+' '+hour+':'+minute+':'+sec;
				var Schedu = new Date(data_string);
				//cpe.log(SerialNumber+':'+'Schedu ='+Schedu.toString());
				//cpe.log(SerialNumber+':'+'now ='+now.toString());
			}
			
			var success = 0;//Foxconn 20171120 jay add

			if( now >= Schedu)
			{
				cpe.log(SerialNumber+':'+'Execute Action '+g_AQ.Action);
				g_User=g_AQ.User;
				if(g_AQ.Action =='Reboot')                      {success = action_Reboot();                     } else 
				if(g_AQ.Action =='Reset to default')            {success = action_Reset_to_default();           } else
				if(g_AQ.Action =='Unsubscribed-reset-to-default')	{success = action_Unsubscribed_Reset_to_default();} else//Foxconn 20171025 jay add
				if(g_AQ.Action =='Turn off service')            {action_Turn_off_service();           } else
				if(g_AQ.Action =='Turn on service')             {action_Turn_on_service();            } else
				if(g_AQ.Action =='Log upload')                  {action_Force_log_upload();           } else
				if(g_AQ.Action =='Config upload')               {action_Force_Configuration_upload(); } else
				if(g_AQ.Action =='Set Parameter Value')         {success = action_Set_Parameter_value();        } else
				if(g_AQ.Action =='Get Parameter Value')         { // 2021/1/6, Dino, #2408 fix for double Send GPV issue 
				                                                  if ((g_AQ.Note != null) && (g_AQ.Note == 'EXEC'))
				                                                  {
                                   			                          cpe.log(SerialNumber+':'+'Skip action as previous one is still running!');
                                   			                          success = 0; /* keep this action in Q */
				                                                  }
				                                                  else
				                                                  {  
				                                                      sql_query="UPDATE `"+cpedb.ActionQDB+"` SET `Note`= 'EXEC' WHERE `id` = '"+g_AQ.id+"' AND `SN` = '"+g_AQ.SN+"';";
				                                                      db.Update(sql_query);
				                                                      success = action_Get_Parameter_value();        
				                                                  }} else
				if(g_AQ.Action =='Set Parameter Attribute')     {action_Set_Parameter_Attribute();    } else
				if(g_AQ.Action =='Get Parameter Attribute')     {action_Get_Parameter_Attribute();    } else
				if(g_AQ.Action =='Get Supported Method')        {action_Get_Supported_Method();       } else
				if(g_AQ.Action =='Get Parameter Names')         {action_Get_Parameter_Names();        } else
				if(g_AQ.Action =='Provisioning')                {success = action_Provisionig();      } else
				if(g_AQ.Action =='Sync data from device')       {action_Sync_device_data();           } else
				if(g_AQ.Action =='Update device settings')      {action_subscription_update();        } else  
				if(g_AQ.Action =='Firmware upgrade')            {action_Firmware_upgrade();           } else
				if(g_AQ.Action =='Script_A')                    {action_Script_A();                   } else
				if(g_AQ.Action =='Script_B')                    {action_Script_B();                   } else
				if(g_AQ.Action =='Script_C')                    {action_Script_C();                   } else
				if(g_AQ.Action =='Script_D')                    {action_Script_D();                   } else
				if(g_AQ.Action =='Auto Test R/W')               {action_Auto_Test_R_W();              } else
				if(g_AQ.Action =='Get Signal Quality')          {success = action_Get_Signal_Quality();         }         
				if(g_AQ.Action == 'RF_OFF')                     {success = action_Script_A();}
				if(g_AQ.Action == 'RF_ON')                      {success = action_Script_B();}
				if(g_AQ.Action == 'EARFCN')                     {success = action_Script_C();}
				if(success == 1)
				{
					//sql_query="DELETE FROM `"+cpedb.ActionQDB+"`  WHERE `id` = '"+g_AQ.id+"' AND `SN` = '"+SerialNumber+"';";
					//20181115, Darren, stick to the principle to remove the queue.
					sql_query="DELETE FROM `"+cpedb.ActionQDB+"`  WHERE `id` = '"+g_AQ.id+"' AND `SN` = '"+g_AQ.SN+"';";				
					var rlt = db.Update(sql_query);

					//cpe.log( SerialNumber + ':' + sql_query );
					cpe.log( SerialNumber + ':' + 'Update Result in (success = 1) is ' + rlt );

					
				} 
			}
		}
	} 
} 
catch (e) {
	func_log ("DS exception: "+e.message);
}

//2018/11/23, Darren, set array to null for memory release.
getParameters_Mgt = null;
setParameters_Mgt = null;

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fems_CPE_Management end \\\\\\\\\\\\\\\\');