var basePath;

function formatTime(time) {
    var t = new BigNumber(0);
    t.c = time.c;
    t.e = time.e;
    t.s = time.s;
    return new Date(t.toNumber()*1000);
}

Template.body.helpers({
    bountyAddress: function() {
        return contractAddress;
    },
    bountyBalance: function() {
        return web3.fromWei(web3.eth.getBalance(contractAddress), "ether");
    },
    bounties: function() {
        console.log(Bounties.find({ status: "open" }))
        return Bounties.find({ status: "open" });
    },
    closedBounties: function() {
        return Bounties.find({ status: "closed" });
    },
    accounts: function() {
        return web3.eth.accounts;
        var accounts = [];
        var addresses = web3.eth.accounts;
        for(var i = 0; i < addresses.length; i++) {
            accounts[i] = {name: /*todo*/addresses[i], address: addresses[i]};
        }
        return addresses;
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

    formatTime: formatTime,
});
