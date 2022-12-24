import "../../App.css";
import { useEffect, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "../VideoPlayer";
import { useLocation } from "react-router-dom";
import { namehandler } from "../../service/api.service";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

function Home() {
  const location = useLocation();
  const [joined, setJoined] = useState(false);
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  // const [isLeaveDis, setIsLeaveDis] = useState(true);

  async function handleUserPublished(user, mediaType) {
    const id = user.uid;
    const res = await namehandler(id);
    user.accountName = res.data.name;

    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  }

  const options = {
    appid: "95d9004c9f094310b42333d76f3e5b60",
    channel: location.state.channel,
    uid: location.state.uuid,
    token:
      "007eJxTYNC6/PR6hQqLV5vcAY8V5UE2O/Tl0+cXvP7c63Vq85uVK44qMFiaplgaGJgkW6YZWJoYGxokmRgZGxunmJulGaeaJpkZZF1bltwQyMgQ8O0jAyMUgvgsDCGpxSUMDAB8+yC4",
    accountName: location.state.name,
  };

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
      client.join(options.appid, options.channel, options.token, options.uid),
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
        accountName: location.state.name,
      },
    ]);

    client.publish(tracks);
  };

  return (
    <div className="App">
      {!joined && <button onClick={() => joinRoom()}>Join Room</button>}
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

export default Home;
