cpe.log('////////////////'+SerialNumber+':'+'Run script fems_device_Cfg_Get ////////////////');

var getPara = new Array ();
var i=0;
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.IdleMode.IntraFreq.QRxLevMinSIB1';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.IdleMode.IntraFreq.QRxLevMinSIB3';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.IdleMode.IntraFreq.CellReselectionPriority';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.IdleMode.Common.Qhyst';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.ConnMode.EUTRA.A1ThresholdRSRP';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.ConnMode.EUTRA.A3Offset';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.ConnMode.EUTRA.TimeToTrigger';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.Mobility.ConnMode.EUTRA.A2ThresholdRSRP';
getPara[i++]='Device.Services.FAPService.1.CellConfig.LTE.RAN.RF.PhyCellID';
getPara[i++]='Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Min';
getPara[i++]='Device.X_FOXCONN_FAP.CellConfig.SonMaxTxPower_Max';

try
{
	var paramValue = cpe.GetParameterValues(getPara); 
	var PhyCellID="";
	var SonMinTxPower="";
	var SonMaxTxPower="";

	//cpe.log(SerialNumber+':'+'////////////////////'+paramValue.length+'Parameter Values /////////////////');
	cpe.log(SerialNumber+':'+'Got '+paramValue.length+' Parameter Values response');
	
	var MobilityCfg='';
	var str;
	var strindex=0;

	for(i = 0; i < paramValue.length; i++) 
	{
		cpe.log(SerialNumber+':'+MobilityCfg);
		cpe.log(SerialNumber+':'+paramValue[i].name +'='+ paramValue[i].value);
		str=paramValue[i].name;
		
		strindex=str.indexOf("QRxLevMinSIB1");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'QRxLevMinSIB1='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("QRxLevMinSIB3");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'QRxLevMinSIB3='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("CellReselectionPriority");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'CellReselectionPriority='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("Qhyst");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'Qhyst='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("A1ThresholdRSRP");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'A1ThresholdRSRP='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("A3Offset");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'A3Offset='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("TimeToTrigger");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'TimeToTrigger='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("A2ThresholdRSRP");
		if(strindex!=-1)
		{       
			strindex=0;
			MobilityCfg=MobilityCfg+'A2ThresholdRSRP='+paramValue[i].value+';';
			continue;
		}
		strindex=str.indexOf("PhyCellID");
		if(strindex!=-1)
		{       
			strindex=0;
			PhyCellID=paramValue[i].value;
			continue;
		}
		strindex=str.indexOf("SonMaxTxPower_Min");
		if(strindex!=-1)
		{       
			strindex=0;
			SonMinTxPower=paramValue[i].value;
			continue;
		}
		strindex=str.indexOf("SonMaxTxPower_Max");
		if(strindex!=-1)
		{       
			strindex=0;
			SonMaxTxPower=paramValue[i].value;
			continue;
		}
	}
}
catch(e)
{
	catchMessage(e);
}


cpe.log(SerialNumber+':'+MobilityCfg);
var SerialNumber=cpe.Inform.DeviceId.SerialNumber;

try
{
    var rs = db.Query ("SELECT * FROM `"+cpedb.SubscriptionDB+"` WHERE `SN` = '"+SerialNumber+"';");
    cpe.log(SerialNumber+':'+'Rows found in DB '+cpedb.SubscriptionDB+' is = '+rs.length);
    g_para = rs[0];
    
    cpe.log(SerialNumber+':'+'Query '+cpedb.SubscriptionDB+' found cpe');
    
    if(rs.length==1)
    {
        //var   Qstring="REe+"');";
        var   Qstring="UPDATE  `"+cpedb.SubscriptionDB+"` SET   `MobilityCfg` = '"+      MobilityCfg  +
                                                             "', `PCI` = '"+              PhyCellID    +
                                                             "', `SonMaxTxPower_Min` = '"+SonMinTxPower+
                                                             "', `SonMaxTxPower_Max` = '"+SonMaxTxPower+
                                                             "' WHERE `SN` = '"+         SerialNumber +"';";

        cpe.log(SerialNumber+':'+Qstring);
        var rs1 = db.Update (Qstring);
    }
}
catch (e) {
    func_log ("DS exception: "+e.message);
}


cpe.log('////////////////'+SerialNumber+':'+' fems_device_Cfg_Get end////////////////');