import { useWeb3React } from "@web3-react/core"
import Button from "../button";
import { injected } from '../../utils/injector';

const LoginButton = () => {
    const { active, activate, deactivate } = useWeb3React();

    async function connect() {
        try {
            if (window.ethereum) {
                await activate(injected);
            } else {
                window.open('https://metamask.io/download.html');
            }
        } catch (ex) {
            console.log(ex)
        }
    }

    async function disconnect() {
        try {
            deactivate()
        } catch (ex) {
            console.log(ex)
        }
    }

    return (
        <>
            { active ?
                <Button href="/" asLink onClick={disconnect}>Logout</Button> :
                <Button href="/" asLink onClick={connect}>Connect to Metamask</Button>
            }
        </>
    );
}

export default LoginButton;
