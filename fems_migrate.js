cpe.log('============== Run script fems migrate ===================');
       
var paramSet1= new Array ();   

paramSet1[0]={name:'Device.ManagementServer.URL', value:'http://172.26.36.3:8080/femsacs/acs', type:'xsd:string'}; 

cpe.log('Change ACS URL to FeMs NH-FEMS-01');
cpe.SetParameterValues (paramSet1, cpedb.pkey);

cpe.log('==============  fems migrate  End===================');