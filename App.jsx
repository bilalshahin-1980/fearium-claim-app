import { useState } from 'react';
import { ethers } from 'ethers';

const CONTRACT_ADDRESS = '0x5Bba4B0c48E93F17570bfe4cc8E4dEE04FB85BbF';
const ABI = [
  "function transfer(address to, uint256 amount) public returns (bool)"
];

export default function App() {
  const [status, setStatus] = useState('');

  const claimTokens = async () => {
    try {
      if (!window.ethereum) {
        alert("Please install MetaMask first!");
        return;
      }

      await window.ethereum.request({ method: 'eth_requestAccounts' });
      const provider = new ethers.providers.Web3Provider(window.ethereum);
      const signer = provider.getSigner();
      const userAddress = await signer.getAddress();

      const contract = new ethers.Contract(CONTRACT_ADDRESS, ABI, signer);

      const amount = ethers.utils.parseUnits("50", 18);
      const tx = await contract.transfer(userAddress, amount);
      setStatus('Transaction sent... Waiting for confirmation');

      await tx.wait();
      setStatus('✅ Success! You received 50 FER.');
    } catch (err) {
      console.error(err);
      setStatus('❌ Transaction failed or rejected');
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-6 rounded-2xl shadow-xl text-center w-full max-w-sm">
        <h1 className="text-2xl font-bold mb-4">Claim 50 FER</h1>
        <button
          onClick={claimTokens}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-2xl shadow"
        >
          Claim Now
        </button>
        <p className="mt-4 text-gray-700 text-sm">{status}</p>
      </div>
    </main>
  );
}