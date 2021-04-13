cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script SiriusFly_fems_CPE_Management \\\\\\\\\\\\\\\\');

var SerialNumber=cpe.Inform.DeviceId.SerialNumber;
var getParameters_Mgt = new Array ();
var setParameters_Mgt = new Array ();
var pKey=cpedb.pKey;
var ScheduleTime="";
var g_User="Unknown";


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
		func_logSave('Reboot', 'Success', 'Send Reboot to SiriusFly', ScheduleTime, cpedb.UserName);
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
		func_logSave('Reset to default', 'Success', 'Send Reset to SiriusFly', ScheduleTime, cpedb.UserName);
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
	cpe.log(SerialNumber+':'+'Function action_Set_Parameter_value is TBD');
	func_logSave('Set Parameter value', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
	
	try{
		if(cpedb.SPV_Name && cpedb.SPV_Type && cpedb.SPV_Value )
		{        
		setParameters_Mgt[0]={name:cpedb.SPV_Name, value:cpedb.SPV_Value ,type:'xsd:'+cpedb.SPV_Type};
		cpe.SetParameterValues (setParameters_Mgt, pKey); 
		func_logSave('SPV', 'Success', 'Success to Set '+ cpedb.SPV_Name +' to '+cpedb.SPV_Value, ScheduleTime, cpedb.UserName);

		cpedb.SPV_Name='';
		cpedb.SPV_Type='';
		cpedb.SPV_Value='';
		//cpedb.Save();
		}
	}catch (e) {
		catchMessage(e);
		func_logSave('SPV', 'Fail', 'Set '+ cpedb.SPV_Name +' to '+cpedb.SPV_Value+ 'fail'+'e.message', ScheduleTime, cpedb.UserName);
		cpedb.SPV_Name='';
		cpedb.SPV_Type='';
		cpedb.SPV_Value='';
		//cpedb.Save();
	}
	return;
}

function action_Get_Parameter_value()
{
	cpe.log(SerialNumber+':'+'Function action_Get_Parameter_value is TBD');
	func_logSave('Get Parameter value', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
	
	try{
		getParameters_Mgt[0]=cpedb.GPV_NAME;
		var response = cpe.GetParameterValues (getParameters_Mgt); 
		cpedb.GPV_NAME='';
		cpe.log(SerialNumber+':'+'////////////// Got '+response.length+' Parameter Values /////////////////');
		var result='';
		for (i=0;i < response.length; i++)
		{
			cpe.log(SerialNumber+':'+'GPV of '+response[i].name+'='+response[i].value);
			result=result+';'+response[i].name+'='+response[i].value;
		}        
		func_logSave('GPV', 'Success', result, ScheduleTime, cpedb.UserName);

	} catch (e) {
		catchMessage(e);
		func_logSave('GPV', 'Fail', 'Err='+e.message, ScheduleTime, cpedb.UserName);
	}
	return;
}

function action_Get_Signal_Quality()
{
	var sigidx    = 0;
	var sigResult = '';
	cpe.log( SerialNumber + ':' + 'Function action_Get_Signal_Quality' );
	try
	{

		getParameters_Mgt[0] = 'Device.X_FOXCONN_MGMT.LTENetwork.RSRP';
		getParameters_Mgt[1] = 'Device.X_FOXCONN_MGMT.LTENetwork.RSRQ';
		getParameters_Mgt[2] = 'Device.X_FOXCONN_MGMT.LTENetwork.RSSI';
		getParameters_Mgt[3] = 'Device.X_FOXCONN_MGMT.LTENetwork.SINR';
		//20181026, Darren, add system uptime to refresh values on UI.
		getParameters_Mgt[4] = 'Device.DeviceInfo.UpTime';

		var response = cpe.GetParameterValues(getParameters_Mgt);
		cpe.log( SerialNumber + ':'+ '////////////// Got ' + response.length + ' Parameter Values /////////////////' );



		for( sigidx = 0; sigidx < response.length; sigidx = sigidx + 1 )
		{
			
			if( response[sigidx].name == 'Device.X_FOXCONN_MGMT.LTENetwork.RSRP' ){ cpedb.RSRP = response[sigidx].value } else
			if( response[sigidx].name == 'Device.X_FOXCONN_MGMT.LTENetwork.RSRQ' ){ cpedb.RSRQ = response[sigidx].value } else
			if( response[sigidx].name == 'Device.X_FOXCONN_MGMT.LTENetwork.RSSI' ){ cpedb.RSSI = response[sigidx].value } else
			if( response[sigidx].name == 'Device.X_FOXCONN_MGMT.LTENetwork.SINR' ){ cpedb.SINR = response[sigidx].value } else
			if( response[sigidx].name == 'Device.DeviceInfo.UpTime' ){ cpedb.SysUpTime = response[sigidx].value }
			

			cpe.log( SerialNumber + ':' + 'GPV-Signal ' + response[sigidx].name + ' -> ' + response[sigidx].value );
			//sigResult = sigResult + ';' + response[sigidx].name + ' = ' + response[sigidx].value;

		}
		sigResult = 'Get Signal Quality (RSRP/RSRQ/RSSI/SINR) Successfully';
		func_logSave('GPV-Signal', 'Success', sigResult, ScheduleTime, cpedb.UserName);

	}
	catch(e)
	{
		catchMessage(e);
		func_logSave('GPV-Signal', 'Fail', '[System exception] ' + e.message + 'Please check connection status' , ScheduleTime, cpedb.UserName);
		return 0;
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
//20181026, Darren, modify provision for SiriusFly.
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
			setParameters_Mgt[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'}; 
			pKey = 'DTU_PROVISION_START';
			cpe.SetParameterValues (setParameters_Mgt, pKey);
			func_logSave('Trigger Provision', 'Success', 'Send trigger to SiriusFly', ScheduleTime, cpedb.UserName);

		}
		   
		func_log('Set pKey as = '+ pKey);
		
	}
	catch(e)
	{
		catchMessage(e);
		func_logSave('Trigger Provision', 'Fail', '[System exception] ' + e.message, ScheduleTime, cpedb.UserName);
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
	cpe.log(SerialNumber+':'+'Function action_Script_A is TBD');
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Script_B()
{
	cpe.log(SerialNumber+':'+'Function action_Script_B is TBD');    
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
}

function action_Script_C()
{
	cpe.log(SerialNumber+':'+'Function action_Script_C is TBD');    
	func_logSave('Run Script A', 'Fail', 'feature not ready', ScheduleTime, cpedb.UserName);
	return;
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




func_log('pKey = '+pKey );

try
{
	//var sql_query="SELECT * FROM `"+cpedb.ActionQDB_SiriusFly+"`  WHERE `SN` = '"+SerialNumber+"' ORDER BY `ScheduleTime` ASC;";
	var sql_query="SELECT * FROM `"+cpedb.ActionQDB_SiriusFly+"` ORDER BY `ScheduleTime` ASC;";
	cpe.log(SerialNumber+':'+sql_query);        

	var AQrs = db.Query(sql_query);   

	cpe.log(SerialNumber+':'+'Rows found in Action queue DB is = '+AQrs.length);

	for( j = 0; j < AQrs.length; j = j + 1 )
	{
		
		cpe.log( SerialNumber + ':' + 'SN -> ' + AQrs[j].SN + ' ; Action is -> ' + AQrs[j].Action + ' ; id is -> ' + AQrs[j].id + ' ; ST is -> ' + AQrs[j]. ScheduleTime );

		//cpe.log( SerialNumber + ':' + 'AQrs before loop -> ' + AQrs[j] );
	}



	if(AQrs.length>0)
	{
		//for( i=0; i<AQrs.length; i++)
		for( i = 0; i < 1; i = i + 1 )
		{
			var g_AQ=AQrs[i];           
			//20181115, Darren, duplicated IP cases on SiriusFly list.
			if( SerialNumber != g_AQ.SN )
			{
				cpe.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
				cpe.log( '!!!!           WARNING             !!!!');
				cpe.log( '!!!!  SiriusFly List IP duplicate  !!!!');
				cpe.log( '!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!!');
			}

			cpe.log(SerialNumber+':'+'ScheduleTime ='+g_AQ.ScheduleTime);

			var  split_str=g_AQ.ScheduleTime.split(".");

			cpe.log( SerialNumber + ':' + 'Current i -> ' + i + ' ; split_str -> ' + split_str.length );

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
				cpe.log(SerialNumber+':'+'Schedu ='+Schedu.toString());
				cpe.log(SerialNumber+':'+'now ='+now.toString());
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
				if(g_AQ.Action =='Set Parameter value')         {action_Set_Parameter_value();        } else
				if(g_AQ.Action =='Get Parameter value')         {action_Get_Parameter_value();        } else
				if(g_AQ.Action =='Set Parameter Attribute')     {action_Set_Parameter_Attribute();    } else
				if(g_AQ.Action =='Get Parameter Attribute')     {action_Get_Parameter_Attribute();    } else
				if(g_AQ.Action =='Get Supported Method')        {action_Get_Supported_Method();       } else
				if(g_AQ.Action =='Get Parameter Names')         {action_Get_Parameter_Names();        } else
				if(g_AQ.Action =='Provisioning')                {success = action_Provisionig();                } else
				if(g_AQ.Action =='Sync data from device')       {action_Sync_device_data();           } else
				if(g_AQ.Action =='Update device settings')      {action_subscription_update();        } else  
				if(g_AQ.Action =='Firmware upgrade')            {action_Firmware_upgrade();           } else
				if(g_AQ.Action =='Script_A')                    {action_Script_A();                   } else
				if(g_AQ.Action =='Script_B')                    {action_Script_B();                   } else
				if(g_AQ.Action =='Script_C')                    {action_Script_C();                   } else
				if(g_AQ.Action =='Script_D')                    {action_Script_D();                   } else
				if(g_AQ.Action =='Auto Test R/W')               {action_Auto_Test_R_W();              } else
				if(g_AQ.Action =='Get Signal Quality')          {success = action_Get_Signal_Quality();         }           

				if(success == 1)
				{
					//sql_query="DELETE FROM `"+cpedb.ActionQDB_SiriusFly+"`  WHERE `id` = '"+g_AQ.id+"' AND `SN` = '"+SerialNumber+"';";				
					//20181015, Darren, stick to the principle to remove the queue.
					sql_query="DELETE FROM `"+cpedb.ActionQDB_SiriusFly+"`  WHERE `id` = '"+g_AQ.id+"' AND `SN` = '"+g_AQ.SN+"';";
					var rlt = db.Update(sql_query);

					cpe.log( SerialNumber + ':' + sql_query );
					cpe.log( SerialNumber + ':' + 'Update Result in (success = 1) is ' + rlt );

					if( g_AQ.Action == 'Get Signal Quality' )
					{
						cpe.log( SerialNumber + ':' + 'Call List update script to refresh signal quality');
						call(cpedb.DTU_List_Script);
					}


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

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script SiriusFly_fems_CPE_Management end \\\\\\\\\\\\\\\\');