var i;
var sData;
var RootDev;
var pKey = 0;
var gotAlarm = 0;
var gotValueChange = 0;
var gotPeriodicInform = 0;
var gotBootEvent = 0;
var gotBootStrapEvent = 0;
var gotConnectionRequestEvent = 0;
/* Foxconn 20171205 jay add */
var mismatchDeviceType = 0;
var Service_deviceType = "";
/* Foxconn 20171205 jay add end*/
var tryCatch = 0;
var now = new Date();
var SerialNumber = cpe.Inform.DeviceId.SerialNumber;
var dateTime = now.getFullYear() + "-" + (now.getMonth() + 1) + "-" + now.getDate() + " " + now.getHours() + ":" + now.getMinutes() + ":" + now.getSeconds();
var oui_ID = cpe.Inform.DeviceId.OUI;
var hclass = cpe.Inform.DeviceId.ProductClass;
var manufacturer = cpe.Inform.DeviceId.Manufacturer;

/* Foxconn 20180117 jay add for movement detection */
var neighborList = [];
var band28 = true;
/* Foxconn 20180117 jay add end */
var collectCountThresh = 5;
cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script fems_Default \\\\\\\\\\\\\\\\');

call('fems_Config');
call('fems_lib');

sData = '\n==========================================================';
sData += '\nDeviceId:';
sData += '\n   Manufacturer: ' + manufacturer;
sData += '\n   OUI:          ' + oui_ID;
sData += '\n   ProductClass: ' + hclass;
sData += '\n   SerialNumber: ' + SerialNumber;
sData += '\nMisc:';
sData += '\n   MaxEnvelopes: ' + cpe.Inform.MaxEnvelopes;
sData += '\n   RetryCount:   ' + cpe.Inform.RetryCount;
sData += '\n   CurrentTime:  ' + cpe.Inform.CurrentTime;
sData += '\nEvents:';

for (i = 0; i <= cpe.Inform.Event.length - 1; i++)
       sData += '\n   ' + cpe.Inform.Event[i].EventCode + ' [CommandKey = ' + cpe.Inform.Event[i].CommandKey + ']';

sData += '\nParams:';

for (i = 0; i <= cpe.Inform.ParameterList.length - 1; i++)
       sData += '\n   ' + cpe.Inform.ParameterList[i].Name + '=' + cpe.Inform.ParameterList[i].Value;

sData += '\n';
sData += '\n==========================================================';

logger(sData);

RootDev = 'Device';

cpedb.ProvisioningCode = "undefined";
cpedb.pKey = "undefined";
cpedb.SoftwareVersion = "undefined";
cpedb.HWVersion = "undefined";
cpedb.ConnectionRequestURL = "undefined";
cpedb.IPAddress = "undefined";
cpedb.OpState = "undefined";
cpedb.CellIdentity = "undefined"; /*  defined in subscription */
cpedb.cpeCid = "undefined"; /*  Get from CPE */
cpedb.RFTxStatus = "undefined";
cpedb.CurrentAlarmNum = "0";
cpedb.DeviceType = "undefined";
cpedb.ProvDoneKey = "undefined";
cpedb.ServiceCfg = "undefined";
cpedb.targetVesion = "undefined";
cpedb.BTS = "???"; /*  defined in subscription */
cpedb.LCR = "???"; /*  defined in subscription */
cpedb.cpeBTS = "???"; /*  Get from CPE */
cpedb.cpeLCR = "???"; /*  Get from CPE */
cpedb.ServiceName = "undefined";
cpedb.SwName = "undefined";
cpedb.ConnreqUname = "admin";
cpedb.ConnreqPass = "password";
cpedb.CBC = "undefined";

/*Foxconn 20180118 jay add*/
cpedb.DefGwMac = "undefined";
cpedb.InterRATCell = "undefined";
cpedb.cpeStatus = "undefined";
/*Foxconn 20180118 jay add*/
/*Foxconn_S-20180323-Wilson add */
cpedb.DB_DefGwMac = "undefined";
cpedb.DB_InterRATCell = "undefined";
cpedb.MD_GMA = 0;
cpedb.MD_NCL = 0;
cpedb.CollectCounts = 0;
cpedb.MD_GMA_TriggerTime = "undefined";
cpedb.cpeEntryCount = 0;
cpedb.cpeListStatus = "";
cpedb.forceClearMDGMA = 0;
cpedb.AdminState = 1;
cpedb.MaxTxPower = 0;
//cpedb.MaxTxPower           ='Unknown';
cpedb.RSRP = 0;
cpedb.RSRQ = 0;
cpedb.RSSI = 0;
cpedb.SINR = 0;
cpedb.SysUpTime = 0;
cpedb.PCIinUSE = 0;
cpedb.EARFCNinUSE = 0;
cpedb.UserName = "undefined";

function isOldNeighborList(InterRATCell) {
       /*
       for B28
       old format is PLMNID1,CID1,UARFCNDL1;PLMNID2,CID2,UARFCNDL2
       new format is CID1,UARFCNDL1;CID2,UARFCNDL2
       for B38
       old format is PLMNID1,CID1,EUTRACarrierARFCN1,RSTxPower1;PLMNID2,CID2,EUTRACarrierARFCN2,RSTxPower2
       new format is CID1,EUTRACarrierARFCN1;CID2,EUTRACarrierARFCN2
       */
       if (InterRATCell == 'none' || InterRATCell.length == 0) {
              return false;
       }
       var cellInfo = InterRATCell.split(";");
       //only need to verify one stored cell info
       var cellFields = cellInfo[0].split(",");
       if (cellFields.length > 2)
              return true;
       return false;
}

/* function */
function verifyNeighborList(InterRATCell, inform_InterRATCell) {
       if (inform_InterRATCell.length == 0 || InterRATCell.length == 0) {
              return true;
       }

       var in_inform_node = inform_InterRATCell.split(";");
       var db_node = InterRATCell.split(";");
       var i, j;

       for (i = 0; i < in_inform_node.length; i++)
              for (j = 0; j < db_node.length; j++) {
                     if (db_node[j] == in_inform_node[i]) {
                            return true;
                     }
              }
       return false;
}

/* 2019/01/16, Darren, Set java entry for log limit check point. */
function logLimitCheck(targetLine) {
       /* Action History */

       var actionHistoryQuery = "SELECT COUNT(*) AS NUMBER FROM `apt_action_history`;";
       var actionHistoryQueryResult = db.Query(actionHistoryQuery);

       cpe.log(SerialNumber + ':' + 'Rows -> ' + actionHistoryQueryResult[0].NUMBER + ' found in apt_action_history');

       if (parseInt(actionHistoryQueryResult[0].NUMBER) > parseInt(targetLine)) {
              cpe.log(SerialNumber + ':' + 'Rows -> ' + actionHistoryQueryResult[0].NUMBER + ' too much data in apt_action_history, going to delete by half order by ASC');

              try {
                     var targetLineToDelete = parseInt(targetLine / 2);
                     var targetLineToDeleteQuery = "DELETE FROM `apt_action_history` order by exetime ASC limit " + targetLineToDelete + ";";

                     db.Update(targetLineToDeleteQuery);

                     cpe.log(SerialNumber + ':' + 'Delete from apt_action_history finished');
              } catch (e) {
                     cpe.log(SerialNumber + ':' + 'Something wrong when delete apt_action_history data, message -> ' + e.message);
              }
       }
       /* Alarm History */

       var alarmHistoryQuery = "SELECT COUNT(*) AS NUMBER FROM `apt_alarm`";
       var alarmHistoryQueryResult = db.Query(alarmHistoryQuery);

       cpe.log(SerialNumber + ':' + 'Rows -> ' + alarmHistoryQueryResult[0].NUMBER + ' found in apt_alarm');

       if (parseInt(alarmHistoryQueryResult[0].NUMBER) > parseInt(targetLine)) {
              cpe.log(SerialNumber + ':' + 'Rows -> ' + alarmHistoryQueryResult[0].NUMBER + ' too much data in apt_alarm, going to delete by half order by ASC');

              try {
                     var targetLineToDelete = parseInt(targetLine / 2);
                     var targetLineToDeleteQuery = "DELETE FROM `apt_alarm` order by updateTime ASC limit " + targetLineToDelete + ";";

                     db.Update(targetLineToDeleteQuery);

                     cpe.log(SerialNumber + ':' + 'Delete from apt_alarm finished');
              } catch (e) {
                     cpe.log(SerialNumber + ':' + 'Something wrong when delete apt_alarm data, message -> ' + e.message);
              }
       }

       /* Login History */

       var loginHistoryQuery = "SELECT COUNT(*) AS NUMBER FROM `login_history`";
       var loginHistoryQueryResult = db.Query(loginHistoryQuery);

       cpe.log(SerialNumber + ':' + 'Rows -> ' + loginHistoryQueryResult[0].NUMBER + ' found in login_history');

       if (parseInt(loginHistoryQueryResult[0].NUMBER) > parseInt(targetLine)) {
              cpe.log(SerialNumber + ':' + 'Rows -> ' + loginHistoryQueryResult[0].NUMBER + ' too much data in login_history, going to delete by half order by ASC');

              try {
                     var targetLineToDelete = parseInt(targetLine / 2);
                     var targetLineToDeleteQuery = "DELETE FROM `login_history` order by login_time ASC limit " + targetLineToDelete + ";";

                     db.Update(targetLineToDeleteQuery);

                     cpe.log(SerialNumber + ':' + 'Delete from login_history finished');
              } catch (e) {
                     cpe.log(SerialNumber + ':' + 'Something wrong when delete login_history data, message -> ' + e.message);
              }
       }

}
/*Foxconn_E-20180323-Wilson add */
for (i = 0; i < cpe.Inform.ParameterList.length; i++) {

       if (cpe.Inform.ParameterList[i].Name == RootDev + '.DeviceInfo.ProvisioningCode') {
              cpedb.ProvisioningCode = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.ManagementServer.ParameterKey') {
              cpedb.pKey = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DeviceInfo.SoftwareVersion') {
              cpedb.SoftwareVersion = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DeviceInfo.HardwareVersion') {
              cpedb.HWVersion = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.ManagementServer.ConnectionRequestURL') {
              cpedb.ConnectionRequestURL = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.IP.Interface.1.IPv4Address.2.IPAddress') {
              cpedb.IPAddress = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.Services.FAPService.1.FAPControl.LTE.OpState') {
              cpedb.OpState = cpe.Inform.ParameterList[i].Value;
              if (cpedb.OpState == false || cpedb.OpState == 0) {
                     cpedb.OpState = 0;
              } else {
                     cpedb.OpState = 1;
              }
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity') {
              cpedb.cpeCid = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.Services.FAPService.1.FAPControl.LTE.RFTxStatus') {
              cpedb.RFTxStatus = cpe.Inform.ParameterList[i].Value;
              if (cpedb.RFTxStatus == false || cpedb.RFTxStatus == 0) {
                     cpedb.RFTxStatus = 0;
              } else {
                     cpedb.RFTxStatus = 1;
              }
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.FaultMgmt.CurrentAlarmNumberOfEntries') {
              cpedb.CurrentAlarmNum = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.AccessPoint.APN1') {
              cpedb.AccessPoint_APN1 = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.AccessPoint.APN2') {
              cpedb.AccessPoint_APN2 = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.Web.ManagementInterfaceIP') {
              cpedb.Web_ManagementInterfaceIP = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DHCPv4.Server.Enable') {
              cpedb.DHCPv4Server_Enable = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DHCPv4.Server.Pool.1.SubnetMask') {
              cpedb.Pool_SubnetMask = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DHCPv4.Server.Pool.1.MaxAddress') {
              cpedb.Pool_MaxAddress = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.DHCPv4.Server.Pool.1.MinAddress') {
              cpedb.Pool_MinAddress = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.ManagementServer.URL') {
              cpedb.ManagementServer_URL = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.Routing.Router.1.Enable') {
              cpedb.Router_Enable = cpe.Inform.ParameterList[i].Value;
       }
       //20180926, Darren, handle for signal quality reading from inform request if any.
       else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.LTENetwork.RSRP') {
              cpedb.RSRP = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.LTENetwork.RSRQ') {
              cpedb.RSRQ = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.LTENetwork.RSSI') {
              cpedb.RSSI = cpe.Inform.ParameterList[i].Value;
       } else if (cpe.Inform.ParameterList[i].Name == RootDev + '.X_FOXCONN_MGMT.LTENetwork.SINR') {
              cpedb.SINR = cpe.Inform.ParameterList[i].Value;
       }
       //   else if(cpe.inform.ParameterList[i].Name==RootDev+'.Services.FAPService.1.SAS.USER_ID')
       //   {
       //            cpedb.USER_ID = cpe.Inform.ParameterList[i].Value;
       //            cpe.log(cpedb.USER_ID);
       //   }
}

/* 2019/01/16, Darren, Set java entry for log limit check point. */
logLimitCheck(1000000);

if (hclass == 'DTU_5GHZ') 
{
       call(cpedb.DTU_Provision_Script);
       
} else if (hclass == 'FAP_FC4008' || hclass == 'FAP_FC4064' || hclass == 'sXGP_FAP_FC4064') {

       if (cpedb.cpeCid == 'undefined') {
              var getParameters = new Array();
              getParameters[0] = RootDev + '.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity';
              try {
                     var response = cpe.GetParameterValues(getParameters);
                     //print parameter values                                                            
                     cpe.log(SerialNumber + ':' + 'Got ' + response.length + ' Parameter Values response');
                     for (i = 0; i < response.length; i++) {
                            // func_logSave('  '+response[i].name+'='+response[i].value);    
                            //cpe.log(SerialNumber+':'+'  '+response[i].name+'='+response[i].value);                
                            if (response[i].name == RootDev + '.Services.FAPService.1.CellConfig.LTE.RAN.Common.CellIdentity') {
                                   cpedb.cpeCid = response[i].value;
                                   break;
                            }
                     }
              } catch (e) {
                     tryCatch = 1;
                     catchMessage(e);
              }
              //2018/11/23, Darren, set array to null for memory release.
              getParameters = null;
       }

       if (tryCatch == 0) {
              /* Get CPE BTS LCR from CID  */
              cpedb.cpeLCR = cpedb.cpeCid % 256;
              cpedb.cpeBTS = (cpedb.cpeCid - cpedb.cpeLCR) / 256;

              for (i = 0; i < cpe.Inform.Event.length; i++) {
                     if (cpe.Inform.Event[i].EventCode == 'X FOXCONN ALARM') {
                            gotAlarm = 1;
                            //cpe.log(SerialNumber+':'+'Default - Got  X FOXCONN ALARM');
                     }
                     if (cpe.Inform.Event[i].EventCode == '4 VALUE CHANGE') {
                            gotValueChange = 1;
                            //cpe.log(SerialNumber+':'+'Default - Got  4 VALUE CHANGE');
                     }
                     if (cpe.Inform.Event[i].EventCode == '2 PERIODIC') {
                            gotPeriodicInform = 1;
                            //cpe.log(SerialNumber+':'+'Default - Got  2 PERIODIC');
                     }
                     if (cpe.Inform.Event[i].EventCode == '1 BOOT') {
                            gotBootEvent = 1;
                            //cpe.log(SerialNumber+':'+'Default - Got  1 BOOT');
                     }
                     if (cpe.Inform.Event[i].EventCode == '0 BOOTSTRAP') {
                            gotBootStrapEvent = 1;
                            //cpe.log(SerialNumber+':'+'Default - Got  0 BOOTSTRAP');
                     }
                     //20180927, Darren, handle for connection request.
                     if (cpe.Inform.Event[i].EventCode == '6 CONNECTION REQUEST') {
                            gotConnectionRequestEvent = 1;
                            cpe.log(SerialNumber + ':' + 'Got 6 CONNECTION REQUEST');
                     }
              }

              try {
                     var sql_query = "SELECT * FROM `" + cpedb.DeviceTypeDB + "` WHERE `oui` = '" + oui_ID + "' AND `hclass` = '" + hclass + "' AND `manufacturer` = '" + manufacturer + "' AND `version` = '" + cpedb.HWVersion + "' ;";
                     //cpe.log(SerialNumber+':'+sql_query);
                     var DTrs = db.Query(sql_query);
                     //cpe.log(SerialNumber+':'+'Rows found in Device Type DB is = '+DTrs.length);

                     if (DTrs.length == 1) {
                            cpedb.DeviceType = DTrs[0].DisplayName;
                            //cpe.log(SerialNumber+':'+'Device Type is '+cpedb.DeviceType);
                     } else {
                            mismatchDeviceType = 1; //Foxconn 20171205 jay add
                            func_logSave('HeNB Inform', 'fail', 'Unknown HeNB device type, please check if device is in device type list', '', 'System');
                     }
              } catch (e) {
                     func_log("DS exception: " + e.message);
                     func_logSave('HeNB Inform', 'fail', '[System exception] ' + e.message, '', 'System');
                     cpe.log('HeNB Inform', 'fail', '[System exception] ' + e.message, '', 'System')
              }

              try {
                     var sql_query = "SELECT * FROM `" + cpedb.SubscriptionDB + "` WHERE `SN` = '" + SerialNumber + "';";
                     //cpe.log(SerialNumber+':'+sql_query);
                     var rs = db.Query(sql_query);

                     //cpe.log(SerialNumber+':'+'Rows found in '+ cpedb.SubscriptionDB+ ' DB is = '+rs.length);
                     if (rs.length == 1) {
                            cpedb.ServiceName = rs[0].ServiceName;
                            cpedb.BTS = (rs[0].BTS_ID).replace(/^\D+/g, '');
                            cpedb.LCR = rs[0].LCR_ID;
                            cpedb.County = rs[0].County;
                            cpedb.City = rs[0].City;
                            cpedb.Address = rs[0].Address;
                            cpedb.area = rs[0].Area;
                            cpedb.EnableService = rs[0].Enable;

                            cpedb.UserName = rs[0].Username;

                            var subscriptionHeNBSN = rs[0].SN;
                            var subscriptionHeNBCount = rs[0].ProvisionDoneKey;
                            var ConnreqUname = rs[0].ConnreqUname;
                            var ConnreqPass = rs[0].ConnreqPass;

                            cpedb.CellIdentity = eval(cpedb.BTS.valueOf() + "*256+" + rs[0].LCR_ID.valueOf());
                            //cpe.log(SerialNumber+':'+'BTS_ID='+rs[0].BTS_ID+' BTS='+cpedb.BTS+' LCR='+cpedb.LCR+' CellIdentity='+cpedb.CellIdentity);

                            cpedb.CBC = rs[0].BTS_ID + "_" + rs[0].LCR_ID + "|" + rs[0].MME_IP;
                            cpedb.CBC2 = rs[0].Latitude + "|" + rs[0].Longitude + "|" + rs[0].TAC + "|" + cpedb.CellIdentity;

                            //Cell_name|MME_name or IP|MCC|MNC|latitude|longitude|TAC|ECI
                            //LN100001_11|172.28.41.137|466|05|25.0461960|121.5165480|11001|25600273

                            if (ConnreqUname == "" || ConnreqUname == null || ConnreqPass == "" || ConnreqPass == null) {
                                   // Set the ConnreqUname ConnreqPass
                                   ConnreqUname = cpedb.DeviceType + '_' + SerialNumber;
                                   ConnreqPass = cpedb.BTS + '_' + cpedb.LCR + '_' + SerialNumber;

                                   if (rs.length == 1) {
                                          var sql_update = "UPDATE " + cpedb.SubscriptionDB + " SET ConnreqUname = '" + ConnreqUname + "', ConnreqPass= '" + ConnreqPass + "' WHERE SN = '" + SerialNumber + "';";

                                          //cpe.log(SerialNumber+':'+'Assign ConnreqUname and ConnreqPass SQL cmd is = '+ sql_update);
                                          db.Update(sql_update);
                                          //cpe.log(SerialNumber+':'+'update ConnreqUname= '+ConnreqUname+', ConnreqPass = '+ConnreqPass+' to '+cpedb.SubscriptionDB+' DB done');
                                   }
                            }
                            cpedb.ConnreqUname = ConnreqUname;
                            cpedb.ConnreqPass = ConnreqPass;
                     } else {
                            func_logSave('HeNB Inform', 'fail', 'Unsubscribed HeNB or duplicated serial number found, please check subscription setting', '', 'System');
                     }
              } catch (e) {
                     func_log("DS exception: " + e.message);
                     func_logSave('HeNB Inform', 'fail', '[System exception] ' + e.message, '', 'System');
                     cpe.log('HeNB Inform', 'fail', '[System exception] ' + e.message, '', 'System');
              }

              if (cpedb.ServiceName != "undefined") {
                     try {
                            var sql_query = "SELECT * FROM `" + cpedb.ServiceDB + "` WHERE `name` = '" + cpedb.ServiceName + "';"
                            //cpe.log(SerialNumber+':'+sql_query);
                            var ServiceRs = db.Query(sql_query);

                            //cpe.log(SerialNumber+':'+'Rows found in '+cpedb.ServiceDB+' DB is = '+ServiceRs.length);
                            if (ServiceRs.length == 1) {
                                   cpedb.SwName = ServiceRs[0].SW_Version;
                                   //cpedb.ProvDoneKey   = ServiceRs[0].ProvDoneKey;
                                   var serviceHeNBProvisionKey = ServiceRs[0].ProvDoneKey;
                                   cpedb.ServiceCfg = ServiceRs[0].Cfg;
                                   cpedb.ServiceTmpCfg = func_TmpCfgGet(cpedb.ServiceCfg);
                                   Service_deviceType = ServiceRs[0].DeviceType; //Foxconn 20171205 jay add

                                   if (cpedb.DeviceType != Service_deviceType) {
                                          cpe.log(SerialNumber + ':' + 'DeviceType in Sercice profile=' + ServiceRs[0].DeviceType + ', Device Type=' + cpedb.DeviceType);
                                          mismatchDeviceType = 1;
                                   }

                                   //cpe.log(SerialNumber+':'+'ServiceTmpCfg='+cpedb.ServiceTmpCfg);
                                   /*
                                   var PLMNID= func_getCfgValue(  cpedb.ServiceCfg ,  "PLMNID");
                                   var mcc=PLMNID.substring(0,3);
                                   var mnc=PLMNID.substring(3);
                                   cpedb.CBC= cpedb.CBC+"|"+mcc+"|"+mnc+"|"+cpedb.CBC2;
                                   */
                            } else if (ServiceRs.length == 0)
                                   func_logSave('HeNB Inform', 'fail', 'HeNB service configuation is not found, please check service setting', '', cpedb.UserName);
                            else
                                   func_logSave('HeNB Inform', 'fail', 'HeNB service configuration is not unique, please check service setting', '', cpedb.UserName);
                     } catch (e) {
                            func_log("DS exception: " + e.message);
                            func_logSave('HeNB Inform', 'fail', '[System exception] ' + e.message, '', cpedb.UserName);
                            cpe.log('HeNB Inform', 'fail', '[System exception] ' + e.message, '', cpedb.UserName);
                     }
              }

              if (cpedb.SwFileDB != "undefined" && cpedb.SwName != "undefined") {
                     try {
                            var sql_query = "SELECT * FROM `" + cpedb.SwFileDB + "` WHERE `swname` = '" + cpedb.SwName + "';"
                            //cpe.log(SerialNumber+':'+sql_query);        
                            var swInvRs = db.Query(sql_query);
                            //cpe.log(SerialNumber+':'+'Rows found in '+cpedb.SwFileDB+' DB is = '+swInvRs.length);

                            if (swInvRs.length == 1) {
                                   cpedb.targetVesion = swInvRs[0].version;
                                   cpedb.targetFileName = swInvRs[0].filename;
                                   cpedb.FmugURL = swInvRs[0].url;
                                   cpedb.fmugUsername = swInvRs[0].username;
                                   cpedb.fmugPassword = swInvRs[0].password;
                            } else if (swInvRs.length == 0)
                                   func_logSave('HeNB Inform', 'fail', 'HeNB default software version is not found, pleaes check software inventory setting', '', cpedb.UserName);
                            else
                                   func_logSave('HeNB Inform', 'fail', 'HeNB default software version is not unique, please check software inventory setting', '', cpedb.UserName);
                     } catch (e) {
                            func_log("DS exception: " + e.message);
                            func_logSave('HeNB Inform', 'fail', '[System exception] ' + e.message, '', cpedb.UserName);
                            cpe.log('HeNB Inform', 'fail', '[System exception] ' + e.message, '', cpedb.UserName);
                     }
              }

              //20181112, Darren, seamless compatible solution for new provision done key.
              if (subscriptionHeNBCount == "") {
                     cpedb.ProvDoneKey = serviceHeNBProvisionKey + "_" + subscriptionHeNBSN + "_" + subscriptionHeNBCount;
              } else {
                     cpedb.ProvDoneKey = serviceHeNBProvisionKey + "_" + subscriptionHeNBSN + "_" + subscriptionHeNBCount;
              }

              cpe.log(SerialNumber + ':' + 'Current cpedb.ProvDoneKey -> ' + cpedb.ProvDoneKey);

              /*Foxconn_S-20180323-Wilson comment*/
              /*
              cpe.log(SerialNumber+':'+'ProvisioningCode     = '+cpedb.ProvisioningCode     );
              cpe.log(SerialNumber+':'+'pKey                 = '+cpedb.pKey                 );
              cpe.log(SerialNumber+':'+'SoftwareVersion      = '+cpedb.SoftwareVersion      );
              cpe.log(SerialNumber+':'+'HardWareVersion      = '+cpedb.HWVersion            );
              cpe.log(SerialNumber+':'+'ConnectionRequestURL = '+cpedb.ConnectionRequestURL );
              cpe.log(SerialNumber+':'+'IPAddress            = '+cpedb.IPAddress            );
              cpe.log(SerialNumber+':'+'OpState              = '+cpedb.OpState              );
              cpe.log(SerialNumber+':'+'CellIdentity         = '+cpedb.cpeCid          );
              cpe.log(SerialNumber+':'+'RFTxStatus           = '+cpedb.RFTxStatus           );
              cpe.log(SerialNumber+':'+'CurrentAlarmNum      = '+cpedb.CurrentAlarmNum      );
              cpe.log(SerialNumber+':'+'DeviceType           = '+cpedb.DeviceType           );
              cpe.log(SerialNumber+':'+'ProvDoneKey          = '+cpedb.ProvDoneKey          );
              cpe.log(SerialNumber+':'+'targetVesion         = '+cpedb.targetVesion         );
              cpe.log(SerialNumber+':'+'ServiceCfg           = '+cpedb.ServiceCfg           );
              cpe.log(SerialNumber+':'+'ServiceName          = '+cpedb.ServiceName          );
              cpe.log(SerialNumber+':'+'BTS                  = '+cpedb.cpeBTS               );
              cpe.log(SerialNumber+':'+'LCR                  = '+cpedb.cpeLCR               );
              cpe.log(SerialNumber+':'+'County               = '+cpedb.County               );
              cpe.log(SerialNumber+':'+'City                 = '+cpedb.City                 );
              cpe.log(SerialNumber+':'+'Address              = '+cpedb.Address              );

            cpe.log(SerialNumber+':'+'FeMS_URL             = '+cpedb.FeMS_URL             );
            cpe.log(SerialNumber+':'+'FeMS_USER            = '+cpedb.FeMS_USER            );
            cpe.log(SerialNumber+':'+'FeMS_PASS            = '+cpedb.FeMS_PASS            );
            cpe.log(SerialNumber+':'+'NTP_TIMEZONE         = '+cpedb.NTP_TIMEZONE         );
            cpe.log(SerialNumber+':'+'DEVICE_ADDR_TYPE     = '+cpedb.DEVICE_ADDR_TYPE     );
            cpe.log(SerialNumber+':'+'REM_PLMN_LIST        = '+cpedb.REM_PLMN_LIST        );
            cpe.log(SerialNumber+':'+'REM_BAND_LIST        = '+cpedb.REM_BAND_LIST        );
            cpe.log(SerialNumber+':'+'REM_ARFCNDL_LIST     = '+cpedb.REM_ARFCNDL_LIST     );
            cpe.log(SerialNumber+':'+'SHARE_RAN_ENABLE     = '+cpedb.SHARE_RAN_ENABLE     );
            cpe.log(SerialNumber+':'+'SHARE_RAN_IPADDR     = '+cpedb.SHARE_RAN_IPADDR     );
            cpe.log(SerialNumber+':'+'SHARE_RAN_PLMN_LIST  = '+cpedb.SHARE_RAN_PLMN_LIS   );
            cpe.log(SerialNumber+':'+'SHARE_RAN_VLAN_EN    = '+cpedb.SHARE_RAN_VLAN_EN    );
            cpe.log(SerialNumber+':'+'SHARE_RAN_VLAN_TAG   = '+cpedb.SHARE_RAN_VLAN_TAG   );
            cpe.log(SerialNumber+':'+'SYNC_BAND_LIST       = '+cpedb.SYNC_BAND_LIST       );
            cpe.log(SerialNumber+':'+'SYNC_EARFCN_LIST     = '+cpedb.SYNC_EARFCN_LIST     );
            cpe.log(SerialNumber+':'+'SYNC_RF_OFF_EN       = '+cpedb.SYNC_RF_OFF_EN       );
            cpe.log(SerialNumber+':'+'SYNC_TF_SYNC_RF_EN   = '+cpedb.SYNC_TF_SYNC_RF_EN   );

cpe.log('');
       */
              /*Foxconn_S-20180323-Wilson modify */

              // Set current alarm "reboot" flag to 1 if device bootup

              //20181129, Darren, unlock alarm section.


              if (cpedb.currAlarmDB) {
                     var sql_update_currAlarm = "";
                     if (gotBootEvent == 1) {
                            sql_update_currAlarm = "UPDATE `" + cpedb.currAlarmDB + "` SET `reboot` = '1', `Username` = '" + cpedb.UserName + "' WHERE `reboot` = '0' AND `AlarmIdentifier` like '\%" + SerialNumber + "\%' ;";
                     } else if (gotBootStrapEvent == 1) {
                            sql_update_currAlarm = "UPDATE `" + cpedb.currAlarmDB + "` SET `reboot` = '2', `Username` = '" + cpedb.UserName + "' WHERE `reboot` = '0' AND `AlarmIdentifier` like '\%" + SerialNumber + "\%' ;";
                     }

                     if (sql_update_currAlarm.length > 0) {
                            try {
                                   //cpe.log(SerialNumber+':'+'SQL cmd is = '+ sql_update_currAlarm);
                                   db.Update(sql_update_currAlarm);
                            } catch (e) {
                                   func_log("DS exception: " + e.message);
                                   func_logSave('Recv Inform', 'fail', e.message, '', cpedb.UserName);
                            }
                     }
              }

              if (gotAlarm == 1) {
                     call(cpedb.AlarmMagmt_Script);
                     func_logSave('Alarm', 'Success', 'Alarm received from HeNB', '', cpedb.UserName);
              }

              //jjj
              var cpe_sql_query = "SELECT * FROM `" + cpedb.CpeListDB + "` WHERE `SN` = '" + SerialNumber + "';";
              var DMSql = db.Query(cpe_sql_query);

              if (DMSql.length != 0) {
                     //jjj we should comment here ?
                     cpedb.cpeEntryCount = DMSql.length;
                     cpedb.cpeListStatus = DMSql[0].Status;
                     cpedb.AdminState = DMSql[0].AdminState;
                     cpedb.DB_DefGwMac = DMSql[0].DefGwMac;
                     cpedb.DB_InterRATCell = DMSql[0].InterRATCell;
                     cpedb.MaxTxPower = DMSql[0].MaxTxPowerInUse;
              }

              if (cpedb.cpeStatus != 'undefined')
                     cpe.log(SerialNumber + ': ----> fems_Default: cpedb.pKey = ' + cpedb.pKey + ', cpedb.cpeStatus = ' + cpedb.cpeStatus + '<----');
              /* Foxconn 20180117 jay add en d */

              pKey = cpedb.pKey;
              cpedb.ForceFMUG = 'FALSE';

              if (cpedb.ServiceName == "undefined" || cpedb.SwName == "undefined") {
                     cpedb.cpeStatus = "Unsubscribed";
                     cpe.log(SerialNumber + ': Default - Device is Unsubscribed');
                     call(cpedb.CPE_List_Script);
              } else if (pKey == 'FWUpgrade-Step1') {
                     //cpe.log(SerialNumber+': Default - pKey is related to FWUpgrade' );
                     func_logSave('Firmware Upgrade', 'Processing', 'Current Key -> ' + pKey, '', cpedb.UserName);
                     cpedb.cpeStatus = "Provisioning";
                     //2018/11/26, Darren, dequeue at FW mismatch state to prevent queue freezed on FeMS UI.
                     cpe.log(SerialNumber + ' : ' + 'Going to dequeue on FW mismatched situation [fems_Default.js : 607]');
                     call(cpedb.CPE_Mgmt_Script);
                     call(cpedb.CPE_List_Script);
                     call(cpedb.FMUG_Script);
              } else if (pKey == 'LTE_FIOS_STEP2_1' || pKey == 'LTE_FIOS_STEP2' || pKey == 'LTE_FIOS_STEP3' || pKey == 'LTE_FIOS_STEP4' || pKey == 'LTE_FIOS_STEP6') {
                     //cpe.log(SerialNumber+': Default - pKey is related to Provisioning' );
                     func_logSave('Provisioning', 'Processing', 'Current Key -> ' + pKey, '', cpedb.UserName);
                     cpedb.cpeStatus = "Provisioning";
                     //20181026, Darren, remove this function due to it will cause unnecessary queue.
                     //func_deleteUnsubscribedResetDefault();/* Foxconn 20171024 jay add: Delete Unsubscribe-reset-to-default from cpedb.ActionQDB */
                     call(cpedb.CPE_List_Script);
                     //20190412, Darren, shall not dequeue while in provision.
                     //call(cpedb.CPE_Mgmt_Script);  
                     call(cpedb.Provision_Script);
              }
              /* Foxconn 20171024 jay add */
              else if (mismatchDeviceType == 1) {
                     //cpe.log(SerialNumber+': Default - Device type is mismatched' );
                     func_logSave('Provisioning', 'fail', 'HeNB device type mismatched. Device Type in service profile is ' + Service_deviceType + ', please check service setting', '', cpedb.UserName);
                     cpedb.cpeStatus = "DeviceMismatch"; /*Foxconn_S-20180323-Wilson modify */
                     cpedb.pKey = "Processing-Fail";
                     call(cpedb.CPE_List_Script);
              }
              /* Foxconn 20171024 jay add end*/
              else {
                     if (cpedb.SoftwareVersion != cpedb.targetVesion) {
                            //cpe.log(SerialNumber+': Default - SW version is not the same, trigger FW upgrade. SoftwareVersion='+cpedb.SoftwareVersion+':targetVesion='+cpedb.targetVesion);  
                            func_logSave('Firmware Upgrade', 'Processing', 'Software version is different from HeNB and the version in software inventory, Firmware Upgrade start immediately', '', cpedb.UserName);
                            cpedb.ForceFMUG = 'TRUE';
                            cpedb.cpeStatus = "Provisioning";
                            //2018/11/26, Darren, dequeue at FW mismatch state to prevent queue freezed on FeMS UI.
                            cpe.log(SerialNumber + ' : ' + 'Going to dequeue on FW mismatched situation [fems_Default.js : 638]');
                            call(cpedb.CPE_Mgmt_Script);
                            call(cpedb.CPE_List_Script);
                            call(cpedb.FMUG_Script);
                     } else if (pKey == cpedb.ProvDoneKey) {
                            cpe.log(SerialNumber + ': Default - Provision is done');

                            //20180821, fox, Darren, change RFTxStatus to adminState.
                            if (cpedb.AdminState == true || cpedb.AdminState == 1) {
                                   cpedb.cpeStatus = "Active";
                                   cpedb.RFTxStatus = 1;
                            } else {
                                   cpedb.cpeStatus = "Inactive";
                                   cpedb.RFTxStatus = 0;
                            }
                            //2018/11/20, Darren, remove service configuration.
                            /*
                            if(cpedb.ServiceTmpCfg!="")
                            {
                            cpedb.setKey=cpedb.pKey;
                            cpedb.multiParamCfg = cpedb.ServiceTmpCfg;
                            call("fems_parameters_Cfg");
                            func_logSave('Set Parameter Value', 'Success', 'Apply HeNB service configuration', '', 'Script fems_Default');
                            }
                            */

                            if (cpedb.MobilityCfgGet == "Enable") {
                                   call('fems_device_Cfg_Get');
                            }
                            //20181026, Darren, add connection request event to protect provision interval.
                            if (gotConnectionRequestEvent == 1) {
                                   call(cpedb.CPE_Mgmt_Script);
                                   call(cpedb.CPE_List_Script);
                            } else {
                                   //20190412, Darren, shall not dequeue while in provision.
                                   //call(cpedb.CPE_Mgmt_Script);
                                   call(cpedb.CPE_List_Script);
                                   call(cpedb.Provision_Script);
                            }

                     } else {
                            func_logSave('Provisioning', 'Processing', 'HeNB Provision start', '', cpedb.UserName);
                            cpedb.cpeStatus = "Provisioning";
                            call(cpedb.CPE_List_Script);
                            call(cpedb.Provision_Script);
                     }
              }
       }
}

cpe.log('////////////////' + SerialNumber + ' : ' + 'Script fems_Default End \\\\\\\\\\\\\\\\');