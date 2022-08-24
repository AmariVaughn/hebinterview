
const config={
    user:'root',
    password:'',
    server:'127.0.0.1',
    database:'Images',
    driver: "mssql",
    options:{

        trustedconnection:true,
        enableArithAbort:true,
        instancename:'SQLEXPRESS'
    },
    port: 55892

}

export default {config:config};