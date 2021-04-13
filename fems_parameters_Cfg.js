cpe.log('////////////////' + SerialNumber + ' : ' + 'Run Script fems_parameters_Cfg \\\\\\\\\\\\\\\\');

var paramSet_paraCfg = new Array ();
var paramGet_paraCfg = new Array ();
var idx=0;
var g_paraCfg;

function func_SetParaValue(paraName, paraValue, paraType)
{
	//func_log('mobility func_SetParaValue name='+paraName+" type="+paraType);  
	paramGet_paraCfg[idx]=paraName;

	if(paraType=='unsignedInt')
	{        
		//func_log('type is unsignedInt');
		paramSet_paraCfg[idx]={name:paraName,value:paraValue,type:'xsd:unsignedInt'};
	}
	else if(paraType=='int' )
	{
		//func_log('type is int');
		paramSet_paraCfg[idx]={name:paraName,value:paraValue,type:'xsd:int'};
	}
	else if(paraType=='boolean')
	{
		//func_log('type is boolean');
		if(paraValue=='TRUE' || paraValue=='true'|| paraValue=='1')
		paramSet_paraCfg[idx]={name:paraName ,value:true,type:'xsd:boolean'};
		else if(paraValue=='FALSE' || paraValue=='false'|| paraValue=='0')
		paramSet_paraCfg[idx]={name:paraName ,value:false,type:'xsd:boolean'};
		else
		func_log('Set parameter '+paraName+' value unknown, value = '+ paraValue);
	}
	else if(paraType=='dateTime')
	{
		paramSet_paraCfg[idx]={name:paraName,value:paraValue,type:'xsd:dateTime'};
	}
	else if(paraType=='string')
	{
		//func_log('type is string');
		paramSet_paraCfg[idx]={name:paraName,value:paraValue,type:'xsd:string'};
	} 
	else 
	{
		//func_logSave('Set parameter '+paraName+' type unknown, type = '+ paraType);
		func_log('SPV fail of '+paraName+' type unknown');

	}
	//func_log('Set parameter name = '+paramSet_paraCfg[idx].name+ ' to value=[ '+paramSet_paraCfg[idx].value+' ]');
}


function func_CfgParser(ServiceCfgStr)
{
	var cfgSet_paraCfg = new Array();   
	var i  =0;    
	var inText = ServiceCfgStr.replace(/(\r\n|\n|\r)/gm,"");
	//func_log('inText='+inText);

	cfgSet_paraCfg=inText.split(";");
	for(i=0;i<cfgSet_paraCfg.length;i++)
	{
		//func_log('cfgSet_paraCfg['+i+']='+cfgSet_paraCfg[i]);
		var strindex=cfgSet_paraCfg[i].indexOf("=");
		if(strindex!=-1)
		{
			var split_str=cfgSet_paraCfg[i].split("=");
			//func_log('split_str:tag['+split_str[0]+'] value['+split_str[1]+']'); 
			var tag     = split_str[0];
			var cfgValue= split_str[1];

			var j=0;
			for(j=0;j<g_paraCfg.length;j++)
			{
				if(tag==g_paraCfg[j].pname)
				{      
					//20181115, Darren, remark code due to service config will not dump to HeNB.
					/*
					if(( tag == "FeMS_URL" && cfgValue == "" ) || 
					   ( tag == "FeMS_USER" && cfgValue == "" ) ||
					   ( tag == "FeMS_PASS" && cfgValue == "" ) ||
					   ( tag == "NTP_ENABLE" && cfgValue == "" ) ||
					   ( tag == "NTP1" && cfgValue == "" ) ||
					   ( tag == "NTP_TIMEZONE" && cfgValue == "" ) ||
					   ( tag == "DEVICE_IP" && cfgValue == "" ) ||
					   ( tag == "DEVICE_MASK" && cfgValue == "" ) ||
					   ( tag == "DEVICE_Gateway" && cfgValue == "" ) ||
					   ( tag == "DEVICE_DNS" && cfgValue == "" ) ||
					   ( tag == "DEVICE_ADDR_TYPE" && cfgValue == "" ) ||
					   ( tag == "PHY_CELL_ID" && cfgValue == "" ) ||
					   ( tag == "SCAN_ON_BOOT" && cfgValue == "" ) ||
					   ( tag == "REM_PLMN_LIST" && cfgValue == "" ) ||
					   ( tag == "REM_BAND_LIST" && cfgValue == "" ) ||
					   ( tag == "REM_ARFCNDL_LIST" && cfgValue == "" ) ||
					   ( tag == "CELL_ARFCNDL" && cfgValue == "" ) ||
					   ( tag == "SHARE_RAN_IPADDR" && cfgValue == "" ) ||
					   ( tag == "SHARE_RAN_PLMN_LIST" && cfgValue == "" ) ||
					   ( tag == "SYNC_BAND_LIST" && cfgValue == "" ) ||
					   ( tag == "SYNC_EARFCN_LIST" && cfgValue == "" ) ||
					   ( tag == "SYNC_RF_OFF_EN" && cfgValue == "" ) ||
					   ( tag == "SYNC_TF_SYNC_RF_EN" && cfgValue == "" ) || 
					   ( tag == "DL_UL_Ratio" && cfgValue == "" ))
					{
						continue;
					}
					*/
					if( tag == "DL_UL_Ratio" )
					{
						continue;
					}

					// paramSet_paraCfg[idx]={name:'', value:'',type:''};             
					func_SetParaValue(g_paraCfg[j].fPathName, cfgValue, g_paraCfg[j].type);
					//func_log('Set parameter name = '+paramSet_paraCfg[idx].name+ ' to value=[ '+paramSet_paraCfg[idx].value+' ]');
					idx++;
				}
			}
		}
	}
	//2018/11/23, Darren, set array to null for memory release.
	cfgSet_paraCfg = null;
}

cpe.log('////////////////'+SerialNumber+':'+'Run script fems_parameters_Cfg ////////////////');

//cpe.log(SerialNumber+':'+'multiParamCfg='+cpedb.multiParamCfg);

var sql_query="SELECT * FROM `"+cpedb.paramMapDB +"` WHERE 1=1;";
cpe.log(SerialNumber+':SQL command = '+sql_query);  
g_paraCfg = db.Query (sql_query);
cpe.log(SerialNumber+':'+'Rows found in '+ cpedb.paramMapDB+ ' DB is = '+g_paraCfg.length);

func_CfgParser(cpedb.multiParamCfg );

var f_SetPara=0;

try
{
	if( cpedb.setKey == cpedb.ProvDoneKey )
	{
		// Not in provisioning flow. Check whether value is the same as what are going to set. If tha same, skpi the SPV. 
		var response = cpe.GetParameterValues (paramGet_paraCfg);
		//cpe.log(SerialNumber+':'+'Got '+response.length+' Parameter Values response');

		for (m=0;m < response.length; m++)
		{
			// func_logSave('  '+response[i].name+'='+response[i].value);
			//cpe.log(SerialNumber+':'+'  '+response[m].name+'='+response[m].value); 

			for(n=0;n<idx;n++)
			{
				if(response[m].name==paramSet_paraCfg[n].name && response[m].value!=paramSet_paraCfg[n].value)
				{ 
					f_SetPara=1;
					break;
				}
				//cpe.log(SerialNumber+':'+'  '+response[m].name+'='+response[m].value+' is the same as '+paramSet_paraCfg[n].name+'='+paramSet_paraCfg[n].value); 
			}
			if(f_SetPara==1)
				break;
		}
	}
	else
		// In provisioning flow. Always apply SPV.
		f_SetPara=1;
}catch(e)
{
	catchMessage(e);
}

if(f_SetPara==1)
{
	try
	{
		var response=cpe.SetParameterValues (paramSet_paraCfg,  cpedb.setKey);

		if(response==-1)
		{
		func_log('SPV fail');
		}
	}
	catch (e) 
	{
		catchMessage(e);
	}
}

//2018/11/23, Darren, set array to null for memory release.
paramSet_paraCfg = null;
paramGet_paraCfg = null;

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fems_parameters_Cfg end \\\\\\\\\\\\\\\\');