Template.body.helpers({
    bountyAddress: function() {
        return contractAddress;
    },
    bountyBalance: function() {
        return web3.fromWei(web3.eth.getBalance(contractAddress), "ether");
    },
    bounties: function() {
        return Bounties.find({ status: "open" });
    },
    closedBounties: function() {
        return Bounties.find({ status: "closed" });
    },
    accounts: function() {
        return web3.eth.accounts;
    },
    operator: function() {
        return BountyProgram.operator.call();
    },
    defaultTime: function() {
        var day = 86400;
        return Math.floor((new Date()).getTime()/1000) + day;
    },
});
