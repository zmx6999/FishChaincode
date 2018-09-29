const EnrollAdmin=require("./tools/enrollAdmin");
var path = require('path');
EnrollAdmin({
    port:8054,
    ca:"ca1.example.com",
    mspid:"Org2MSP",
    admin:"admin",
    adminpw:"adminpw",
    store_path:path.join(__dirname, 'hfc-key-store/Org2MSP')
});
