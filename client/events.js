function validateIssueNumber(number, cb) {
    Meteor.http.get("https://api.github.com/repos/ethereum/go-ethereum/issues/"+number, {timeout: 2000}, function(e, res) {
        if( e ) {
            return cb(false, e, res);
        }

        if( res.data.state == "closed" ) {
            return cb(false, {message: "Issue closed"}, res);
        }

        cb(true, null, res);
    });
}

Template.body.events({
    "submit .new-bounty": function(event) {
        event.preventDefault();

        validateIssueNumber(event.target.issueNumber.value, function(validIssue, error, res) {
            if( !validIssue ) {
                GlobalNotification.error({content: error.message, duration: 5});
            } else {
                BountyProgram.submitBounty.sendTransaction(event.target.issueNumber.value, event.target.validTill.value, {
                    from:event.target.address.value,
                    value: event.target.amount.value,
                    gas: 1500000
                }, function(err) {
                    if( err ) {
                        GlobalNotification.error({content: err.message, duration: 5});
                    } else {
                        GlobalNotification.success({content: "Bounty successfully created", duration: 5});
                    }
                });

            }

            event.target.issueNumber.value = "";
            event.target.validTill.value = defaultTime();
            event.target.amount.value = "";
        });
    },

    "submit .claim-bounty": function(event) {
        event.preventDefault();

        BountyProgram.claimBounty.sendTransaction(event.target.issueNumber.value, {from:event.target.address.value, value: web3.toWei(10, "ether"), gas: 1500000}, function(err) {
            if( err ) {
                GlobalNotification.error({content: err.message, duration: 5});
            } else {
                GlobalNotification.success({content: "Bounty claim submitted", duration: 5});
            }
        });
    },

    "submit .review-claim": function(event) {
        event.preventDefault();

        BountyProgram.reviewClaim.sendTransaction(event.target.issueNumber.value, event.target.approve.value, {from:event.target.address.value, gas: 1500000}, function(err) {
            if( err ) {
                GlobalNotification.error({content: err.message, duration: 5});
            } else {
                GlobalNotification.success({content: "Reviewed claim", duration: 5});
            }
        });
    },

    "submit .add-reviewer": function(event) {
        event.preventDefault();

        BountyProgram.addReviewer.sendTransaction(event.target.address.value, {from:event.target.address.value, gas: 1500000}, function(err) {
            if( err ) {
                GlobalNotification.error({content: err.message, duration: 5});
            } else {
                GlobalNotification.info({content: "Added reviewer", duration: 5});
            }
        });
    },

    "submit .reclaim-bounty": function(event) {
        event.preventDefault();

        BountyProgram.reclaimBounty.sendTransaction(event.target.issueNumber.value, {from:event.target.address.value, gas:100000}, function(err) {
            if( err ) {
                GlobalNotification.error({content: err.message, duration: 5});
            } else {
                GlobalNotification.info({content: "Reclaimed bounty", duration: 5});
            }
        });
    }
});
