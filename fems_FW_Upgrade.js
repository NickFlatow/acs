///Force to upgrade via FTP ///////////

var SerialNumber=cpe.Inform.DeviceId.SerialNumber;
var url1='ftp://127.0.0.1/unknown';
var username1='unknown';
var password1='unknown';
var targetFileName1='unknown';
var targetVesion='unknown';
var fileType1='1 Firmware Upgrade Image';
var fileSize1=0;
var ForceFMUG='TRUE';
var pKey = 0;  
var setKey='FWUpgrade-Fail';
var parameters_Upgrade = new Array ();
var i = 0;
var bUpgradeFirmware='0';
var RootDev;
var cpeSoftwareVersion='';

RootDev='Device';

cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script fmug_FW_Upgrade \\\\\\\\\\\\\\\\');

//rootDevGet();


if(cpedb.fmugUsername)
	username1=cpedb.fmugUsername;

if(cpedb.fmugPassword)
	password1=cpedb.fmugPassword;

if(cpedb.targetFileName)
	targetFileName1=cpedb.targetFileName;

if(cpedb.targetVesion)
	targetVesion=cpedb.targetVesion;

try{
	if(cpedb.FmugURL)
		url1=cpedb.FmugURL;
} catch (e) {
	func_log ("DS exception: "+e.message);
	url1=' ';
}

try{
	if(cpedb.ForceFMUG)
		ForceFMUG=cpedb.ForceFMUG;
} catch (e) {
	func_log ("DS exception: "+e.message);
	ForceFMUG='FALSE';
}

try{
	if(cpedb.OSS_SIT_STATE == 'STATE_FIRMWARE_UPGRADE')
		cpedb.OSS_SIT_STATE='STATE_FIRMWARE_UPGRADE';
} catch (e) {
	func_log ("DS exception: "+e.message);
	cpedb.OSS_SIT_STATE='STATE_OSS_SIT_DONE';
}

// Foxconn 20171030 jay modify for the limitation of length of commandKey is 32.
var commandKey1=SerialNumber+'_';
if(targetVesion.length > (32 - commandKey1.length))
	commandKey1 = commandKey1.concat(targetVesion.substring((32 - commandKey1.length))); 
else
	commandKey1 = commandKey1.concat(targetVesion); 
// Foxconn 20171030 jay end

////////////////// get pKey /////////////////////////   
if(cpedb.SoftwareVersion)
	cpeSoftwareVersion=cpedb.SoftwareVersion;

if(cpedb.pKey)
	pKey=cpedb.pKey;

if(cpedb.ProvisioningCode)
	ProvisioningCode=cpedb.ProvisioningCode;

func_log('pKey = '+pKey );     
parameters_Upgrade[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'}; 

if(cpedb.OSS_SIT_STATE=='STATE_FIRMWARE_UPGRADE')   
{   
	pKey = '' ;
	cpedb.OSS_SIT_STATE='STATE_OSS_SIT_DONE';
}

if (pKey == '' || pKey == 'FWUpgrade-Start'  ||  ForceFMUG =='TRUE')
{             
	func_log('FWUpgrade - start' );
	
	///////////////// Check version //////////////////////////
	if (cpeSoftwareVersion != targetVesion || ForceFMUG =='TRUE')
	{                 
		//func_log('===========================================================');            
		//func_log('Will upgrade firmware from ' +cpeSoftwareVersion+' to ' +targetVesion) ;     
		//func_log('===========================================================');            
		//func_logSave('Run firmware upgrade from ' +cpeSoftwareVersion+' to ' +targetVesion) ; 
		bUpgradeFirmware ='1';
	} 
	else              
	{                 
		//func_log('===========================================================');
		//func_log('PASS and Software Version is SAME,' +cpeSoftwareVersion);    
		//func_log('===========================================================');
		//func_logSave('No download Software Version is SAME as ' +cpeSoftwareVersion);
		try
		{
			cpe.log(SerialNumber+':'+'Send SetParameterValues: parameters_Upgrade:'+pKey);
			pKey = 'FWUpgrade-Pass';
			cpe.SetParameterValues (parameters_Upgrade, pKey );     
		}catch(e)
		{
			catchMessage(e);
		}			
	}

	if (bUpgradeFirmware == '1')
	{ 
		func_log('===========================================================');   
		func_log('firmware upgrading ........................................');   
		func_log('===========================================================');      

		try
		{
			// If apply random delay time to FMUG
			if(cpedb.FmugRandomEnable=="Enable")
			{
				var  rand1=Math.random()*7200;
				//cpe.log(SerialNumber+':'+'rand1= '+rand1);
				var rand2   = new Array();
				rand2=rand1.toString().split(".");
				//cpe.log(SerialNumber+':'+'rand2= '+rand2[0]);       
				var response1 = cpe.Download (commandKey1, fileType1, url1, username1, password1, fileSize1, targetFileName1,rand2[0]);


			}
			else
				var response1 = cpe.Download (commandKey1, fileType1, url1, username1, password1, fileSize1, targetFileName1); 

			//func_logSave('FWUpgrade, Download method for Firmware upgrade response |    StartTime = ' + response1.StartTime + ' |    CompleteTime = ' + response1.CompleteTime + ' |    Status = ' + response1.Status); 

			if(response1.Status == 1)
			{
				///////////////// wait for transfercomplete message /////////////////////
				setKey = 'FWUpgrade-Step1';
				cpedb.ForceFMUG= 'FALSE';
				//cpedb.Save(); 
				func_logSave('Firmware Upgrade','Success','FWUpgrade StartDownloadTime = ' + response1.StartTime  ,'', cpedb.UserName); 
				parameters_Upgrade[1]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'}; 
			} 
			else
			{        
				func_log('===========================================================');   
				func_log('Firmware upgrade FAIL ');
				func_log('===========================================================');   
				//func_logSave('FWUpgrade, Firmware upgrade [FAIL], CPE should not response status = 0');
				func_logSave('Firmware Upgrade','Fail','Firmware Upgrade fail due to download image fail, please check if the FTP site information is incorrect or other connection problem', '', cpedb.UserName);          
				setKey = 'FWUpgrade-Fail';  
			}
		} 
		catch (e) 
		{
			func_log ("FWUpgrade exception: "+e.message);
			func_logSave('Firmware Upgrade','Fail','[System exception] '+e.message, '', cpedb.UserName); 
			setKey = 'FWUpgrade-Fail';   
		} 

		try
		{		
			cpe.log(SerialNumber+':'+'Send SetParameterValues: parameters_Upgrade:'+setKey);
			var response=cpe.SetParameterValues (parameters_Upgrade, setKey );
			func_logSave("Firmware Upgrade", 'Success', 'Current software version is ' + cpeSoftwareVersion + ', target software version is ' + targetVesion, '', cpedb.UserName);

		} 
		catch (e) 
		{
			catchMessage(e);
		}			
	} 
}  

if (pKey == 'FWUpgrade-Step1') 
{
	var boot=0; 
	var periodic=0;
	var mDload=0;
	var valueChange=0;
	var transfercomplete=0;
	var connectionRequest = 0;
	var setKey='FWUpgrade-Step1';     
	func_log('FWUpgrade - Step1' );     
////////////////// check  event //////////////////  
	var report='Receive inform event';
	for( i=0; i<cpe.Inform.Event.length; i++ )          
	{                
		if (cpe.Inform.Event[i].EventCode == '1 BOOT') 
		{
			boot=1;    
			report=report+'  1 BOOT';
			setKey='FWUpgrade-Fail';
		}
		else if (cpe.Inform.Event[i].EventCode == '2 PERIODIC' ) 
		{
			periodic=1;
			report=report+'  2 PERIODIC';
		}
		else if (cpe.Inform.Event[i].EventCode == 'M Download') 
		{
			report=report+'  M Download with CommandKey = '+cpe.Inform.Event[i].CommandKey;
			if( cpe.Inform.Event[i].CommandKey == commandKey1)
			{
				mDload=1;
				setKey='FWUpgrade-Fail';
			}
		}
		else if (cpe.Inform.Event[i].EventCode == '4 VALUE CHANGE' ) 
		{
			valueChange=1;
			report=report+'  4 VALUE CHANGE';
		}            
		else if (cpe.Inform.Event[i].EventCode == '7 TRANSFER COMPLETE')
		{
			transfercomplete=1;   
			report=report+'  7 TRANSFER COMPLETE';
		}
		else if( cpe.Inform.Event[i].EventCode == '6 CONNECTION REQUEST' )
		{
			connectionRequest = 1;
			report = report + ' 6 CONNECTION REQUEST';
		} 



	}    
	func_log('FWUpgrade - Step1: boot = '+boot + ', mDload = '+mDload + ', transfercomplete= '+ transfercomplete );     

	if(mDload==1 && transfercomplete==1)
	{
		if(cpe.TransferComplete)
		{
			//func_logSave('TransferComplete |  CommandKey is '+cpe.TransferComplete.CommandKey); 
			//func_logSave('  CompleteTime is '+cpe.TransferComplete.CompleteTime); 
			//func_logSave('  FaultCode is '+cpe.TransferComplete.FaultCode); 
			//func_logSave('  FaultString is '+cpe.TransferComplete.FaultString); 
			//func_logSave('  StartTime is '+cpe.TransferComplete.StartTime); 

			report=report+'TransferComplete |  CommandKey is '+cpe.TransferComplete.CommandKey; 
			report=report+'  CompleteTime is '+cpe.TransferComplete.CompleteTime; 
			report=report+'  FaultCode is '+cpe.TransferComplete.FaultCode; 
			report=report+'  FaultString is '+cpe.TransferComplete.FaultString; 
			report=report+'  StartTime is '+cpe.TransferComplete.StartTime;

			if(cpe.TransferComplete.FaultCode!='0')    
			{        
				func_log('===========================================================');   
				func_log('Firmware upgrade FAIL ');
				func_log( '' + report );  
				func_log('===========================================================');  
				func_logSave('Firmware Upgrade','Fail', 'FaultString -> ' + cpe.TransferComplete.FaultString , '', cpedb.UserName);  

				//func_logSave('Firmware upgrade [FAIL], FaultCode is '+cpe.TransferComplete.FaultCode);           
				setKey = 'FWUpgrade-Fail';  
				transfercomplete=0;            
			}  
		} 
		else
		{        
			func_log('===========================================================');   
			func_log('Firmware upgrade FAIL ');     
			func_log('===========================================================');   
			//func_logSave('AT_05-01-01, Firmware upgrade [FAIL], No TransferComplete message received');  
			func_logSave('FWUpgrade','Fail', 'No TransferComplete message received' , '', cpedb.UserName);       
			setKey = 'FWUpgrade-Fail';  
			transfercomplete=0;            
		}      
	}


	if(boot==1 && mDload==1 && transfercomplete==1)
	{
		////////////////// check software version ////////////////// 
		try
		{	          
			if (cpeSoftwareVersion == targetVesion)
			{
				func_log('===========================================================');   
				func_log('Firmware upgrade PASS ');     
				func_log('===========================================================');   
				//func_logSave('FWUpgrade Firmware upgrade [PASS] '); 
				func_logSave('Firmware Upgrade', 'Success', 'Firmware Upgrade Successfully' ,'', cpedb.UserName); 
				setKey = 'FWUpgrade-Pass';
				cpe.log(SerialNumber+':'+'Send SetParameterValues: parameters_Upgrade:'+setKey);
				cpe.SetParameterValues (parameters_Upgrade, setKey ); 
				func_deleteUnsubscribedResetDefault();/* Foxconn 20171024 jay add: Delete Unsubscribe-reset-to-default from cpedb.ActionQDB */			

				cpe.log(SerialNumber+':'+'/////////Run InitResetDef////////');
				cpe.FactoryReset();
				func_logSave('Firmware Upgrade', 'Success', 'Current software version is ' + targetVesion, '', cpedb.UserName);                      
				func_logSave('Firmware Upgrade', 'Success', 'Reset HeNB' , '',cpedb.UserName);				
				cpe.log(SerialNumber+':'+'/////////End  InitResetDef///////');
				//call('Provisioning');
			}
			else    
			{        
				func_log('===========================================================');   
				func_log('Firmware upgrade FAIL ');     
				func_log('===========================================================');   
				//func_logSave('FWUpgrade, Firmware upgrade [FAIL], CPE version is ['+ cpeSoftwareVersion + '] should be ['+ targetVesion+']');           
				func_logSave('Firmware Upgrade','Fail','Current HeNB version is ['+ cpeSoftwareVersion + '], it shall be ['+ targetVesion+']', '', cpedb.UserName);          
				setKey = 'FWUpgrade-Fail';
			}  
		}
		catch(e)
		{
			catchMessage(e);
		}			
	}
    //2018/11/26, Darren, dequeue at FW mismatch state to prevent queue freezed on FeMS UI, also key FWUpgrade-Step1 infinie loop.
	if( connectionRequest == 1 )
	{
		cpe.log( SerialNumber + ' : ' + 'Got 6 CONNECTION REQUEST at FW upgrade stage, proceed to handle existed queue...' );
		func_logSave('Firmware Upgrade', 'Fail', 'Interrupt action queue received at firmware upgrade stage, proceed to handle queue first', '', cpedb.UserName);
		call(cpedb.CPE_Mgmt_Script);
	}  

	try
	{
		if(setKey == 'FWUpgrade-Fail') 
		{
			cpe.log(SerialNumber+':'+'Send SetParameterValues: parameters_Upgrade:'+setKey);
			cpe.SetParameterValues (parameters_Upgrade, setKey ); 
		}
	}catch(e)
	{
		catchMessage(e);
	}		
} 

//2018/11/23, Darren, set array to null for memory release.
rand2 = null;
parameters_Upgrade = null;
cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fmug_FW_Upgrade End \\\\\\\\\\\\\\\\');