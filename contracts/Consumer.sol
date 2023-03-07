// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

import "@chainlink/contracts/src/v0.8/ChainlinkClient.sol";
import "@chainlink/contracts/src/v0.8/ConfirmedOwner.sol";

contract Consumer is ChainlinkClient, ConfirmedOwner {
  using Chainlink for Chainlink.Request;

  uint256 private constant ORACLE_PAYMENT = 1 * LINK_DIVISIBILITY;

  uint256 public currentAccountBalance;

  event RequestKusamaAccountBalanceFulfilled(bytes32 indexed requestId, uint256 indexed freePlank);

  constructor(address _link) ConfirmedOwner(msg.sender) {
    if (_link == address(0)) {
      setPublicChainlinkToken();
    } else {
      setChainlinkToken(_link);
    }
  }

  function requestKusamaAccountBalance(address _oracle, string memory _jobId, string memory kusamaAddress, string memory kusamaBlockHash) public onlyOwner {
    Chainlink.Request memory req = buildChainlinkRequest(
      stringToBytes32(_jobId),
      address(this),
      this.fulfillKusamaAccountBalance.selector
    );
    req.add("address", kusamaAddress);
    req.add("blockHash", kusamaBlockHash);
    req.add("path", "data,free");
    sendChainlinkRequestTo(_oracle, req, ORACLE_PAYMENT);
  }

  function fulfillKusamaAccountBalance(
    bytes32 requestId,
    uint256 freePlank
  ) public recordChainlinkFulfillment(requestId) {
    emit RequestKusamaAccountBalanceFulfilled(requestId, freePlank);
    currentAccountBalance = freePlank;
  }

  function getChainlinkToken() public view returns (address) {
    return chainlinkTokenAddress();
  }

  function withdrawLink() public onlyOwner {
    LinkTokenInterface link = LinkTokenInterface(chainlinkTokenAddress());
    require(link.transfer(msg.sender, link.balanceOf(address(this))), "Unable to transfer");
  }

  function cancelRequest(
    bytes32 _requestId,
    uint256 _payment,
    bytes4 _callbackFunctionId,
    uint256 _expiration
  ) public onlyOwner {
    cancelChainlinkRequest(_requestId, _payment, _callbackFunctionId, _expiration);
  }

  function stringToBytes32(string memory source) private pure returns (bytes32 result) {
    bytes memory tempEmptyStringTest = bytes(source);
    if (tempEmptyStringTest.length == 0) {
      return 0x0;
    }

    assembly {
      // solhint-disable-line no-inline-assembly
      result := mload(add(source, 32))
    }
  }
}
