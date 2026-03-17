import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

class HMSTokenService {

  static appAccessKey = process.env.APP_ACCESS_KEY;
  static appSecret = process.env.APP_SECRET;

  managementToken;

  constructor() {
    this.managementToken = this.getManagementToken(true);
  }

  signPayloadToToken(payload) {
    return jwt.sign(payload, HMSTokenService.appSecret, {
      algorithm: "HS256",
      expiresIn: "24h",
      jwtid: uuidv4()
    });
  }

  isTokenExpired(token) {
    try {
      const { exp } = jwt.decode(token);
      const buffer = 30;
      const currTimeSeconds = Math.floor(Date.now() / 1000);

      return !exp || exp + buffer < currTimeSeconds;
    } catch (err) {
      console.log("Error decoding token", err);
      return true;
    }
  }

  getManagementToken(forceNew = false) {

    if (forceNew || this.isTokenExpired(this.managementToken)) {

      const payload = {
        access_key: HMSTokenService.appAccessKey,
        type: "management",
        version: 2,
        iat: Math.floor(Date.now() / 1000),
        nbf: Math.floor(Date.now() / 1000)
      };

      this.managementToken = this.signPayloadToToken(payload);
    }

    return this.managementToken;
  }

  getAuthToken({ room_id, user_id, role }) {

    const payload = {
      access_key: HMSTokenService.appAccessKey,
      room_id,
      user_id,
      role,
      type: "app",
      version: 2,
      iat: Math.floor(Date.now() / 1000),
      nbf: Math.floor(Date.now() / 1000)
    };

    return this.signPayloadToToken(payload);
  }
}

export default HMSTokenService;