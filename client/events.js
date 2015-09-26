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
                // show error message
                GlobalNotification.info({
                    title: 'Bounty error',
                    content: error.message,
                    duration: 2
                });
                return;
            }

            BountyProgram.submitBounty.sendTransaction(event.target.issueNumber.value, event.target.validTill.value, {
                from:web3.eth.accounts[0],
                value: event.target.amount.value,
                gas: 1500000
            });
        });
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
