const { Client, PrivateKey, AccountId } = require("@hashgraph/sdk");

// Comptes utilisés dans l'exercice
const myAccountId = "0.0.4584187";
const myPrivateKey = "302e020100300506032b6570042204206946498ac3c5c3ca9fac84ed8226906d901c369372791d7d5e3ccabd9531f524";
const myAccountId2 = AccountId.fromString("0.0.83551");
const myPrivateKey2 = PrivateKey.fromString(
    "302e020100300506032b6570042204200d957d6f37bd6a43d14d9c16f3d7a11ac3595b17f56fdd181d4d5fe75924559d"
);
const myAccountId3 = AccountId.fromString("0.0.83550");
const myPrivateKey3 = PrivateKey.fromString(
    "3030020100300706052b8104000a04220420ed7e6ae0897330ddbbd2512eb73878ddfd5f58d8cbe04307922fda8653bc7e3c"
);

async function main() {
    // Initialiser le client Hedera
    const client = Client.forTestnet();

    // Configuration des clés
    const adminPrivateKey = myPrivateKey1;
    const supplyPrivateKey = myPrivateKey2;
    const feeSchedulePrivateKey = myPrivateKey3;

    // Configuration des royalties
    const royaltyFee = {
        numerator: 5,
        denominator: 100,
    };

    // Créer une collection de NFT avec les options spécifiées
    const nft = await new TokenCreateTransaction()
        .setTokenName("Ma collection NFT")
        .setTokenSymbol("NFT")
        .setTokenType(TokenType.NON_FUNGIBLE_UNIQUE)
        .setSupplyKey(supplyPrivateKey.publicKey)
        .setAdminKey(adminPrivateKey.publicKey)
        .setFreezeKey(adminPrivateKey.publicKey)
        .setWipeKey(adminPrivateKey.publicKey)
        .setKycKey(adminPrivateKey.publicKey)
        .setSupplyType(TokenSupplyType.FINITE)
        .setMaxSupply(10)
        .setCustomFees([{
            amount: royaltyFee,
            collectorAccountId: myAccountId3,
        }, ])
        .setFeeScheduleKey(feeSchedulePrivateKey.publicKey)
        .setMemo("Mon premier NFT")
        .execute(client);

    // Attendre la confirmation de la transaction et récupérer l'identifiant du NFT créé
    const receipt = await nft.getReceipt(client);
    const tokenId = receipt.tokenId;

    // Afficher les informations du NFT créé
    console.log(`NFT créé avec l'identifiant: ${tokenId}`);
    const tokenInfo = await new TokenInfoQuery()
        .setTokenId(tokenId)
        .execute(client);
    console.log("Informations sur le NFT créé:", tokenInfo);

    // Modifier le mémo du NFT
    const updatedMemo = "Mon NFT mis à jour";
    await new TokenUpdateTransaction()
        .setTokenId(tokenId)
        .setMemo(updatedMemo)
        .execute(client);

    // Afficher les informations du NFT avec la modification effectuée
    const updatedTokenInfo = await new TokenInfoQuery()
        .setTokenId(tokenId);