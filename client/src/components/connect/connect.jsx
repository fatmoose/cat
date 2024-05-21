// eslint-disable-next-line react/prop-types
const Connect = ({ isConnected, onConnectClick }) => {
        return (
            <div>
                <h2>{isConnected ? "Connected" : "Disconnected"}</h2>
                <button onClick={onConnectClick}>
                    {isConnected ? "Connected" : "Connect"}
                </button>
            </div>
        );
    };


export default Connect;
