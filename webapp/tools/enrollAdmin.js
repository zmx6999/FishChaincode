'use strict';
/*
* Copyright IBM Corp All Rights Reserved
*
* SPDX-License-Identifier: Apache-2.0
*/
/*
 * Enroll the admin user
 */

var Fabric_Client = require('fabric-client');
var Fabric_CA_Client = require('fabric-ca-client');
module.exports = function (options) {
    var fabric_client = new Fabric_Client();
    var fabric_ca_client = null;
    var admin_user = null;
    var store_path=options.store_path;
    console.log(' Store path:'+store_path);

    // create the key value store as defined in the fabric-client/config/default.json 'key-value-store' setting
    Fabric_Client.newDefaultKeyValueStore({ path: store_path
    }).then((state_store) => {
        // assign the store to the fabric client
        fabric_client.setStateStore(state_store);
        var crypto_suite = Fabric_Client.newCryptoSuite();
        // use the same location for the state store (where the users' certificate are kept)
        // and the crypto store (where the users' keys are kept)
        var crypto_store = Fabric_Client.newCryptoKeyStore({path: store_path});
        crypto_suite.setCryptoKeyStore(crypto_store);
        fabric_client.setCryptoSuite(crypto_suite);
        var	tlsOptions = {
            trustedRoots: [],
            verify: false
        };
        // be sure to change the http to https when the CA is running TLS enabled
        fabric_ca_client = new Fabric_CA_Client('http://localhost:'+options.port, tlsOptions , options.ca, crypto_suite);

        // first check to see if the admin is already enrolled
        return fabric_client.getUserContext(options.admin, true);
    }).then((user_from_store) => {
        if (user_from_store && user_from_store.isEnrolled()) {
            console.log('Successfully loaded admin from persistence');
            admin_user = user_from_store;
            return null;
        } else {
            // need to enroll it with CA server
            return fabric_ca_client.enroll({
                enrollmentID: options.admin,
                enrollmentSecret: options.adminpw
            }).then((enrollment) => {
                console.log('Successfully enrolled admin user "'+options.admin+'"');
                return fabric_client.createUser(
                    {username: options.admin,
                        mspid: options.mspid,
                        cryptoContent: { privateKeyPEM: enrollment.key.toBytes(), signedCertPEM: enrollment.certificate }
                    });
            }).then((user) => {
                admin_user = user;
                return fabric_client.setUserContext(admin_user);
            }).catch((err) => {
                console.error('Failed to enroll and persist admin. Error: ' + err.stack ? err.stack : err);
                throw new Error('Failed to enroll admin');
            });
        }
    }).then(() => {
        console.log('Assigned the admin user to the fabric client ::' + admin_user.toString());
    }).catch((err) => {
        console.error('Failed to enroll admin: ' + err);
    });
};
