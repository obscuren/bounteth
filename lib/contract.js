var abi = [
  {
    "constant": false,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      },
      {
        "name": "validTill",
        "type": "uint256"
      }
    ],
    "name": "submitBounty",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      },
      {
        "name": "approve",
        "type": "uint256"
      }
    ],
    "name": "reviewClaim",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "getBountyValue",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "claimBounty",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [],
    "name": "operator",
    "outputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "getReviewCount",
    "outputs": [
      {
        "name": "",
        "type": "uint256"
      }
    ],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "reviewer",
        "type": "address"
      }
    ],
    "name": "addReviewer",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "flagSpam",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {
        "name": "reviewer",
        "type": "address"
      }
    ],
    "name": "removeReviewer",
    "outputs": [],
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [
      {
        "name": "",
        "type": "address"
      }
    ],
    "name": "isReviewer",
    "outputs": [
      {
        "name": "",
        "type": "bool"
      }
    ],
    "type": "function"
  },
  {
    "inputs": [],
    "type": "constructor"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": false,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "creator",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "validTill",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "NewBounty",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "mod",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "ChangedBounty",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "DeletedBounty",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "claimer",
        "type": "address"
      }
    ],
    "name": "ClaimBounty",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": true,
        "name": "claimer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "value",
        "type": "uint256"
      }
    ],
    "name": "ClaimSuccess",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "reviewer",
        "type": "address"
      },
      {
        "indexed": false,
        "name": "approved",
        "type": "bool"
      }
    ],
    "name": "Review",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      },
      {
        "indexed": false,
        "name": "claimer",
        "type": "address"
      }
    ],
    "name": "ClaimFail",
    "type": "event"
  },
  {
    "anonymous": false,
    "inputs": [
      {
        "indexed": true,
        "name": "number",
        "type": "uint256"
      }
    ],
    "name": "ClaimDelete",
    "type": "event"
  }
] 
TrackerContract = web3.eth.contract(abi);
