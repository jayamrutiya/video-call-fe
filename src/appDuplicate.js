import "./App.css";
import { useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./components/VideoPlayer";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

const options = {
  appid: "95d9004c9f094310b42333d76f3e5b60",
  channel: "Test",
  uid: null,
  token:
    "007eJxTYBBeU8Yvuvp7bgwDw9Y19i88d7Hc+zKzk/VeZccNB9Nl2koKDJamKZYGBibJlmkGlibGhgZJJkbGxsYp5mZpxqmmSWYGWzqXJTcEMjI0PNRkYIRCEJ+FISS1uISBAQDIEB3H",
  accountName: "A",
};

function App() {
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  // const [isLeaveDis, setIsLeaveDis] = useState(true);

  async function handleUserPublished(user, mediaType) {
    const id = user.uid;

    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  }

  function handleUserLeft(user) {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  }

  const joinRoom = async () => {
    setJoined(true);
    // setIsLeaveDis(false);
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    const [uid, audioTrack, videoTrack] = await Promise.all([
      // join the channel
      client.join(options.appid, options.channel, options.token || null),
      // create local tracks, using microphone and camera
      AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true }),
      AgoraRTC.createCameraVideoTrack(),
    ]);

    // videoTrack.play();

    const tracks = [audioTrack, videoTrack];
    setLocalTracks(tracks);

    await setUsers((previousUsers) => [
      ...previousUsers,
      {
        uid,
        audioTrack,
        videoTrack,
      },
    ]);

    client.publish(tracks);
  };

  async function leaveRoom() {
    for (let track in localTracks) {
      track.close();
      track.stop();
    }
    await client.leave();
  }

  return (
    <div className="App">
      {!joined && <button onClick={() => joinRoom()}>Join Room</button>}
      {/* <button onClick={() => leaveRoom()} disabled={isLeaveDis}>
        Leave Room
      </button> */}
      VideoRoom
      {joined &&
        users.map((user) => (
          <>
            <VideoPlayer key={user.uid} user={user} />{" "}
          </>
        ))}
    </div>
  );
}

export default App;
