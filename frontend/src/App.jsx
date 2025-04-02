import {
  ConnectButton,
  useAutoConnectWallet,
  useCurrentAccount,
  useSuiClientInfiniteQuery,
  useSuiClientQuery,
} from "@mysten/dapp-kit";
import "./App.css";
import { useEffect } from "react";
import { DEVNET_RELIGY_SYNC_PACKAGE_ID } from "./config/constants";

function App() {
  const autoConnect = useAutoConnectWallet();
  return (
    <div className="App">
      <header className="App-header">
        <ConnectButton />
        <ConnectedAccount />
        <p>auto connect status: {autoConnect}</p>
      </header>
    </div>
  );
}

function ConnectedAccount() {
  const account = useCurrentAccount();

  if (!account) {
    return null;
  }

  return (
    <div>
      <div>Connected to {account.address}</div>
      <OwnedObjects address={account.address} />
    </div>
  );
}

function OwnedObjects({ address }) {
  const { data } = useSuiClientInfiniteQuery("getOwnedObjects", {
    owner: address,
    options: {
      showDisplay: true,
      showOwner: true,
      showContent: true,
      showType: true,
    },
  });

  const { data: eventsData } = useSuiClientQuery("queryEvents", {
    query: {
      MoveModule: {
        package: DEVNET_RELIGY_SYNC_PACKAGE_ID,
        module: "religy_sync",
      },
      // MoveEventType: "::religy_sync::ContentCreated", // Specific event type
    },
    limit: 50,
    order: "descending",
  });

  useEffect(() => {
    if (data) {
      console.log("Owned Objects:", data);
    }
  }, [data]);

  useEffect(() => {
    if (eventsData) {
      console.log("Events:", eventsData);
    }
  }, [eventsData]);

  if (!data) {
    return null;
  }

  // Choose which data you want to display
  // Uncomment one of these return statements and remove the others

  return (
    <div>
      <h3>Your Owned Objects</h3>
      <ul>
        {data?.pages[0].data?.map((object, index) => (
          <li key={index}>
            <a
              href={`https://devnet.suivision.xyz/object/${object.data?.objectId}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {object?.data.display.data?.name}
            </a>
          </li>
        ))}
      </ul>

      <h3>Content Created Events</h3>
      {eventsData && eventsData.data && eventsData.data.length > 0 ? (
        <ul>
          {eventsData.data.map((event, index) => (
            <li key={index}>
              <div>
                <strong>Timestamp:</strong>{" "}
                {new Date(Number(event.timestampMs)).toLocaleString()}
              </div>
              {event.parsedJson && (
                <div>
                  <strong>Content:</strong> <pre>{event.parsedJson.title}</pre>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div>No ContentCreated events found</div>
      )}
    </div>
  );
}

export default App;
