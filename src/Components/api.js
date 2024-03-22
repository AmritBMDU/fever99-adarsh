

export const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJhcGlrZXkiOiIwZWU1NmY3Yi1hNDIwLTQ2YWEtOGJiOS05OGY4Mzc3ODFhZGMiLCJwZXJtaXNzaW9ucyI6WyJhbGxvd19qb2luIl0sImlhdCI6MTcwMzU5NjI2NywiZXhwIjoxODYxMzg0MjY3fQ.gu2YtgI1yPkdTpuZlkoxKvQQpgFbHL0DZDqOLMJ6sAM";
// API call to create meeting
export const createMeeting = async ({ token }) => {
    const res = await fetch(`https://api.videosdk.live/v2/rooms`, {
        method: "POST",
        headers: {
            authorization: `${token}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({}),
    });

    const { roomId } = await res.json();
    return roomId;
};