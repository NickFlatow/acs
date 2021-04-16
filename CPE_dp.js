cpe.log('////////////////' + SerialNumber + ' : ' + 'Run script DOMAIN_PROXY SCRIPT \\\\\\\\\\\\\\\\');
//set cpdbd.sasStatus

function test()
{

    var sql = "SELECT sasStage FROM dp_device_info WHERE `SN` = '"+ SerialNumber +"';";
    cpe.log(sql)
    a = db.Query(sql);
    cpe.log(a[0].sasStage);


    if (a[0].sasStage == "unreg")
    {
        cpe.log("\n\n\n\n\n winning \n\n\n\n\n")
        return true;
    }
    else
    {
        cpe.log("\n\n\n\n\n\n It's okay to cry \n\n\n\n\n\n");
        return false;
    }
}