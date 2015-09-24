contract Tracker {
    address operator;
    mapping(uint => Bounty) bounties;
    mapping(uint => bool) bountyAvailable;
    mapping(address => bool) public isReviewer;

    // addReviewer adds a reviewer to the list of reviewers. This can only
    // be done from the operator account.
    function addReviewer(address reviewer) {
        if( msg.sender != operator || isReviewer[reviewer]) return;
        isReviewer[reviewer] = true;
    }
    
    // Claim is an object assigned to bounties whenever a user
    // submits a bounty claim.
    struct Claim {
        // progress indicator
        bool inProgress;
        // owner of the claim
        address owner;
        // the initial claim deposit
        uint deposit;
        // reviewers of the claim
        address[2] reviewers;
        // review count
        uint ri;
    }
    
    // Bounty is a bounty submission
    struct Bounty {
        // creator of the bounty
        address creator;
        // amount of wei to claim for resolving the bounty
        uint value;
        // claim details (if available).
        Claim claim;
    }
    
    // Fired as new bounties are being created.
    event NewBounty(uint number, address creator, uint value);
    // Fired when a bounty's value has changed.
    event ChangedBounty(uint indexed number, address mod, uint value);
    // Fired when a bounty has been claimed (but not paid out).
    event ClaimBounty(uint indexed number, address claimer);
    // Fired when a bounty claim was successfull.
    event ClaimSuccess(uint indexed number, address indexed claimer, uint value);
    // Fired when a review is done on a claim.
    event Review(uint indexed number, address reviewer, bool approved);
    // Fired when a bounty claim failed / rejected.
    event ClaimFail(uint indexed number, address claimer);
    // Fired when a bounty claim is flagged as spam.
    event ClaimDelete(uint indexed number);
    
    // Bounty tracker constructor
    function Tracker() {
        operator = msg.sender;
        // hardcoded temp values
        isReviewer[0x9df9878ae7b4f5133efea173733d16fc6ea5dde3] = true;
        isReviewer[0xc3fac3cc4feed25b6b4b258cdd57c5ce208d34dc] = true;
    }
    
    // submitBounty creates a new bounty with the number as identifier
    // whenever a bounty already exists add the bounty value to the existing
    // bounty.
    function submitBounty(uint number) {
        // bounty exists, add value
        if( bountyAvailable[number] ) {
            uint nval = bounties[number].value + msg.value;
            bounties[number].value = nval;
            
            ChangedBounty(number, msg.sender, nval);
        } else {
            // bounty does not exist, create new bounty
            if( msg.value > 0 ) {
                Bounty bounty;
                bounty.creator = msg.sender;
                bounty.value = msg.value;

                bounties[number] = bounty;
                bountyAvailable[number] = true;
                
                NewBounty(number, msg.sender, msg.value);
            }
        }
    }
    
    // getBountyValue returns the value for the bounty identified by the number.
    function getBountyValue(uint number) constant returns (uint) {
        return bounties[number].value;
    }
    
    // claimBounty claims the bounty and requires deposit to avoid spam
    function claimBounty(uint number) {
        if( bountyAvailable[number] && msg.value >= 10 ether) {
            Bounty bounty = bounties[number];
            if( bounty.claim.inProgress ) {
                // throw doesn't work now. just send back the deposit
                msg.sender.send(msg.value);
                return;
            }
            
            bounty.claim.inProgress = true;
            bounty.claim.owner = msg.sender;
            bounty.claim.deposit = msg.value;
            bounties[number] = bounty;
            
            ClaimBounty(number, msg.sender);
        }
    }
    
    // resetClaimState is an internal method which resets the bounty's
    // claim state (i.e. it deleted the claim).
    function resetClaimState(uint number, Bounty bounty) internal {
        delete bounty.claim;
        bounties[number] = bounty;
    }
    
    // reviewClaim reviews a claim made on a bounty. If the critirea is met
    // payout bounty to the owner of the claim minus a fee for the reviewers.
    function reviewClaim(uint number, uint approve) {
        if( !isReviewer[msg.sender] || !bountyAvailable[number] ) return;
        
        Bounty bounty = bounties[number];
        if( !bounty.claim.inProgress ) return;
        
        Review(number, msg.sender, approve>0);
        
        if( approve == 0 ) {
            bounty.claim.owner.send(bounty.claim.deposit);
            resetClaimState(number, bounty);
            
            ClaimFail(number, bounty.claim.owner);
            return;
        }

        // getting a Solidity error here
        //for(var j = 0; j < bounty.claim.reviewers.length; j++) {
         //   if( address(bounty.claim.reviewers[i]) == msg.sender ) return;
        //}
        
        bounty.claim.reviewers[bounty.claim.ri] = msg.sender;
        bounty.claim.ri++;
        if(bounty.claim.ri == 2) {
            // calculate cut for the reviewers
            uint rcut = bounty.value / 100 * 10;
            // pay out bounty to owner of the claim minus the review cut
            bounty.claim.owner.send(bounty.value - (rcut*2) + bounty.claim.deposit);
            // pay out review cut
            for(var i = 0; i < bounty.claim.reviewers.length; i++) {
                bounty.claim.reviewers[i].send(rcut);
            }
            
            delete bounties[number];
            
            ClaimSuccess(number, bounty.claim.owner, bounty.value);
        }
    }
    
    // getReviewCount returns the amount of reviews received on the
    // claim.
    function getReviewCount(uint number) constant returns (uint) {
        return bounties[number].claim.ri;
    }
    
    // flagSpam removes the claim from the bounty and transfer deposits in 
    // to the tracker creator's account.
    function flagSpam(uint number) {
        if( !bountyAvailable[number] || msg.sender != operator) return;
        
        Bounty bounty = bounties[number];
        resetClaimState(number, bounty);
        
        operator.send(bounty.claim.deposit); // operator takes all ;-)
        
        ClaimDelete(number);
    }
}
//10 ether = 10000000000000000000
