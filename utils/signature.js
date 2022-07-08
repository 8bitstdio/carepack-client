import {ethers} from 'ethers';

export const signMessage = async (message) => {
    try {
        // check if ethereum enabled.
        if (!window.ethereum)
            throw new Error('No wallet found. Please install it.');
        
        await window.ethereum.send('eth_requestAccounts');
        const provider = new ethers.providers.Web3Provider(window.ethereum);
        const signer = provider.getSigner();
        const address = await signer.getAddress();
        const signature = await signer.signMessage(`${message}\nWallet Address: ${address}`);

        return {
            message,
            signature,
            address
        };
    } catch (err) {
        return {
            error: err,
        };
    }
}

export const verifyMessage = async ({message, address, signature}) => {
    try {
        const signerAddr = await ethers.utils.verifyMessage(message, signature);
        if (signerAddr !== address){
            return false;
        }
        return true;
    } catch (err) {
        console.warn('Error verifying message', err);
        return false;
    }
};
