const EnrollAdmin=require("./tools/enrollAdmin");
var path = require('path');
EnrollAdmin({
    port:7054,
    ca:"ca0.example.com",
    mspid:"Org1MSP",
    admin:"admin",
    adminpw:"adminpw",
    store_path:path.join(__dirname, 'hfc-key-store/Org1MSP')
});
