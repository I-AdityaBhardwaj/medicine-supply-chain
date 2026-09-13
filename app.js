// ============================================================
// MEDCHAIN - MEDICINE SUPPLY CHAIN
// Complete Frontend JavaScript
// Ethereum Sepolia + MetaMask + ethers.js
// ============================================================

let provider = null;
let signer = null;
let contract = null;

// ============================================================
// CONTRACT CONFIGURATION
// ============================================================

// IMPORTANT:
// Use the contract address that successfully worked with your
// frontend Register / Transfer / Verify operations.
const CONTRACT_ADDRESS = "0xd40a58B9AA4A8843ceC51E00Cec120981D03Af8a";

// Human-readable ABI
const CONTRACT_ABI = [
    "function registerMedicine(string,string,string,string,string)",
    "function transferMedicine(string,address)",
    "function medicines(string) view returns (string,string,string,string,string,address,address,bool)"
];


// ============================================================
// HELPER FUNCTIONS
// ============================================================

function showResult(message) {
    const result = document.getElementById("medicineResult");

    if (result) {
        result.innerHTML = message;
    }
}

function getErrorMessage(error) {
    return (
        error?.shortMessage ||
        error?.reason ||
        error?.info?.error?.message ||
        error?.message ||
        "Unknown error"
    );
}


// ============================================================
// CONNECT METAMASK
// ============================================================

document
    .getElementById("connectWallet")
    .addEventListener("click", async () => {

        try {

            if (!window.ethereum) {
                alert("MetaMask is not installed.");
                return;
            }

            // Create provider
            provider = new ethers.BrowserProvider(
                window.ethereum
            );

            // Request wallet access
            await provider.send(
                "eth_requestAccounts",
                []
            );

            // Check blockchain network
            const network =
                await provider.getNetwork();

            console.log(
                "Connected chain ID:",
                network.chainId.toString()
            );

            // Sepolia Chain ID
            if (network.chainId !== 11155111n) {

                alert(
                    "Please switch MetaMask to the Sepolia network."
                );

                return;
            }

            // Get signer
            signer =
                await provider.getSigner();

            const walletAddress =
                await signer.getAddress();

            // Create smart contract object
            contract =
                new ethers.Contract(
                    CONTRACT_ADDRESS,
                    CONTRACT_ABI,
                    signer
                );

            // Diagnostic information
            console.log(
                "CONTRACT ADDRESS:",
                CONTRACT_ADDRESS
            );

            console.log(
                "CONTRACT:",
                contract
            );

            console.log(
                "registerMedicine:",
                contract.registerMedicine
            );

            console.log(
                "transferMedicine:",
                contract.transferMedicine
            );

            console.log(
                "medicines:",
                contract.medicines
            );

            // Verify contract interface
            if (
                typeof contract.registerMedicine !==
                "function"
            ) {

                alert(
                    "Contract interface is incorrect. Check contract address."
                );

                return;
            }

            // Update UI
            document.getElementById(
                "walletStatus"
            ).innerHTML =
                "✅ Connected: " +
                walletAddress;

        }

        catch (error) {

            console.error(
                "Wallet connection error:",
                error
            );

            document.getElementById(
                "walletStatus"
            ).innerHTML =
                "❌ Wallet connection failed.";

            alert(
                getErrorMessage(error)
            );
        }

    });


// ============================================================
// REGISTER MEDICINE
// ============================================================

document
    .getElementById("registerMedicine")
    .addEventListener("click", async () => {

        try {

            if (!contract) {

                alert(
                    "Please connect MetaMask first."
                );

                return;
            }

            if (
                typeof contract.registerMedicine !==
                "function"
            ) {

                alert(
                    "registerMedicine() is not available."
                );

                return;
            }

            // Read form values
            const medicineId =
                document
                    .getElementById("medicineId")
                    .value
                    .trim();

            const medicineName =
                document
                    .getElementById("medicineName")
                    .value
                    .trim();

            const batchNumber =
                document
                    .getElementById("batchNumber")
                    .value
                    .trim();

            const manufacturingDate =
                document
                    .getElementById("manufacturingDate")
                    .value
                    .trim();

            const expiryDate =
                document
                    .getElementById("expiryDate")
                    .value
                    .trim();


            // Validation
            if (
                !medicineId ||
                !medicineName ||
                !batchNumber ||
                !manufacturingDate ||
                !expiryDate
            ) {

                alert(
                    "Please fill all medicine fields."
                );

                return;
            }


            console.log(
                "Calling registerMedicine with:",
                {
                    medicineId,
                    medicineName,
                    batchNumber,
                    manufacturingDate,
                    expiryDate
                }
            );


            showResult(
                "⏳ Sending registration transaction..."
            );


            // Blockchain transaction
            const tx =
                await contract.registerMedicine(
                    medicineId,
                    medicineName,
                    batchNumber,
                    manufacturingDate,
                    expiryDate
                );


            console.log(
                "Registration transaction:",
                tx.hash
            );


            showResult(
                "⏳ Transaction submitted.<br>" +
                "Transaction Hash:<br>" +
                tx.hash +
                "<br><br>" +
                "Waiting for confirmation..."
            );


            // Wait for confirmation
            await tx.wait();


            showResult(
                "<h3>✅ Medicine Registered</h3>" +
                "<strong>Medicine ID:</strong> " +
                medicineId +
                "<br>" +
                "<strong>Transaction:</strong><br>" +
                tx.hash
            );


        }

        catch (error) {

            console.error(
                "Registration error:",
                error
            );

            showResult(
                "❌ Registration failed.<br><br>" +
                getErrorMessage(error)
            );
        }

    });


// ============================================================
// TRANSFER MEDICINE
// ============================================================

document
    .getElementById("transferMedicine")
    .addEventListener("click", async () => {

        try {

            if (!contract) {

                alert(
                    "Please connect MetaMask first."
                );

                return;
            }


            if (
                typeof contract.transferMedicine !==
                "function"
            ) {

                alert(
                    "transferMedicine() is not available."
                );

                return;
            }


            const medicineId =
                document
                    .getElementById(
                        "transferMedicineId"
                    )
                    .value
                    .trim();

            const newOwner =
                document
                    .getElementById("newOwner")
                    .value
                    .trim();


            if (!medicineId) {

                alert(
                    "Please enter Medicine ID."
                );

                return;
            }


            if (!newOwner) {

                alert(
                    "Please enter the new owner's wallet address."
                );

                return;
            }


            // Validate Ethereum address
            if (!ethers.isAddress(newOwner)) {

                alert(
                    "Invalid Ethereum wallet address."
                );

                return;
            }


            showResult(
                "⏳ Sending ownership transfer transaction..."
            );


            console.log(
                "Calling transferMedicine:",
                {
                    medicineId,
                    newOwner
                }
            );


            const tx =
                await contract.transferMedicine(
                    medicineId,
                    newOwner
                );


            console.log(
                "Transfer transaction:",
                tx.hash
            );


            showResult(
                "⏳ Transfer transaction submitted.<br>" +
                "Transaction Hash:<br>" +
                tx.hash +
                "<br><br>" +
                "Waiting for confirmation..."
            );


            await tx.wait();


            showResult(
                "<h3>✅ Ownership Transferred</h3>" +
                "<strong>Medicine ID:</strong> " +
                medicineId +
                "<br>" +
                "<strong>New Owner:</strong> " +
                newOwner +
                "<br>" +
                "<strong>Transaction:</strong><br>" +
                tx.hash
            );


        }

        catch (error) {

            console.error(
                "Transfer error:",
                error
            );

            showResult(
                "❌ Transfer failed.<br><br>" +
                getErrorMessage(error)
            );
        }

    });


// ============================================================
// VERIFY MEDICINE MANUALLY
// ============================================================

document
    .getElementById("verifyMedicine")
    .addEventListener("click", async () => {

        try {

            if (!contract) {

                alert(
                    "Please connect MetaMask first."
                );

                return;
            }


            const medicineId =
                document
                    .getElementById(
                        "verifyMedicineId"
                    )
                    .value
                    .trim();


            if (!medicineId) {

                alert(
                    "Please enter Medicine ID."
                );

                return;
            }


            showResult(
                "⏳ Reading medicine data from blockchain..."
            );


            const medicine =
                await contract.medicines(
                    medicineId
                );


            console.log(
                "Medicine from blockchain:",
                medicine
            );


            // medicine[7] = exists
            if (!medicine[7]) {

                showResult(
                    "<h3>❌ Medicine Not Found</h3>" +
                    "Medicine ID: " +
                    medicineId
                );

                return;
            }


            showResult(`
                <h3>✅ Medicine Verified</h3>

                <strong>Medicine ID:</strong>
                ${medicine[0]}<br>

                <strong>Name:</strong>
                ${medicine[1]}<br>

                <strong>Batch Number:</strong>
                ${medicine[2]}<br>

                <strong>Manufacturing Date:</strong>
                ${medicine[3]}<br>

                <strong>Expiry Date:</strong>
                ${medicine[4]}<br>

                <strong>Manufacturer:</strong>
                ${medicine[5]}<br>

                <strong>Current Owner:</strong>
                ${medicine[6]}<br>

                <strong>Status:</strong>
                ✅ Registered on Blockchain
            `);

        }

        catch (error) {

            console.error(
                "Verification error:",
                error
            );

            showResult(
                "❌ Verification failed.<br><br>" +
                getErrorMessage(error)
            );
        }

    });


// ============================================================
// QR CODE GENERATION
// ============================================================

let qrCode = null;

document
    .getElementById("generateQR")
    .addEventListener("click", () => {

        try {

            const medicineId =
                document
                    .getElementById(
                        "qrMedicineId"
                    )
                    .value
                    .trim();


            const qrContainer =
                document.getElementById(
                    "qrcode"
                );


            const qrStatus =
                document.getElementById(
                    "qrStatus"
                );


            if (!medicineId) {

                alert(
                    "Please enter a Medicine ID."
                );

                return;
            }


            // Clear previous QR
            qrContainer.innerHTML = "";


            // Create QR code
            qrCode =
                new QRCode(
                    qrContainer,
                    {
                        text: medicineId,

                        width: 190,

                        height: 190,

                        correctLevel:
                            QRCode.CorrectLevel.H
                    }
                );


            qrStatus.innerText =
                "✅ QR code generated for Medicine ID: " +
                medicineId;


            console.log(
                "QR generated:",
                medicineId
            );

        }

        catch (error) {

            console.error(
                "QR generation error:",
                error
            );

            alert(
                "Unable to generate QR code."
            );
        }

    });


// ============================================================
// QR SCANNER VARIABLES
// ============================================================

let html5QrCode = null;
let scannerRunning = false;


// ============================================================
// START QR SCANNER
// ============================================================

document
    .getElementById("startScanner")
    .addEventListener("click", async () => {

        try {

            if (scannerRunning) {

                return;
            }


            // Create scanner
            html5QrCode =
                new Html5Qrcode(
                    "reader"
                );


            await html5QrCode.start(

                {
                    facingMode:
                        "environment"
                },

                {
                    fps: 10,

                    qrbox: {
                        width: 250,
                        height: 250
                    }
                },

                async (decodedText) => {

                    console.log(
                        "QR detected:",
                        decodedText
                    );


                    // Put scanned ID into verification
                    document
                        .getElementById(
                            "verifyMedicineId"
                        )
                        .value =
                        decodedText;


                    // Stop scanner
                    await stopQRScanner();


                    // Update status
                    document
                        .getElementById(
                            "qrStatus"
                        )
                        .innerText =
                        "✅ QR scanned: " +
                        decodedText;


                    // Automatically verify
                    await verifyMedicineFromQR(
                        decodedText
                    );

                },

                (errorMessage) => {

                    // Continuous scan errors
                    // are expected and ignored.

                }

            );


            scannerRunning = true;


            document
                .getElementById(
                    "qrStatus"
                )
                .innerText =
                "📷 Camera scanner is running...";


            console.log(
                "QR scanner started"
            );

        }

        catch (error) {

            console.error(
                "QR scanner error:",
                error
            );


            document
                .getElementById(
                    "qrStatus"
                )
                .innerText =
                "❌ Unable to start scanner.";


            alert(
                "Camera access failed. Please allow camera permission in Chrome."
            );

        }

    });


// ============================================================
// STOP QR SCANNER
// ============================================================

document
    .getElementById("stopScanner")
    .addEventListener("click", async () => {

        await stopQRScanner();

    });


async function stopQRScanner() {

    try {

        if (
            html5QrCode &&
            scannerRunning
        ) {

            await html5QrCode.stop();

            await html5QrCode.clear();

        }

    }

    catch (error) {

        console.error(
            "Scanner stop error:",
            error
        );

    }


    scannerRunning = false;


    document
        .getElementById(
            "qrStatus"
        )
        .innerText =
        "Scanner stopped.";

}


// ============================================================
// VERIFY MEDICINE FROM QR
// ============================================================

async function verifyMedicineFromQR(
    medicineId
) {

    try {

        if (!contract) {

            alert(
                "Please connect MetaMask first."
            );

            return;
        }


        if (
            typeof contract.medicines !==
            "function"
        ) {

            alert(
                "Medicine verification is unavailable."
            );

            return;
        }


        showResult(
            "⏳ Reading medicine information from blockchain..."
        );


        const medicine =
            await contract.medicines(
                medicineId
            );


        console.log(
            "QR medicine data:",
            medicine
        );


        if (!medicine[7]) {

            showResult(`
                <h3>❌ Medicine Not Found</h3>

                <strong>Medicine ID:</strong>
                ${medicineId}
            `);

            return;
        }


        showResult(`
            <h3>✅ Medicine Verified</h3>

            <strong>Medicine ID:</strong>
            ${medicine[0]}<br>

            <strong>Name:</strong>
            ${medicine[1]}<br>

            <strong>Batch Number:</strong>
            ${medicine[2]}<br>

            <strong>Manufacturing Date:</strong>
            ${medicine[3]}<br>

            <strong>Expiry Date:</strong>
            ${medicine[4]}<br>

            <strong>Manufacturer:</strong>
            ${medicine[5]}<br>

            <strong>Current Owner:</strong>
            ${medicine[6]}<br><br>

            <strong>Status:</strong>
            ✅ Registered on Blockchain
        `);

    }

    catch (error) {

        console.error(
            "QR verification error:",
            error
        );

        showResult(
            "❌ QR verification failed.<br><br>" +
            getErrorMessage(error)
        );

    }

}


// ============================================================
// ACCOUNT / NETWORK CHANGES
// ============================================================

if (window.ethereum) {

    window.ethereum.on(
        "accountsChanged",
        () => {

            console.log(
                "Account changed. Please reconnect."
            );

            provider = null;
            signer = null;
            contract = null;

            document
                .getElementById(
                    "walletStatus"
                )
                .innerHTML =
                "Wallet changed. Please reconnect MetaMask.";

        }
    );


    window.ethereum.on(
        "chainChanged",
        () => {

            console.log(
                "Network changed. Please reconnect."
            );

            provider = null;
            signer = null;
            contract = null;

            document
                .getElementById(
                    "walletStatus"
                )
                .innerHTML =
                "Network changed. Please reconnect MetaMask.";

        }
    );

}