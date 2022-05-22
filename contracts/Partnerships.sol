// SPDX-License-Identifier: MIT
pragma solidity >=0.4.22 <0.9.0;

contract Partnerships {
  address payable public sender;
  address payable public receiver;
  address payable[] private _partners;
  address payable[] private _agreed;
  uint private _adjustment;
  uint[] public _amount;

  event Partner(address indexed from, address indexed to, uint amount);
  event Agreed(address indexed from, address indexed to, uint amount);

  function setAmount(uint amount) public {
    _amount.push(amount);
  }

  function setParties(address payable _receiver) public {
    sender = payable(msg.sender);
    receiver = _receiver;
  }

  function createPartnership(uint amount) public {
    this.setAmount(amount);
    _partners = [sender, receiver];
    emit Partner(sender, receiver, amount);
  }

  function requestAdjustment(uint amount) public {
    delete _agreed;
    if (msg.sender == sender) {
      this.setAdjustment(amount);
      _agreed = [sender];
    }
  }

  function agreeAdjustment(address payable to) public {
    if (to == receiver) {
      _agreed.push(receiver);
      uint amount = _adjustment * (1 ether);
      this.setAmount(amount);
    }
  }

  function getAdjustment(address payable from) public view returns (uint[] memory) {
    if (msg.sender == from) {
      return _amount;
    }
    return _amount;
  }

  function setAdjustment(uint amount) public {
    _adjustment = amount;
  }

  function setAgreed(address payable partner) public {
    _agreed.push(partner);
  }

  function isAgreed(address payable partner) public view returns (bool) {
    for (uint i = 0; i < _agreed.length; i++) {
      if (_agreed[i] == partner) {
        return true;
      }
    }
    return false;
  }

  function getAgreed() public view returns (address payable[] memory) {
    return _agreed;
  }

  function fullfilled() public {
    if (_agreed.length == 2) {
      receiver.transfer(_amount[_amount.length - 1]);
      emit Agreed(sender, receiver, _amount[_amount.length - 1]); // Agreed saved to blockchain.
      delete _partners;// empty partnership.
      delete _agreed; // empty agreement.
    }
  }
}
