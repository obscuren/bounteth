var basePath;

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
    defaultTime: defaultTime,
    basePath: function() {
        if( basePath === undefined ) {
            basePath = BountyProgram.basePath();
        }
        return basePath;
    },
});

Template.bounty.helpers({
    issueUrl: function(issueNumber) {
        if( basePath === undefined ) {
            basePath = BountyProgram.basePath();
        }
        return "https://github.com/"+basePath+"/issues/"+issueNumber;
    },
});
