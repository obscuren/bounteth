var address = "0x5e8a03575a828396e080f31a7ecf4dad3c4f5501";

Bounties = new Mongo.Collection("bounties");
var BountyProgram = TrackerContract.at(address);

if (Meteor.isClient) {
    Template.body.helpers({
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
            return BountyProgram.operator();
        },
    });

    Template.body.events({
        "submit .new-bounty": function(event) {
            event.preventDefault();

            BountyProgram.submitBounty.sendTransaction(event.target.issueNumber.value, {from:web3.eth.accounts[0], value: event.target.amount.value, gas: 1500000});
        },

        "submit .claim-bounty": function(event) {
            event.preventDefault();

            BountyProgram.claimBounty.sendTransaction(event.target.issueNumber.value, {from:web3.eth.accounts[0], value: web3.toWei(10, "ether"), gas: 1500000});
        },

        "submit .review-claim": function(event) {
            event.preventDefault();

            BountyProgram.reviewClaim.sendTransaction(event.target.issueNumber.value, event.target.approve.value, {from:web3.eth.accounts[0], gas: 1500000});
        },

        "submit .add-reviewer": function(event) {
            event.preventDefault();

            BountyProgram.addReviewer.sendTransaction(event.target.address.value, {from:web3.eth.accounts[0], gas: 1500000});
        },
    });

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
            localStorage[bounty.number.toString()] = Bounties.insert({bounty: bounty, status: "open", claimer: "none", reviews: 0, title: title, id: id});
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
        bounty.amount = bounty.value.toString();
        if( localStorage[bounty.number.toString()] ) {
            Bounties.update(localStorage[bounty.number.toString()], {
                $set: { bounty: bounty }
            });
        } else {
            console.log("update bounty failed: not found", bounty.number)
        }
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
        if( localStorage[bounty.number.toString()] ) {
            Bounties.update(localStorage[bounty.number.toString()], {
                $set: { claimer: res.args.claimer }
            });
        } else {
            console.log("claim bounty failed: not found", bounty.number)
        }
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
        if( localStorage[bounty.number.toString()] ) {
            var id = localStorage[bounty.number.toString()];
            Bounties.update(localStorage[bounty.number.toString()], {
                $set: { status: "closed" }
            });
        } else {
            console.log("success claim failed: not found", bounty.number)
        }
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
        if( localStorage[bounty.number.toString()] ) {
            if( bounty.approved ) {
                Bounties.update(localStorage[bounty.number.toString()], {
                    $inc: { reviews: 1 }
                });
            } else {
                // TODO
            }
        } else {
            console.log("review bounty failed: not found", bounty.number)
        }
    });
}

