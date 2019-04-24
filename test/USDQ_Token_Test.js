// test/.USDQ_Token_Test.js
const USDQToken = artifacts.require("USDQToken");

const ETHER = 10**18;
const TOKEN = 10**18;

contract("USDQToken", accounts => {

     const [firstAccount,
            secondAccount,
            thirdaccount,
            fourthaccount,
            fifthaccount,
            firstOwner,
            secondOwner,
            thirdOwner,
            fourthOwner,
            fifthOwner] = accounts;

    let stablecoin;


    beforeEach(async () => {
        stablecoin = await USDQToken.new(firstOwner, secondOwner, thirdOwner, fourthOwner, fifthOwner);
    });


    it("#1 should initialize correctly", async () => {

        assert.equal(await stablecoin.symbol.call(), "USDQ");
        assert.equal(await stablecoin.name.call(), "USDQ Stablecoin by Q DAO v1.0");

        let DEC = await stablecoin.decimals.call();
        console.log("DECIMALS -  ", DEC);
        let OWNER_LIMIT = await stablecoin.howManyOwnersDecide.call();
        console.log("how Many Owners Decide - ", OWNER_LIMIT);

        const newTokenBalance = web3.eth.getBalance(stablecoin.address);
        console.log("init balance - ", newTokenBalance)
    });


    it("#2 should transfer to Ownerships", async () => {
        await stablecoin.transferOwnership(secondAccount, secondOwner, {from: firstOwner});

        await stablecoin.transferOwnership(secondAccount, secondOwner, {from: fourthOwner});

        await stablecoin.transferOwnership(secondAccount, secondOwner, {from: fifthOwner});
        try {
            await stablecoin.transferOwnership(secondAccount, secondOwner, {from: fifthOwner});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
        await stablecoin.transferOwnership(secondAccount, secondOwner, {from: firstAccount});

        try {
            await stablecoin.transferOwnership(secondOwner, secondAccount, {from: secondOwner});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
        try {
            await stablecoin.transferOwnership(secondOwner, secondAccount, {from: thirdaccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
        try {
            await stablecoin.transferOwnership(secondOwner, secondAccount, {from: fourthaccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
        try {
            await stablecoin.transferOwnership(secondOwner, secondAccount, {from: fifthaccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await stablecoin.transferOwnership(secondOwner, secondAccount, {from: secondAccount})
    });


    it("#3 should be created 1000 stableCoins", async () => {
        try {
            await stablecoin.mint(firstOwner, 1000*ETHER, {from: firstOwner});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstOwner});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstAccount});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: thirdOwner});

        try {
            await stablecoin.mint(firstOwner, 1000*TOKEN, {from: firstOwner});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: fourthOwner});

        await stablecoin.mint(firstOwner, 1000*TOKEN, {from: firstOwner});
        assert.equal(await stablecoin.totalSupply.call(), 1000*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(firstOwner), 1000*TOKEN);
    });


    it("#4 should be born 1000 stableCoins", async () => {

        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstOwner});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstAccount});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: thirdOwner});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: fourthOwner});

        await stablecoin.mint(secondAccount, 777*TOKEN, {from: firstOwner});
        assert.equal(await stablecoin.totalSupply.call(), 777*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 777*TOKEN);

        try {
            await stablecoin.burnFrom(secondAccount, 778*TOKEN, {from: firstOwner});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await stablecoin.burnFrom(secondAccount, 777*TOKEN, {from: firstOwner});

        assert.equal(await stablecoin.totalSupply.call(), 0);
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 0);
    });


    it("#5 does not allow non-owners to call",  async () => {
        assert.equal(await stablecoin.totalSupply.call(), 0);

        try {
            await stablecoin.pause({from:secondAccount});
            await stablecoin.addAddressToGovernanceContract(thirdaccount, {from: thirdaccount});
            await stablecoin.removeAddressFromGovernanceContract(firstOwner, {from: fourthaccount});
            await stablecoin.transferOwnership(secondOwner, fifthaccount, {from: fifthaccount})
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }
    });


    it("#6 DAO should be blocked/unblocked account and blocked/unblocked tokens", async () => {

        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstOwner});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: firstAccount});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: thirdOwner});
        await stablecoin.addAddressToGovernanceContract(firstOwner, {from: fourthOwner});

        await stablecoin.mint(secondAccount, 666*TOKEN, {from: firstOwner});
        assert.equal(await stablecoin.totalSupply.call(), 666*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 666*TOKEN);

        await stablecoin.transfer(thirdaccount, 333*TOKEN, {from: secondAccount});
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 333*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(thirdaccount), 333*TOKEN);

        await stablecoin.addAddressToBlacklist(thirdaccount, {from: firstOwner});

        try {
            await stablecoin.transfer(fourthaccount, 222*TOKEN, {from: thirdaccount});
            assert.fail();
        } catch (err) {
            assert.ok(/revert/.test(err.message));
        }

        await stablecoin.removeAddressFromBlacklist(thirdaccount, {from: firstOwner});
        await stablecoin.transfer(fourthaccount, 222*TOKEN, {from: thirdaccount});
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 333*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(thirdaccount), 111*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(fourthaccount), 222*TOKEN);

        assert.equal(await stablecoin.totalSupply.call(), 666*TOKEN);
    });


    it("#7 USDQ Lender should be 'transferFrom' tokens from  account", async () => {
        // USDQ Lender = fifthaccount
        await stablecoin.addAddressToGovernanceContract(fifthaccount, {from: firstOwner});
        await stablecoin.addAddressToGovernanceContract(fifthaccount, {from: firstAccount});
        await stablecoin.addAddressToGovernanceContract(fifthaccount, {from: thirdOwner});
        await stablecoin.addAddressToGovernanceContract(fifthaccount, {from: fourthOwner});

        await stablecoin.mint(secondAccount, 666*TOKEN, {from: fifthaccount});
        assert.equal(await stablecoin.totalSupply.call(), 666*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 666*TOKEN);

        await stablecoin.transfer(thirdaccount, 333*TOKEN, {from: secondAccount});
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 333*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(thirdaccount), 333*TOKEN);

        assert.equal(await stablecoin.balanceOf.call(fifthaccount), 0);


        await stablecoin.approveForOtherContracts(secondAccount, fifthaccount, 333*TOKEN, {from: fifthaccount});
        await stablecoin.transferFrom(secondAccount, fifthaccount, 333*TOKEN, {from: fifthaccount});

        assert.equal(await stablecoin.balanceOf.call(fifthaccount), 333*TOKEN);
        assert.equal(await stablecoin.balanceOf.call(secondAccount), 0);
        assert.equal(await stablecoin.totalSupply.call(), 666*TOKEN);
    });
});