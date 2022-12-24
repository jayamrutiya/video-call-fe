import React, { useEffect, useState } from "react";
import AgoraRTC from "agora-rtc-sdk-ng";
import { VideoPlayer } from "./VideoPlayer";
import { v4 as uuidv4 } from "uuid";

const APP_ID = "95d9004c9f094310b42333d76f3e5b60";
const TOKEN =
  "007eJxTYBBeU8Yvuvp7bgwDw9Y19i88d7Hc+zKzk/VeZccNB9Nl2koKDJamKZYGBibJlmkGlibGhgZJJkbGxsYp5mZpxqmmSWYGWzqXJTcEMjI0PNRkYIRCEJ+FISS1uISBAQDIEB3H";
const CHANNEL = "Test";

const client = AgoraRTC.createClient({
  mode: "rtc",
  codec: "vp8",
});

var localTracks = {
  videoTrack: null,
  audioTrack: null,
};

var remoteUsers = {};

var options = {
  appid: "95d9004c9f094310b42333d76f3e5b60",
  channel: "Test",
  uid: uuidv4(),
  token:
    "007eJxTYJg89egNo++mRUw6QopHv7y2K24sOXLQ9lrRBK6b3y+fXLpIgcHSNMXSwMAk2TLNwNLE2NAgycTI2Ng4xdwszTjVNMnMYMuEJckNgYwMsrv+MzMyQCCIz8IQklpcwsAAAMfEIUc=",
  accountName: "A",
};

export const VideoRoom = () => {
  const [users, setUsers] = useState([]);
  const [localTracks, setLocalTracks] = useState([]);
  const handleUserJoined = async (user, mediaType) => {
    await client.subscribe(user, mediaType);

    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
    }

    if (mediaType === "audio") {
    }
  };
  const handleUserLeft = (user) => {
    setUsers((previousUsers) =>
      previousUsers.filter((u) => u.uid !== user.uid)
    );
  };

  async function subscribe(user, mediaType) {
    const uid = user.uid;
    // subscribe to a remote user
    await client.subscribe(user, mediaType);
    console.log("subscribe success");
    if (mediaType === "video") {
      setUsers((previousUsers) => [...previousUsers, user]);
      user.videoTrack.play(`player-${uid}`);
    }
    if (mediaType === "audio") {
      user.audioTrack.play();
    }
  }

  function handleUserPublished(user, mediaType) {
    const id = user.uid;
    remoteUsers[id] = user;
    subscribe(user, mediaType);
  }

  useEffect(() => {
    client.on("user-published", handleUserPublished);
    client.on("user-left", handleUserLeft);

    [options.uid, localTracks.audioTrack, localTracks.videoTrack] = Promise.all(
      [
        // join the channel
        client.join(options.appid, options.channel, options.token, options.uid),
        // create local tracks, using microphone and camera
        AgoraRTC.createMicrophoneAudioTrack({ AEC: true, ANS: true }),
        AgoraRTC.createCameraVideoTrack(),
      ]
    );
    setUsers((previousUsers) => [
      ...previousUsers,
      {
        uid: options.uid,
        audioTrack: localTracks.audioTrack,
        videoTrack: localTracks.videoTrack,
      },
    ]);
    client.publish(Object.values(localTracks));

    // client.on("user-published", handleUserJoined);
    // client.on("user-left", handleUserLeft);

    // client
    //   .join(APP_ID, CHANNEL, TOKEN, uuidv4())
    //   .then((uid) =>
    //     Promise.all([
    //       uid,
    //       AgoraRTC.createMicrophoneAndCameraTracks({ AEC: true, ANS: true }),
    //       AgoraRTC.createCameraVideoTrack(),
    //     ])
    //   )
    //   .then(([uid, audioTracks, videoTrack]) => {
    //     const tracks = [audioTracks, videoTrack];
    //     setLocalTracks(tracks);
    //     setUsers((previousUsers) => [
    //       ...previousUsers,
    //       { uid, videoTrack, audioTracks },
    //     ]);
    //     client.publish(tracks);
    //     return () => {
    //       for (let localTrack of localTracks) {
    //         localTrack.stop();
    //         localTrack.close();
    //       }
    //       client.off("user-published", handleUserJoined);
    //       client.off("user-left", handleUserLeft);
    //       client.unpublish(tracks).then(() => client.leave());
    //     };
    //   });
  }, []);
  return (
    <div>
      VideoRoom
      {users.map((user) => (
        <VideoPlayer key={user.uid} user={user} />
      ))}
    </div>
  );
};
