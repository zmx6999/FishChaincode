const RegisterUser=require("./tools/registerUser");
var path = require('path');
RegisterUser({
    port:7054,
    ca:"ca0.example.com",
    mspid:"Org1MSP",
    admin:"admin",
    username:"user1",
    affiliation: 'org1.department1',
    store_path:path.join(__dirname, 'hfc-key-store/Org1MSP')
});
