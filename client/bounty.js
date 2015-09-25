Bounties = new Mongo.Collection("bounties", {connection: null});
new PersistentMinimongo(Bounties, "ethereum_bounties-dapp");

contractAddress = "0x5e8a03575a828396e080f31a7ecf4dad3c4f5501";
BountyProgram = TrackerContract.at(contractAddress);

Meteor.startup(function() {
    var newBountyFilter = BountyProgram.NewBounty({}, {fromBlock:0, toBlock:"latest"});
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
            Bounties.upsert({bountyId: id}, {bounty: bounty, status: "open", claimer: "none", reviews: 0, title: title, id: id});
        });
    });

    // UPDATE BOUNTY
    var updateBountyFilter = BountyProgram.ChangedBounty();
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

    // CLAIMING
    var claimFilter = BountyProgram.ClaimBounty();
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
    var successClaimFilter = BountyProgram.ClaimSuccess();
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
    var reviewFilter = BountyProgram.Review();
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
});
