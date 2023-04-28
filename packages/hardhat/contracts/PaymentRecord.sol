pragma solidity ^0.8.0;

contract PaymentContract {
    struct PaymentRecord {
        address payer;
        address vendor;
        uint256 amount;
        bytes payerSig;
        bytes vendorSig;
    }

    PaymentRecord[] public paymentRecords;

    function createPaymentRecord(address _vendor, uint256 _amount, bytes memory _payerSig) public {
        PaymentRecord memory payment = PaymentRecord(msg.sender, _vendor, _amount, _payerSig, "");
        paymentRecords.push(payment);
    }

    function signPaymentRecord(uint256 _paymentIndex, bytes memory _vendorSig) public {
        PaymentRecord storage payment = paymentRecords[_paymentIndex];
        require(payment.vendor == msg.sender, "You are not authorized to sign this payment record.");
        payment.vendorSig = _vendorSig;
    }

    function getPaymentRecord(uint256 _paymentIndex) public view returns (address, address, uint256, bytes memory, bytes memory) {
        PaymentRecord storage payment = paymentRecords[_paymentIndex];
        return (payment.payer, payment.vendor, payment.amount, payment.payerSig, payment.vendorSig);
    }

    function verifyPaymentRecord(uint256 _paymentIndex) public view returns (bool) {
        PaymentRecord storage payment = paymentRecords[_paymentIndex];
        bytes32 message = prefixed(keccak256(abi.encodePacked(payment.amount, payment.payer)));
        return (recoverSigner(message, payment.payerSig) == payment.payer && recoverSigner(message, payment.vendorSig) == payment.vendor);
    }

    function prefixed(bytes32 hash) internal pure returns (bytes32) {
        return keccak256(abi.encodePacked("\x19Ethereum Signed Message:\n32", hash));
    }

    function recoverSigner(bytes32 message, bytes memory sig) internal pure returns (address) {
        require(sig.length == 65, "Invalid signature length");

        bytes32 r;
        bytes32 s;
        uint8 v;

        assembly {
            r := mload(add(sig, 32))
            s := mload(add(sig, 64))
            v := byte(0, mload(add(sig, 96)))
        }

        if (v < 27) {
            v += 27;
        }

        require(v == 27 || v == 28, "Invalid signature v value");

        return ecrecover(message, v, r, s);
    }
}
