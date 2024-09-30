import { ethers } from "./ethers-5.6.esm.min.js"
import { abi, contractAddress } from "./constants.js"

const connectButton = document.getElementById("connectButton")
const fundButton = document.getElementById("fundButton")
const balanceButton = document.getElementById("balanceButton")
const withdrawButton = document.getElementById("withdrawButton")
connectButton.onclick = connect
fundButton.onclick = fund
balanceButton.onclick = getBalance
withdrawButton.onclick = withdraw

console.log(ethers)

async function connect() {
    if (typeof window.ethereum !== "undefined") {
        await window.ethereum.request({
            method: "eth_requestAccounts",
        })
        connectButton.innerHTML = "Connected!"
    } else {
        connectButton.innerHTML = "Please install MetaMask!"
    }
}

async function fund() {
    const ethAmount = document.getElementById("ethAmount").value
    console.log(`Funding with ${ethAmount}...`)
    if (typeof window.ethereum != "undefined") {
        // provider
        // signer / wallet
        // contract
        // ABI & Address
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        console.log(signer)
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.fund({
                value: ethers.utils.parseEther(ethAmount.toString()),
            })
            // listen for tx to be mined
            // listen for an even <- we havent learned about yet!
            await listenForTransactionMine(txResponse, provider)
            console.log("Done!")
        } catch (error) {
            console.log(error)
        }
    }
}

async function getBalance() {
    if (typeof window.ethereum != "undefined") {
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const balance = await provider.getBalance(contractAddress)
        console.log(ethers.utils.formatEther(balance))
    }
}

async function withdraw() {
    if (typeof window.ethereum != "undefined") {
        console.log("Wthdrawing..")
        const provider = new ethers.providers.Web3Provider(window.ethereum)
        const signer = provider.getSigner()
        const contract = new ethers.Contract(contractAddress, abi, signer)
        try {
            const txResponse = await contract.withdraw()
            await listenForTransactionMine(txResponse, provider)
        } catch (error) {
            console.log(error)
        }
    }
}

function listenForTransactionMine(txResponse, provider) {
    console.log(`Mining ${txResponse.hash}...`)
    // return new Promise()
    // create a listener for the blockchain
    return new Promise((resolve, reject) => {
        provider.once(txResponse.hash, (transactionReceipt) => {
            console.log(
                `Completed with ${transactionReceipt.confirmations} confirmations.`,
            )
            resolve()
        })
    })
}
