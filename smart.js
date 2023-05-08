// Importation des bibliothèques
const { Client, AccountId, PrivateKey, ContractCreateTransaction, ContractFunctionParams, ContractCallQuery } = require("@hashgraph/sdk");
const fs = require('fs');

// Définition des informations du compte
const MY_ACCOUNT_ID = '0.0.4579928';
const MY_PRIVATE_KEY = '3030020100300706052b8104000a042204207140246fdaa3b10a51db8e07cecd22664b19d9dff000e9b7c0d8298d790b4924';

// Définition de l'adresse du smart contract
const CONTRACT_ADDRESS = "0.0.12345";

// Récupération du bytecode du smart contract
const bytecode = fs.readFileSync('HelloHedera.json').toString();

// Création du client Hedera
const client = Client.forTestnet();

// Définition de la clé privée du compte
const myPrivateKey = PrivateKey.fromString(MY_PRIVATE_KEY);

// Définition de l'identifiant du compte
const myAccountId = AccountId.fromString(MY_ACCOUNT_ID);

// Connexion au compte
client.setOperator(myAccountId, myPrivateKey);

async function main() {
    try {
        // Définition de la transaction pour le déploiement du smart contract
        const contractCreateTransaction = new ContractCreateTransaction()
            .setGas(2000000)
            .setBytecode(bytecode)
            .setAdminKey(myPrivateKey.publicKey)
            .setInitialBalance(10);

        // Signature et envoi de la transaction de déploiement du smart contract
        const txResponse = await contractCreateTransaction.execute(client);

        // Récupération du reçu de la transaction
        const contractId = await txResponse.getContractId();

        console.log(`Smart contract deployed, address: ${contractId}`);

        // Appel de la fonction get_address
        const contractCallQuery = new ContractCallQuery()
            .setContractId(contractId)
            .setGas(1000)
            .setFunction("get_address", null);

        // Récupération de la réponse de la fonction get_address
        const address = await contractCallQuery.execute(client);

        console.log(`Current address: ${address}`);

        // Appel de la fonction set_address pour changer l'adresse
        const newAddress = "0.0.123456";

        const params = new ContractFunctionParams()
            .addAddress(newAddress);

        const contractExecuteTransaction = await new ContractExecuteTransaction()
            .setContractId(contractId)
            .setGas(100000)
            .setFunction("set_address", params)
            .execute(client);

        console.log(`Set new address to ${newAddress}`);

        // Appel de la fonction get_address pour vérifier la modification
        const updatedAddress = await contractCallQuery.execute(client);

        console.log(`Updated address: ${updatedAddress}`);
    } catch (error) {
        console.log(error);
    } finally {
        client.close();
    }
}

main();