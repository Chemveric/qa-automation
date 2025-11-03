type ExpLike = string | number | Date;

export interface SignInJwtOptions {
  secret: string;
  /** e.g. '10m', 600, or new Date(Date.now()+600_000) */
  expiresIn: ExpLike;
  audience: string;
  issuer: string;
}

export interface VerifyJwtOptions {
  audience: string;
  issuer: string;
  secret: string;
}
