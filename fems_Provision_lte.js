cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script fems_Provision_lte \\\\\\\\\\\\\\\\');
var hclass = cpe.Inform.DeviceId.ProductClass;

//==================================================
//              Array  definition
//==================================================
var paramSet_Prov    = new Array ();
var paramGet_Prov    = new Array ();


var E_DATAMODEL   = 'datamodelbean_lte_fc4008_APT';

//==================================================
//              Configuration  definition
//==================================================
var LOOP_TIMES=20;
var IGNORE_FORCE_NOTIFY = 1;

//==================================================
//              Globle variable
//==================================================
var g_para_prov;

//==================================================
//              Enum definition
//==================================================
//Project

const E_DATAMODEL_IMS_FC100   = 'datamodelbean_fc100';
const E_DATAMODEL_IMS_FC220   = 'datamodelbean_ims_fc220';
const E_DATAMODEL_IMS_FC220v6 = 'datamodelbean_ims_fc220v6_v302';
const E_DATAMODEL_IUH_FC220   = 'datamodelbean_iuh_fc220';
const E_DATAMODEL_IUH_FC221   = 'datamodelbean_iuh_fc221_1';
const E_DATAMODEL_LTE_FC500   = 'datamodelbean_lte_fc500';
const E_DATAMODEL_IUH_FC3008Q = 'datamodelbean_iuh_fc3008q';

// Method & action
const GET_NAME                     =1;
const GET_VALUE                    =2;
const SET_VALUE_MIN                =3;
const SET_VALUE_MAX                =4;
const GET_ATTR                     =5; // Get attr of parameters
const SET_ATTR                     =6; // Set attr of parameters to the max requirement
const CHECK_ATTR_MAX               =7; // Get attr of parameters and check whether they are set to the max requirement
const CHECK_ATTR_MAX_IMMED         =8; // Set attr of parameters to the max requirement then get attr immeditly in the same session
const SET_ATTR_FORCE_INFORM        =9; // Set attr to forced inform parameters
const SET_ATTR_FORCE_INFORM_VERIFY =10;
const CHECK_VALUE_MIN              =11;
const CHECK_VALUE_MAX              =12;
const SET_VALUE_DEF                =13;
const CHECK_VALUE_DEF              =14;

//==================================================
//               main
//==================================================


var i;
var newKey;

var ProvisioningCode = cpedb.ProvisioningCode;
var pKey             = cpedb.pKey;

func_log('pKey = '+pKey );

var FirstLabel='';
var Realm='';

if(pKey == '' || pKey =='LTE_FIOS_START' || pKey ==(FirstLabel+'_DL_PP_DONE')||pKey ==(FirstLabel+'_DL_CERT_END'))
{
	try
	{
		if( cpedb.ServiceName== "undefined" || cpedb.cpeStatus=="Unsubscribed")
		{
			paramSet_Prov[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:3600, type:'xsd:unsignedInt'};
			pKey = 'LTE_PROV_NO DB_FOUND1';
			cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+pKey);
			cpe.SetParameterValues (paramSet_Prov, pKey);
			func_logSave('Provisioning', 'fail', 'HeNB unsubscribed device access. Please check if device profile is in subscription setting', '', cpedb.UserName);
		}
		else
		{
			paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState', value:false,type:'xsd:boolean'};
			paramSet_Prov[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'};
			pKey = 'LTE_FIOS_STEP2_1';
			cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+pKey);
			cpe.SetParameterValues (paramSet_Prov, pKey);
			func_logSave('Provisioning', 'Processing', 'Turning off HeNB radio power', '', cpedb.UserName);
		}
		func_log('Set pKey as = '+pKey);
	}catch(e)
	{
		catchMessage(e);
	}
}
else if(pKey =='LTE_FIOS_STEP2_1') /* DVDH.20180109 Add for Cloud-Net Solution */
{
    func_log('Enter LTE_FIOS_STEP2_1 - check & Add PLMNList/SharedRAN entry');
    //jjj
    //20181002, Darren, remove this section.
    /*
    var getParameters_Prov = new Array ();
    getParameters_Prov[0] = 'Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNListNumberOfEntries';
    getParameters_Prov[1] = 'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPCNumberOfEntries';
    var response = cpe.GetParameterValues(getParameters_Prov);
    var addRes;
    cpe.log('////////////////////'+response.length+'Parameter Values /////////////////');
	*/
    //Darren, remove it due to that HeNB only supports one PLMN entry for current.
    /*
    try
    {
        for (i = 0; i < response.length; i++)
        {
            if (response[i].name=='Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNListNumberOfEntries')
            {
                for (j = response[i].value; j < 2; j++)
                {
                    cpe.log('////////////////////Try to create Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNList. /////////////////');
                    addRes = cpe.AddObject('Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNList.', 'LTE_FIOS_STEP2_1');
                    cpe.log('////////////////////InstanceNumber: '+ addRes.InstanceNumber +' Status: ' + addRes.Status + ' /////////////////');
                }
            }

            if (response[i].name=='Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPCNumberOfEntries')
            {
                for (j = response[i].value; j < 2; j++)
                {
                    cpe.log('////////////////////Try to create Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC. /////////////////');
                    addRes = cpe.AddObject('Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.', 'LTE_FIOS_STEP2_1');
                    cpe.log('////////////////////InstanceNumber: '+ addRes.InstanceNumber +' Status: ' + addRes.Status + ' /////////////////');
                }
            }
        }

        
    }
    catch (e)
    {
        catchMessage(e);
    }
    */


	paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState', value:false,type:'xsd:boolean'};
	pKey = 'LTE_FIOS_STEP2';
	   /* Foxconn 20201217 jack add */
    var sql_query="SELECT * FROM `"+cpedb.SubscriptionDB+"` WHERE `SN` = '"+SerialNumber+"';";
	var rs = db.Query (sql_query);
	if(rs.length==1)
	{
		if(rs[0].Type == 2&&rs[0].Parameter&&rs[0].Parameter!=''){
		paramSet_Prov[1]={name:'Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNList.1.Enable', value:false,type:'xsd:boolean'};
		}
	}
   /* Foxconn 20201217 jack add end */
    cpe.SetParameterValues (paramSet_Prov, pKey);
}
else if(pKey =='LTE_FIOS_STEP2')
{
	func_log('Enter LTE_FIOS_STEP2 - check Tunnel Enable or not');
	//func_log('Enter LTE_FIOS_STEP2 - jack');
	/*
	var routerMode='unknown';
	var UseTunnel='unknown';
	var f_reboot=0;
	try
	{
	var getParameters_Prov = new Array ();

	getParameters_Prov[0] ='Device.Services.FAPService.1.CellConfig.LTE.Tunnel.1.Enable';
	func_log(' Before getParameterValue');
	var response2 = cpe.GetParameterValues (getParameters_Prov);

	//print parameter values
	cpe.log(SerialNumber+':'+'////////////////////'+response2.length+'Parameter Values /////////////////');
	for (i=0;i < response2.length; i++)
	{
	func_log('  '+response2[i].name+'='+response2[i].value);
	cpe.log(SerialNumber+':'+'  '+response2[i].name+'='+response2[i].value);
	if(response2[i].name=='Device.Services.FAPService.1.CellConfig.LTE.Tunnel.1.Enable')
	UseTunnel=response2[i].value.valueOf();
	}
	}catch(e)
	{
	func_log ("DS exception: "+e.message);
	}
	*/

	try
	{
		var sql_query="SELECT * FROM `"+cpedb.SubscriptionDB+"` WHERE `SN` = '"+SerialNumber+"';";
		cpe.log(SerialNumber+':'+sql_query);
		var rs = db.Query (sql_query);

		cpe.log(SerialNumber+':'+'Rows found in '+ cpedb.SubscriptionDB+ ' DB is = '+rs.length);
		if(rs.length==1)
		{
			//2020/12/12, Daisy, change the way of set parameters.
			
			if(rs[0].Type == 2&&rs[0].Parameter&&rs[0].Parameter!=''){
			//if(cpedb.manufacturer == 'Foxconn_2CA'){
				cpe.log('>>>>>>type is 2 and Parameter is valid to set parameters');
				//g_para_prov = rs[0].Parameter;
				//var g_para = rs[0].Parameter;
				//g_para_prov =JSON.parse(g_para);
				//g_para_prov=rs[0].Parameter;
				g_para_prov=eval('(' + rs[0].Parameter + ')');
				var j=0;
				//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.ScanOnBoot',      value:true,       type:'xsd:boolean'};
				for(var pp in g_para_prov){
					cpe.log('the g_para_prov[pp]["name"] is '+g_para_prov[pp]["name"]);
					cpe.log('the g_para_prov[pp]["value"] is '+g_para_prov[pp]["value"]);
					
					if(g_para_prov[pp]["value"]!=null)
					{

						if(g_para_prov[pp]["type"]=='xsd:boolean' ){
							if(g_para_prov[pp]["value"] == false || g_para_prov[pp]["value"] == 0){
								paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:false,       type:g_para_prov[pp]["type"]};
							}else{
								paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:true,       type:g_para_prov[pp]["type"]};
							}
						}else if(g_para_prov[pp]["type"]=='xsd:string'){
							paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:g_para_prov[pp]["value"].toString(),       type:g_para_prov[pp]["type"]};
						}else{
							paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:g_para_prov[pp]["value"],       type:g_para_prov[pp]["type"]};
						}
					
						//paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:g_para_prov[pp]["value"],       type:g_para_prov[pp]["type"]};
						//paramSet_Prov[j++]={name:g_para_prov[pp]["name"],      value:1,       type:g_para_prov[pp]["type"]};
						//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.ScanOnBoot',      value:1,       type:'xsd:boolean'};
						//cpe.log('the set parm name is'+g_para_prov[pp]["name"]);
						//cpe.log('the set parm value is'+g_para_prov[pp]["value"]);
						//cpe.log('the set parm type is'+g_para_prov[pp]["type"]);
					}
					
				}
				paramSet_Prov[j++]={name:'Device.ManagementServer.PeriodicInformInterval', value:cpedb.PII, type:'xsd:unsignedInt'};
				//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity',      value:rs[0].CellIdentity,       type:'xsd:unsignedInt'}; // add by jack on 20201230
									





				//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity',      value:g_para_prov.CellIdentity,       type:'xsd:unsignedInt'};

				//if(g_para_prov.PCI && g_para_prov.PCI!='')/* Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror. */
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.RF.PhyCellID',             value:g_para_prov.PCI,               type:'xsd:string'     };
				
				
				//paramSet_Prov[j++]={name:'Device.ManagementServer.ConnectionRequestUsername',                        value:g_para_prov.ConnreqUname,      type:'xsd:string'     };
				//paramSet_Prov[j++]={name:'Device.ManagementServer.ConnectionRequestPassword',                        value:g_para_prov.ConnreqPass,       type:'xsd:string'     };

	            //if(g_para_prov.FeMS_URL && g_para_prov.FeMS_URL!='')                
					//paramSet_Prov[j++]={name:'Device.ManagementServer.URL', value:g_para_prov.FeMS_URL, type:'xsd:string'     };
	           // if(g_para_prov.FeMS_USER && g_para_prov.FeMS_USER!='')                
					//paramSet_Prov[j++]={name:'Device.ManagementServer.Username', value:g_para_prov.FeMS_USER, type:'xsd:string'     };
	           // if(g_para_prov.FeMS_PASS && g_para_prov.FeMS_PASS!='')                
					//paramSet_Prov[j++]={name:'Device.ManagementServer.Password', value:g_para_prov.FeMS_PASS, type:'xsd:string'     };
	            
	           // if(g_para_prov.NTP_ENABLE && g_para_prov.NTP_ENABLE != '')
	            	//paramSet_Prov[j++]={name:'Device.Time.Enable', value:g_para_prov.NTP_ENABLE, type:'xsd:boolean'};
	            //if(g_para_prov.NTP1 && g_para_prov.NTP1 != '')
					//paramSet_Prov[j++]={name:'Device.Time.NTPServer1', value:g_para_prov.NTP1, type:'xsd:string'};            
	            //if(g_para_prov.NTP_TIMEZONE && g_para_prov.NTP_TIMEZONE!='')                
					//paramSet_Prov[j++]={name:'Device.Time.LocalTimeZone', value:g_para_prov.NTP_TIMEZONE, type:'xsd:string'     };
	            
				//if(g_para_prov.REM_PLMN_LIST && g_para_prov.REM_PLMN_LIST!='')  				
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.REMPLMNList', value:g_para_prov.REM_PLMN_LIST, type:'xsd:string'     };				
				//if(g_para_prov.REM_BAND_LIST && g_para_prov.REM_BAND_LIST!='')                
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.REMBandList', value:g_para_prov.REM_BAND_LIST, type:'xsd:string'     };		
				//if(g_para_prov.REM_ARFCNDL_LIST && g_para_prov.REM_ARFCNDL_LIST!='')                
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.EUTRACarrierARFCNDLList', value:g_para_prov.REM_ARFCNDL_LIST, type:'xsd:string'     };	
				
				//if(g_para_prov.SCAN_ON_BOOT && g_para_prov.SCAN_ON_BOOT != '')
					//paramSet_Prov[j++]={ name:'Device.Services.FAPService.1.REM.LTE.ScanOnBoot', value:g_para_prov.SCAN_ON_BOOT, type:'xsd:boolean' };		
	 			
				//if(g_para_prov.TDD_Subframe && g_para_prov.TDD_Subframe!='' && (g_para_prov.TDD_Subframe == 1 || g_para_prov.TDD_Subframe == 2) )                
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.PHY.TDDFrame.SubFrameAssignment', value:g_para_prov.TDD_Subframe, type:'xsd:unsignedInt'     };		
				//if(g_para_prov.TDD_Special_Subframe && g_para_prov.TDD_Special_Subframe!='' && ( g_para_prov.TDD_Special_Subframe == 7 || g_para_prov.TDD_Special_Subframe == 6 ) )               
					//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.PHY.TDDFrame.SpecialSubframePatterns', value:g_para_prov.TDD_Special_Subframe, type:'xsd:unsignedInt'     };		  	    		
				
			}else{
				cpe.log('>>>>>>eNB is origin to set parameters');
				g_para_prov = rs[0];
				//cpe.log("pre PCI="+ g_para_prov.PCI);
				//cpe.log("pre TAC="+ g_para_prov.TAC);
				//cpe.log("pre rs PCI="+ rs[0].PCI);
				//cpe.log("pre rs TAC="+ rs[0].TAC);

				//if(g_para_prov.RfCfg && g_para_prov.RfCfg!='')
				//{
				//	cpedb.setKey='LTE_PROV_RF_PARAM';
				//	cpedb.multiParamCfg = g_para_prov.RfCfg;
				//	call("fems_parameters_Cfg");
				//	func_logSave('Provisioning', 'Processing', 'Apply RF configuration', '', 'Script fems_Provision_lte');
				//}
				/*
				if(g_para_prov.MobilityCfg && g_para_prov.MobilityCfg!='')
				{	
					cpedb.setKey='LTE_PROV_MOBILITY_PARAM';
					cpedb.multiParamCfg = g_para_prov.MobilityCfg;
					call("fems_parameters_Cfg");
					func_logSave('Provisioning', 'Processing', 'Apply mobility configuration', '', 'Script fems_Provision_lte');
				}
				if(g_para_prov.RemCfg && g_para_prov.RemCfg!='')
				{
					cpedb.setKey='LTE_PROV_REM_PARAM';
					cpedb.multiParamCfg = g_para_prov.RemCfg;
					call("fems_parameters_Cfg");
					func_logSave('Provisioning', 'Processing', 'Apply REM configuration', '', 'Script fems_Provision_lte');
				}
				if(g_para_prov.NeiberCfg && g_para_prov.NeiberCfg!='')
				{
					cpedb.setKey='LTE_PROV_NEIGHBOR_PARAM';
					cpedb.multiParamCfg = g_para_prov.NeiberCfg;
					call("fems_parameters_Cfg");
					func_logSave('Provisioning', 'Processing', 'Apply Neighbor configuration', '', 'Script fems_Provision_lte');
				}
				*/
				var j=0;

				//paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity',      value:cpedb.CellIdentity,       type:'xsd:unsignedInt'};
				paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity',      value:g_para_prov.CellIdentity,       type:'xsd:unsignedInt'};

				if(g_para_prov.PCI && g_para_prov.PCI!='')/* Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror. */
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.RF.PhyCellID',             value:g_para_prov.PCI,               type:'xsd:string'     };
				
				// Darren, remove TAC.
				/*
				if(g_para_prov.TAC && g_para_prov.TAC!='') Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror. 
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.EPC.TAC',                      value:g_para_prov.TAC,               type:'xsd:unsignedInt'};
				*/
				/*
				if(g_para_prov.SonMaxTxPower_Max && g_para_prov.SonMaxTxPower_Max!='')// Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror.
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max',                        value:20, type:'xsd:int'        };

				if(g_para_prov.SonMaxTxPower_Min && g_para_prov.SonMaxTxPower_Min!='')//Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror.
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Min',                        value:-10, type:'xsd:int'        };
				*/
				if(g_para_prov.SonMaxTxPower_Max && g_para_prov.SonMaxTxPower_Max!='')//Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror.
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max',                        value:g_para_prov.SonMaxTxPower_Max, type:'xsd:int'        };
				if(g_para_prov.SonMaxTxPower_Min && g_para_prov.SonMaxTxPower_Min!='')//Foxconn 20180110 jay add the restriction to avoid SetParameterValues eror. 
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Min',                        value:g_para_prov.SonMaxTxPower_Min, type:'xsd:int'        };
				
				paramSet_Prov[j++]={name:'Device.ManagementServer.ConnectionRequestUsername',                        value:g_para_prov.ConnreqUname,      type:'xsd:string'     };
				paramSet_Prov[j++]={name:'Device.ManagementServer.ConnectionRequestPassword',                        value:g_para_prov.ConnreqPass,       type:'xsd:string'     };

	            if(g_para_prov.FeMS_URL && g_para_prov.FeMS_URL!='')                
					paramSet_Prov[j++]={name:'Device.ManagementServer.URL', value:g_para_prov.FeMS_URL, type:'xsd:string'     };
	            if(g_para_prov.FeMS_USER && g_para_prov.FeMS_USER!='')                
					paramSet_Prov[j++]={name:'Device.ManagementServer.Username', value:g_para_prov.FeMS_USER, type:'xsd:string'     };
	            if(g_para_prov.FeMS_PASS && g_para_prov.FeMS_PASS!='')                
					paramSet_Prov[j++]={name:'Device.ManagementServer.Password', value:g_para_prov.FeMS_PASS, type:'xsd:string'     };
	            if(g_para_prov.NTP_ENABLE && g_para_prov.NTP_ENABLE != '')
	            	paramSet_Prov[j++]={name:'Device.Time.Enable', value:g_para_prov.NTP_ENABLE, type:'xsd:boolean'};
	            if(g_para_prov.NTP1 && g_para_prov.NTP1 != '')
					paramSet_Prov[j++]={name:'Device.Time.NTPServer1', value:g_para_prov.NTP1, type:'xsd:string'};	
	            if(g_para_prov.NTP_TIMEZONE && g_para_prov.NTP_TIMEZONE!='')                
					paramSet_Prov[j++]={name:'Device.Time.LocalTimeZone', value:g_para_prov.NTP_TIMEZONE, type:'xsd:string'     };
	            if(g_para_prov.DEVICE_ADDR_TYPE && g_para_prov.DEVICE_ADDR_TYPE!='')                
					paramSet_Prov[j++]={name:'Device.IP.Interface.1.IPv4Address.2.AddressingType', value:g_para_prov.DEVICE_ADDR_TYPE, type:'xsd:string'     };				
	            if(g_para_prov.IP && g_para_prov.IP!='')           
					paramSet_Prov[j++]={name:'Device.IP.Interface.1.IPv4Address.2.IPAddress', value:g_para_prov.IP, type:'xsd:string'     };	
	            if(g_para_prov.Subnet  && g_para_prov.Subnet !='')                
					paramSet_Prov[j++]={name:'Device.IP.Interface.1.IPv4Address.2.SubnetMask', value:g_para_prov.Subnet , type:'xsd:string'     };				
				/*if(g_para_prov.Gateway && g_para_prov.Gateway!='')           
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.IP.DefaultGateway', value:g_para_prov.Gateway, type:'xsd:string'     };	
	            if(g_para_prov.DNS  && g_para_prov.DNS !='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.IP.DNSServers', value:g_para_prov.DNS , type:'xsd:string'     };	*/								
				if(g_para_prov.REM_PLMN_LIST && g_para_prov.REM_PLMN_LIST!='')                
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.REMPLMNList', value:g_para_prov.REM_PLMN_LIST, type:'xsd:string'     };		
				if(g_para_prov.REM_BAND_LIST && g_para_prov.REM_BAND_LIST!='')                
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.REMBandList', value:g_para_prov.REM_BAND_LIST, type:'xsd:string'     };		
				if(g_para_prov.REM_ARFCNDL_LIST && g_para_prov.REM_ARFCNDL_LIST!='')                
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.REM.LTE.EUTRACarrierARFCNDLList', value:g_para_prov.REM_ARFCNDL_LIST, type:'xsd:string'     };	
				
				
				if(g_para_prov.SHARE_RAN_IPADDR && g_para_prov.SHARE_RAN_IPADDR!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.IPAddress', value:g_para_prov.SHARE_RAN_IPADDR, type:'xsd:string'     };		
				if(g_para_prov.SHARE_RAN_PLMN_LIST && g_para_prov.SHARE_RAN_PLMN_LIST!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.PLMNList', value:g_para_prov.SHARE_RAN_PLMN_LIST, type:'xsd:string'     };	
				
				/*
				if(g_para_prov.SHARE_RAN_ENABLE && g_para_prov.SHARE_RAN_ENABLE!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.Enable', value:true, type:'xsd:boolean'     };		
				*/
				//paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.LocalAccess', value:true, type:'xsd:boolean'     };
				//paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.VLANEnable', value:false, type:'xsd:boolean'     };
				//paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.VLANTag', value:0, type:'xsd:unsignedInt'     };
				//if(g_para_prov.SHARE_RAN_VLAN_EN && g_para_prov.SHARE_RAN_VLAN_EN!='')                
					//paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.2.VLANEnable', value:g_para_prov.SHARE_RAN_VLAN_EN, type:'xsd:boolean'     };		
				if(g_para_prov.SCAN_ON_BOOT && g_para_prov.SCAN_ON_BOOT != '')
					paramSet_Prov[j++]={ name:'Device.Services.FAPService.1.REM.LTE.ScanOnBoot', value:g_para_prov.SCAN_ON_BOOT, type:'xsd:boolean' };

				if(g_para_prov.RfCfg && g_para_prov.RfCfg!='') 	
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDL', value:g_para_prov.RfCfg, type:'xsd:string'     };	
				/*
				if(g_para_prov.SHARE_RAN_VLAN_TAG && g_para_prov.SHARE_RAN_VLAN_TAG!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.FAPControl.LTE.SharedRAN.EPC.1.VLANTag', value:g_para_prov.SHARE_RAN_VLAN_TAG, type:'xsd:unsignedInt'     };		
	  			*/
				if(g_para_prov.SYNC_BAND_LIST && g_para_prov.SYNC_BAND_LIST!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.REM.LTE.SyncBandList', value:g_para_prov.SYNC_BAND_LIST, type:'xsd:string'     };		
				if(g_para_prov.SYNC_EARFCN_LIST && g_para_prov.SYNC_EARFCN_LIST!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_FAP.REM.LTE.SyncEARFCNList', value:g_para_prov.SYNC_EARFCN_LIST, type:'xsd:string'     };	
				if(g_para_prov.SYNC_RF_OFF_EN && g_para_prov.SYNC_RF_OFF_EN!='')                
					paramSet_Prov[j++]={name:'Device.X_FOXCONN_MGMT.clockSync.bClockSyncFailRFOff', value:g_para_prov.SYNC_RF_OFF_EN, type:'xsd:boolean'     };		
				// if(g_para_prov.SYNC_TF_SYNC_RF_EN && g_para_prov.SYNC_TF_SYNC_RF_EN!='')                
				// 	paramSet_Prov[j++]={name:'Device.X_FOXCONN_MGMT.TimeFrequencySync.tfSyncRFoff', value:g_para_prov.SYNC_TF_SYNC_RF_EN, type:'xsd:boolean'     };		
	 			if(g_para_prov.TDD_Subframe && g_para_prov.TDD_Subframe!='' && (g_para_prov.TDD_Subframe == 1 || g_para_prov.TDD_Subframe == 2) )                
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.PHY.TDDFrame.SubFrameAssignment', value:g_para_prov.TDD_Subframe, type:'xsd:unsignedInt'     };		
				if(g_para_prov.TDD_Special_Subframe && g_para_prov.TDD_Special_Subframe!='' && ( g_para_prov.TDD_Special_Subframe == 7 || g_para_prov.TDD_Special_Subframe == 6 ) )               
					paramSet_Prov[j++]={name:'Device.Services.FAPService.1.CellConfig.LTE.RAN.PHY.TDDFrame.SpecialSubframePatterns', value:g_para_prov.TDD_Special_Subframe, type:'xsd:unsignedInt'     };		  	    		

				if( g_para_prov.SyslogServerURL && g_para_prov.SyslogServerURL != '' )
				{
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.FileServerURL', value:g_para_prov.SyslogServerURL, type:'xsd:string' }
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.AutoUpload', value:true, type:'xsd:boolean' };
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.FileServerUsername', value:'test', type:'xsd:string' };
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.FileServerPassword', value:'test', type:'xsd:string' };
				}
				else
				{
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.SYSLOG.LogUploadServer.AutoUpload', value:false, type:'xsd:boolean' };
				}
				
				if( g_para_prov.PMServerIP && g_para_prov.PMServerIP != '' )
				{
					g_para_prov.PMServerIP = 'http://' + g_para_prov.PMServerIP + '/FeMS/kpiParser.php';
					paramSet_Prov[j++] = { name:'Device.FAP.PerfMgmt.Config.1.URL', value:g_para_prov.PMServerIP, type:'xsd:string' };
					paramSet_Prov[j++] = { name:'Device.FAP.PerfMgmt.Config.1.Enable', value:true, type:'xsd:boolean' };
				}
				else
				{
					paramSet_Prov[j++] = { name:'Device.FAP.PerfMgmt.Config.1.Enable', value:false, type:'xsd:boolean' };
				}


				// if( g_para_prov.TimeFrequencySync_HopId && g_para_prov.TimeFrequencySync_HopId != '' )
				// {
				// 	paramSet_Prov[j++] = { name:'Device.X_FOXCONN_MGMT.TimeFrequencySync.tfSyncHopId', value:g_para_prov.TimeFrequencySync_HopId, type:'xsd:int' }
				// }

				if( g_para_prov.LTE_syncFemtoEARFCNList && g_para_prov.LTE_syncFemtoEARFCNList != '' )
				{
					paramSet_Prov[j++] = { name:'Device.X_FOXCONN_FAP.REM.LTE.syncFemtoEARFCNList', value:g_para_prov.LTE_syncFemtoEARFCNList, type:'xsd:string' }
				}
			}
			func_logSave('Provisioning', 'Processing', 'Update HeNB new configuration', '', cpedb.UserName);
			if(hclass == 'FAP_FC4064Q1CA')
			{
				pKey = cpedb.ProvDoneKey
				
			}
			else
			{
				pKey = 'LTE_FIOS_STEP6'
			}


			cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+ pKey);
			cpe.SetParameterValues (paramSet_Prov, pKey);
			//func_log('Enter LTE_FIOS_STEP3 - set EUTRACarrierARFCNDL, FreqBand and S1 Server');

			//20180829, fox, Darren, add for set parameters log.
			for ( j = 0; j < paramSet_Prov.length; j = j + 1 )
			{
				cpe.log( "SetParameters : " +  paramSet_Prov[j].name + " -> " + paramSet_Prov[j].value + "\n" );
			}
			if(pKey == 'LTE_FIOS_STEP7')
			{
				cpe.Reboot(pKey)
			}

		}
	}
	catch (e)
	{
		catchMessage(e);
	}
}
else if(pKey == 'LTE_FIOS_STEP6')
{
	try
	{
		var logStr="";
		func_log('Enter LTE_FIOS_STEP6');
		// if(hclass == 'FAP_FC4064Q1CA')
		// {
		// 	// paramSet_Prov[0]={name:'Device.ManagementServer.ParameterKey', value:'LTE_FIOS_STEP7',type:'xsd:string'}
		// 	paramSet_Prov[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'};
		// 	cpe.log("!!!!! crying is okay !!!!!!");
		// 	cpedb.pKey = 'LTE_FIOS_STEP7';
		// 	pKey = 'LTE_FIOS_STEP7';
		// 	cpe.SetParameterValues (paramSet_Prov,pKey);
		// 	// cpe.Reboot(pKey);
		// 	func_log('Set pKey as '+ pKey);
		// 	func_logSave('Provisioning', 'Success', logStr, '', cpedb.UserName);
		// }
		// else
		// {

		
			/* Foxconn 20201217 jack add */
			var sql_query="SELECT * FROM `"+cpedb.SubscriptionDB+"` WHERE `SN` = '"+SerialNumber+"';";
			var rs = db.Query (sql_query);
			if(rs.length==1)
			{
				if(rs[0].Type == 2&&rs[0].Parameter&&rs[0].Parameter!=''){
					logStr='HeNB Provision performed sucessfully. Turning on HeNB radio power';
				paramSet_Prov[0]={name:'Device.Services.FAPService.1.CellConfig.LTE.EPC.PLMNList.1.Enable', value:true, type:'xsd:boolean'};
				}
				/* Foxconn 20201217 jack add end */
				else
				{

					if(cpedb.EnableService=="On")
					{
						logStr='HeNB Provision performed sucessfully. Turning on HeNB radio power';
						paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:true,type:'xsd:boolean'};
					}
					else
					{
						logStr='HeNB Provision performed sucessfully. Turning off HeNB radio power';	
						paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'};
					}
				}
			}
			paramSet_Prov[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:cpedb.PII, type:'xsd:unsignedInt'};

			
			cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+cpedb.ProvDoneKey);
			cpe.SetParameterValues (paramSet_Prov, cpedb.ProvDoneKey);
			
			//update by peter for radisys reboot failed
			cpe.Reboot(cpedb.ProvDoneKey);
			func_log('Set pKey as '+ cpedb.ProvDoneKey);
			func_logSave('Provisioning', 'Success', logStr, '', cpedb.UserName);
	}
	catch(e)
	{
		catchMessage(e);
	}
}
else if (pKey == 'LTE_FIOS_STEP7')
{
	cpe.log("Enter STEP 7")
	cpe.log(cpedb.sasStatus);
	
	paramGet_Prov[0] = "Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDLInUse";
	paramGet_Prov[1] = "Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max";
	
	var response     = cpe.GetParameterValues(paramGet_Prov);
	cpe.log("abcdefghijklmnopqrstuvwxyz: "+response[1].value+ " abcdefghijklmnopqrstuvwxyz");
	for( idx = 0; idx < response.length; idx = idx + 1 )
	{
		if( response[idx].name == 'Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDLInUse' ){ cpedb.EARFCNinUSE = response[idx].value }
		if ( response[idx].name == 'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max' ){ cpedb.MaxTxPower = response[idx].value }
	}
	if(cpedb.sasStatus = "unreg")
	{
		cpe.log("/////////////////////////////////TRIGGER DOMAIN PROXY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'")
		var sql_query1 = "update dp_device_info SET `sasStage` = 'reg' WHERE `SN` = \'"+SerialNumber+"\'"
		// var sql_query1 = "SELECT * FROM dp_device_info"
		cpe.log("!!!!!!!!!!!!!!!!!!DP TEST!!!!!!!!!!!!!!!")
		cpe.log("SQL CMD :"+sql_query1)
		cpe.log("!!!!!!!!!!!!!!!!!!DP TEST!!!!!!!!!!!!!!!")
		db.Update(sql_query1)
		//when dp flow is complete cell will turn on
		cpedb.sasStatus = "reg";
		cpe.log(cpedb.sasStatus);
	}
}
else if((pKey == 'LTE_PROV_NO DB_FOUND1' || pKey == 'LTE_PROV_NO DB_FOUND2')  && (cpedb.ServiceName== "undefined" || cpedb.cpeStatus=="Unsubscribed"))
{
	try
	{
		paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'};
		paramSet_Prov[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:300, type:'xsd:unsignedInt'};
		cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+pKey);
		cpe.SetParameterValues (paramSet_Prov, pKey);
	}catch(e)
	{
		catchMessage(e);
	}
}
else if(pKey != cpedb.ProvDoneKey)
{
	try
	{
		paramSet_Prov[0]={name:'Device.Services.FAPService.1.FAPControl.LTE.AdminState',    value:false,type:'xsd:boolean'};
		paramSet_Prov[1]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'};
		pKey = 'LTE_FIOS_START';
		cpe.log(SerialNumber+':'+'Send SetParameterValues: paramSet_Prov:'+pKey);
		cpe.SetParameterValues (paramSet_Prov, pKey);
	}catch(e)
	{
	catchMessage(e);
	}
}
//20181002, Darren, add provision done for periodic inform interval.
else if( pKey == cpedb.ProvDoneKey )
{
    //20181026, Darren, add PCI and EARFCN get when provision done anytime.
    try
    {
        paramGet_Prov[0] = "Device.X_FOXCONN_FAP.CellConfig.PhyCellIDInUse";
        paramGet_Prov[1] = "Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDLInUse";
		paramGet_Prov[2] = "Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max";
        var response     = cpe.GetParameterValues(paramGet_Prov);

        for( idx = 0; idx < response.length; idx = idx + 1 )
        {
            
            if( response[idx].name == 'Device.X_FOXCONN_FAP.CellConfig.PhyCellIDInUse' ){ cpedb.PCIinUSE = response[idx].value } 
			else if( response[idx].name == 'Device.X_FOXCONN_FAP.CellConfig.EUTRACarrierARFCNDLInUse' ){ cpedb.EARFCNinUSE = response[idx].value }
			else if ( response[idx].name == 'Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max' ){ cpedb.MaxTxPower = response[idx].value }
            
            cpe.log( SerialNumber + ':' + 'Get current PhyCellIDInUse -> ' + cpedb.PCIinUSE );
        	cpe.log( SerialNumber + ':' + 'Get current EUTRACarrierARFCNDLInUse -> ' + cpedb.EARFCNinUSE );
			cpe.log( SerialNumber + ':' + 'Get current MaxTxPower -> ' + cpedb.MaxTxPower);
        }

    }
    catch(e)
    {
        catchMessage(e);
    }

    call(cpedb.CPE_List_Script);

	// if(hclass == 'FAP_FC4064Q1CA')
	if(cbsd(hclass))
	{
		if(getSasStage())
		{
			cpe.log("/////////////////////////////////TRIGGER DOMAIN PROXY\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\\'")
			var sql_query1 = "update dp_device_info SET `sasStage` = 'reg' WHERE `SN` = \'"+SerialNumber+"\'"
			// var sql_query1 = "SELECT * FROM dp_device_info"
			cpe.log("!!!!!!!!!!!!!!!!!!DP TEST!!!!!!!!!!!!!!!")
			cpe.log("SQL CMD :"+sql_query1)
			cpe.log("!!!!!!!!!!!!!!!!!!DP TEST!!!!!!!!!!!!!!!")
			db.Update(sql_query1)
			//when dp flow is complete cell will turn on
			cpedb.sasStatus = "reg";
			cpe.log(cpedb.sasStatus);
		}	
	}

	try
	{
		paramSet_Prov[0]={name:'Device.ManagementServer.PeriodicInformInterval', value:10, type:'xsd:unsignedInt'};    
        pKey = cpedb.ProvDoneKey;
        cpe.SetParameterValues (paramSet_Prov, pKey);
        func_logSave('Provisioning', 'Success', 'Periodic HeNB Provision performed sucessfully, current key -> ' + pKey, '', cpedb.UserName);
	}
	catch(e)
	{
		catchMessage(e);
	}

}


//2018/11/23, Darren, set array to null for memory release.
paramSet_Prov = null;
paramGet_Prov = null;

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fems_Provision_lte end \\\\\\\\\\\\\\\\');
