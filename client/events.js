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
