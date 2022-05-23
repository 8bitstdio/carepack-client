// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Partnerships {

  struct Partner {
    string name;
    address sender;
    address payable receiver;
    uint amount;
    bool completed;
  }

  mapping(uint => Partner) public partners;

  event PartnershipResult(string name, uint amount);
  
  function Partnership() public {}

  function createPartnership(uint id, address _receiver, string memory _name, uint _amount) public {
    partners[id].name = _name;
    partners[id].sender = msg.sender;
    partners[id].receiver = payable(_receiver);
    partners[id].amount = _amount * 1 ether;
    partners[id].completed = false;
  }

  function adjustAmount(uint id, uint _amount) public {
    require(msg.sender == partners[id].receiver, "Only the receiver can adjust amount higher");
    require(partners[id].receiver.balance > _amount * 1 ether);
    partners[id].amount = _amount * 1 ether;
  }

  function lowerAmount(uint id, uint _amount) public {
    require(msg.sender != partners[id].receiver, "Only the sender can lower amount. Use adjustAmount instead");
    require(partners[id].amount > _amount * 1 ether);
    require(partners[id].receiver.balance > _amount * 1 ether);
    partners[id].amount = _amount * 1 ether;
  }

  function isActive(uint id) public view returns (bool active) {
    active = partners[id].completed;
    return active;
  }

  function end(uint id) public {
    require(msg.sender == partners[id].sender, "Only the sender can end"); // only the sender can end.
    require(isActive(id), "Partnership already ended");
    partners[id].completed = true;
    (bool sent,) = partners[id].receiver.call{value: partners[id].amount}("");
    require(sent, "Failed to transfer");
    emit PartnershipResult(partners[id].name, partners[id].amount);
  }
}