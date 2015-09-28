Bounties = new Mongo.Collection("bounties", {connection: null});
Bounties.remove({});
new PersistentMinimongo(Bounties, "ethereum_bounties-dapp");

contractAddress = "0xef2d6d194084c2de36e0dabfce45d046b37d1106";
//contractAddress = "0xa3191c57b10050475829beb4099f7bc983c20dc4";
BountyProgram = TrackerContract.at(contractAddress);

Meteor.startup(function() {
    var lastBlock = localStorage["lastSeenBlock"];
    if( lastBlock === undefined ) lastBlock = 0;

    var newBountyFilter = BountyProgram.NewBounty({}, {fromBlock: lastBlock, toBlock: "latest"});
    newBountyFilter.watch(function(error, res) {
        console.log("NewBounty", res);

        if( error ) {
            console.log(error);
            return;
        }
        var bounty = res.args;
        bounty.amount = bounty.value.toString();
        Meteor.http.get("https://api.github.com/repos/ethereum/go-ethereum/issues/"+bounty.number.toString(), {timeout: 2000}, function(e, res) {
            var title;
            var id = bounty.number.toString();
            if( e ) {
                console.log("error doing GH API call", e);
                title = "Github issue " + id;
            } else {
                title = res.data.title;
            }
            Bounties.upsert(id, {bounty: bounty, status: "open", claimer: "none", reviews: 0, title: title, id: id});
        });
    });

    // UPDATE BOUNTY
    var updateBountyFilter = BountyProgram.ChangedBounty({}, {fromBlock: lastBlock, toBlock: "latest"});
    updateBountyFilter.watch(function(error, res) {
        console.log("ChangedBounty", res);

        if( error ) {
            console.log(error);
            return;
        }

        var bounty = res.args;
        var id = bounty.number.toString();
        bounty.amount = bounty.value.toString();

        Bounties.update({id: id}, {
            $set: { bounty: bounty }
        });
    });

    // UPDATE BOUNTY
    var deleteBountyFilter = BountyProgram.DeletedBounty({}, {fromBlock: lastBlock, toBlock: "latest"});
    deleteBountyFilter.watch(function(error, res) {
        console.log("DeletedBounty", res);

        if( error ) {
            console.log(error);
            return;
        }

        var bounty = res.args;
        var id = bounty.number.toString();
        Bounties.remove({id: id});
    });

    // CLAIMING
    var claimFilter = BountyProgram.ClaimBounty({}, {fromBlock: lastBlock, toBlock: "latest"});
    claimFilter.watch(function(error, res) {
        console.log("ClaimBounty", res);

        if( error ) {
            console.log(error);
            return;
        }

        var bounty = res.args
        var id = bounty.number.toString();
        Bounties.update({id: id}, {
            $set: { claimer: res.args.claimer }
        });
    });

    // CLAIM SUCCESS
    var successClaimFilter = BountyProgram.ClaimSuccess({}, {fromBlock: lastBlock, toBlock: "latest"});
    successClaimFilter.watch(function(error, res) {
        console.log("SuccessClaim", res);

        if( error ) {
            console.log(error);
            return;
        }

        var bounty = res.args
        var id = bounty.number.toString();
        Bounties.update({id: id}, {
            $set: { status: "closed" }
        });
    });

    // REVIEW FILTER
    var reviewFilter = BountyProgram.Review({}, {fromBlock: lastBlock, toBlock: "latest"});
    reviewFilter.watch(function(error, res) {
        console.log("Review", res);

        if( error ) {
            console.log(error);
            return;
        }

        var bounty = res.args;
        var id = bounty.number.toString();
        if( bounty.approved ) {
            Bounties.update({id: id}, {
                $inc: { reviews: 1 }
            });
        } else {
            // TODO
        }
    });

    web3.eth.filter("latest").watch(function(e, res) {
        var block = web3.eth.getBlock(res)
        localStorage["lastSeenBlock"] = block.number;
    });
});
