// SPDX-License-Identifier: MIT
pragma solidity ^0.8.19;

contract DiagnosticRegistration {
    struct Diagnostic {
        address walletAddress;
        string diagnosticName;
        string hospitalName;
        string diagnosticLocation;
        string email;
        string idNumber;
        string password;
    }

    mapping(string => address) private diagnosticAddresses;
    mapping(string => Diagnostic) private diagnostics;

    event DiagnosticRegistered(string idNumber, string diagnosticName, address walletAddress);

    function registerDiagnostic(
        string memory _diagnosticName,
        string memory _hospitalName,
        string memory _diagnosticLocation,
        string memory _email,
        string memory _idNumber,
        string memory _password
    ) external {
        require(diagnosticAddresses[_idNumber] == address(0), "Diagnostic already registered");

        Diagnostic memory newDiagnostic = Diagnostic({
            walletAddress: msg.sender,
            diagnosticName: _diagnosticName,
            hospitalName: _hospitalName,
            diagnosticLocation: _diagnosticLocation,
            email: _email,
            idNumber: _idNumber,
            password: _password
        });

        diagnostics[_idNumber] = newDiagnostic;
        diagnosticAddresses[_idNumber] = msg.sender;
        emit DiagnosticRegistered(_idNumber, _diagnosticName, msg.sender);
    }

    function isRegisteredDiagnostic(string memory _idNumber) external view returns (bool) {
        return diagnosticAddresses[_idNumber] != address(0);
    }

    function getDiagnosticDetails(string memory _idNumber) external view returns (
        address _walletAddress,
        string memory _diagnosticName,
        string memory _hospitalName,
        string memory _diagnosticLocation,
        string memory _email
    ) {
        require(diagnosticAddresses[_idNumber] != address(0), "Diagnostic not registered");
        Diagnostic memory diagnostic = diagnostics[_idNumber];
        return (
            diagnostic.walletAddress,
            diagnostic.diagnosticName,
            diagnostic.hospitalName,
            diagnostic.diagnosticLocation,
            diagnostic.email
        );
    }

    function validatePassword(string memory _idNumber, string memory _password) external view returns (bool) {
        require(diagnosticAddresses[_idNumber] != address(0), "Diagnostic not registered");
        return keccak256(abi.encodePacked(_password)) == keccak256(abi.encodePacked(diagnostics[_idNumber].password));
    }
}
