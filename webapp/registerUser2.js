const RegisterUser=require("./tools/registerUser");
var path = require('path');
RegisterUser({
    port:8054,
    ca:"ca1.example.com",
    mspid:"Org2MSP",
    admin:"admin",
    username:"user1",
    affiliation: 'org2.department1',
    store_path:path.join(__dirname, 'hfc-key-store/Org2MSP')
});
