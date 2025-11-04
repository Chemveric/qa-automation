import { HttpException, Inject, Injectable } from "@nestjs/common";
import { JWTPayload, jwtVerify, SignJWT } from "jose";
import { ENV } from "../../src/config/env";

import { SignInJwtOptions } from "./jose-jwt-wrapper.types";

interface JwtSettings {
  secret: string;
  expiresIn: string;
  issuer: string;
  audience: string;
}
export class JoseJwtWrapper {
  private defaultSettings: JwtSettings;
  private signUpRejectSettings: JwtSettings;

  constructor() {
    this.defaultSettings = {
      secret: ENV.jwtDefaultSettings.secret!,
      expiresIn: ENV.jwtDefaultSettings.expiresIn!,
      issuer: ENV.jwtDefaultSettings.issuer!,
      audience: ENV.jwtDefaultSettings.audience!,
    };
    this.signUpRejectSettings = {
      secret: ENV.signUpRejectSettings.secret!,
      expiresIn: ENV.signUpRejectSettings.expiresIn!,
      issuer: ENV.jwtDefaultSettings.issuer!,
      audience: ENV.jwtDefaultSettings.audience!,
    };
  }

  async sign<TPayload extends JWTPayload>(
    payload: TPayload,
    opts: SignInJwtOptions
  ): Promise<string> {
    const { audience, expiresIn, secret, issuer } = opts;
    const key = new TextEncoder().encode(secret);
    const jwt = new SignJWT(payload)
      .setProtectedHeader({ alg: "HS256", typ: "JWT" })
      .setIssuer(issuer)
      .setAudience(audience)
      .setIssuedAt()
      .setExpirationTime(expiresIn);

    return jwt.sign(key);
  }

  // SignUp methods
  async signSignUpInvitationJwt(payload: {
    signUpInvitation: string;
  }): Promise<string> {
    return await this.sign(payload, this.defaultSettings);
  }

  async signSignUpRejectJwt(payload: {
    signUpReject: string;
  }): Promise<string> {
    return this.sign(payload, this.signUpRejectSettings);
  }


async signTestToken(payload: Record<string, any>): Promise<string> {
  const settings = {
    ...this.defaultSettings,
    secret: ENV.jwtDefaultSettings.secret || "test-secret",
    issuer: "test-issuer",
    audience: "test-audience",
    expiresIn: "1h",
  };

  return this.sign(payload, settings);
}

}
