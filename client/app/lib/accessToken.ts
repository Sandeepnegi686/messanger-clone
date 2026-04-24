let accessToken: string | null = "";

function setAccessToken(token: string) {
  accessToken = token;
}

const getAccessToken = () => accessToken;

export { setAccessToken, getAccessToken };
