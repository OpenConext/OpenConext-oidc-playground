import React from "react";

export const authorizationProtocolT = () =>
  <span>The Open ID Connect server also is<br/>a regular OAuth2 Authorization Server.<br/><br/>
    Select the OAuth2 option to use only the<br/>OAUth2 subset of the OpenID Connect standard.<br/>
    </span>;

export const grantTypesT = () =>
  <span>Grant types are a way to specify how a Relying Party wants to interact with the OIDC Server.<br/></span>;

export const tokenEndpointAuthenticationT = () =>
  <span>The client authentication method used<br/>to obtain the token in the Authorization Code flow.<br/></span>;

export const pkceT = () =>
  <span>The PKCE-enhanced Authorization Code Flow introduces a secret created by the calling application that can be<br/>
  verified by the authorization server; this secret is called the Code Verifier.<br/><br/>
  Additionally, the calling app creates a transform value of the Code Verifier called the Code Challenge and sends<br/>
  this value over HTTPS to retrieve an Authorization Code. This way, a malicious attacker can only intercept the <br/>
  Authorization Code, and they cannot exchange it for a token without the Code Verifier.<br/></span>

export const codeChallengeT = () =>
    <span>The Authorization Code Flow with Proof Key for Code Exchange (PKCE) is the<br/> standard Code flow with an
        additional <code>code_challenge</code><br/>parameter and a verification at the end.<br/>
        The Code Challenge is the base64 URL-encoded SHA-256 hash of the Code Verifier.
        <br/><br/> It is intended for public / native clients.</span>;

export const codeVerifierT = () =>
  <span>The code verifier is a random URL-safe string with a minimum length of 43 characters and a maximum length of 128.<br/>
      It is used to generate a code challenge which sent in the authorization code flow with Proof Key for Code Exchange (PKCE).</span>

export const codeChallengeMethodT = () =>
  <span>The code challenge method is the method used to derive an authorization code challenge.</span>;