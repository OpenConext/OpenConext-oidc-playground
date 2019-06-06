import React from "react";

export const authorizationProtocolT = () => (
  <span>
    The Open ID Connect server also is
    <br />a regular OAuth2 Authorization Server.
    <br />
    <br />
    Select the OAuth2 option to use only the
    <br />
    OAUth2 subset of the OpenID Connect standard.
    <br />
  </span>
);

export const grantTypesT = () => (
  <span>
    Grant types are a way to specify how a Relying Party wants to interact with the OIDC Server.
    <br />
  </span>
);

export const responseTypesT = () => (
  <div>
    <span>
      The type of response returned to the client when retrieving tokens. The set of response types supported:
      <br />
      <br />
    </span>
    <ul>
      <li>
        <code>code</code> - The RP requests for an Authorization Code
      </li>
      <li>
        <code>token</code> - The RP requests an Access Token
      </li>
      <li>
        <code>id_token</code> - The RP requests a signed JWT ID Token
      </li>
    </ul>
    <br />
    <span>
      The three can be combined in any way possible and the RP is requesting <br />
      all of the details for the combination specified. For example:
    </span>
    <br />
    <br />
    <ul>
      <li>
        <code>code token</code> - Request for both an Authorization Code and an Access Token
      </li>
      <li>
        <code>token id_token</code> - Request for both an Access Token and an ID Token
      </li>
      <li>
        <code>code token id_token</code> - Request for an Authorization Code, an Access Token and an ID Token.
      </li>
    </ul>
    <br />
    <span>
      Note that in the last example the <code>code</code> can be used to exchange the
      <br />
      Authorization Code for yet another pair of Access Token and ID Token
    </span>
  </div>
);

export const scopesT = () => (
  <div>
    <span>
      Scope is a mechanism in OAuth 2.0 to specify what access privileges
      <br />
      are being requested for Access Tokens. The scopes associated with Access Tokens determine what
      <br />
      resources will be available when they are used to access OAuth 2.0 protected endpoints.
      <br />
      <br />
    </span>
    <span>
      OpenID Connect extends on the <code>scope</code> concept to determine the specific sets
      <br />
      of information made available as Claim Values in the UserInfo endpoint.
    </span>
    <br />
    <br />
    <span>
      OIDC OpenConext does not use scopes for determining the Claim Values as this is dictated
      <br />
      by the Attribute Release Policy configured in Manage.
    </span>
  </div>
);

export const tokenEndpointAuthenticationT = () => (
  <span>
    The client authentication method used
    <br />
    to obtain the token in the Authorization Code flow.
    <br />
  </span>
);

export const requestedClaimsT = () => (
  <div>
    <span>
      The <code>claims</code> Authorization Request parameter is used to request for individual
      <br />
      and specific Claims to be returned from the UserInfo Endpoint and/or in the ID Token.
    </span>
    <br />
    <br />
    <span>
      The <code>claims</code> parameter value is represented in an OAuth 2.0 request as UTF-8
      <br />
      encoded JSON (which ends up being form-urlencoded when passed as an OAuth parameter).
    </span>
    <br />
    <br />
    <span>
      OIDC OpenConext only supports claims request for the ID Token and the Attribute Release Policy
      <br />
      decides if the claim requests are granted.
    </span>
  </div>
);

export const stateT = () => (
  <div>
    <span>
      Opaque value used to maintain state between the request and the callback.
      <br />
      <br />
      Typically, Cross-Site Request Forgery (CSRF, XSRF) mitigation is done by cryptographically
      <br />
      binding the value of this parameter with a browser cookie.
    </span>
  </div>
);

export const nonceT = () => (
  <div>
    <span>
      String value used to associate a Client session with an ID Token, and to mitigate
      <br />
      replay attacks. The value is passed through unmodified from the Authentication Request to
      <br />
      the ID Token.
      <br />
      <br />
      Sufficient entropy must be present in the nonce values used to prevent attackers from guessing values.
    </span>
  </div>
);

export const acrValuesT = () => (
  <div>
    <span>
      Requested Authentication Context Class Reference values. Space-separated string that specifies
      <br />
      the acr values that the Authorization Server is being requested to use for processing this
      <br />
      Authentication Request, with the values appearing in order of preference.
      <br />
      <br />
      The Authentication Context Class satisfied by the authentication performed is returned as the acr Claim Value.
      <br />
      <br />
      OIDC OpenConext passes the <code>acr_values</code> to the SAML Proxy for step-up authentication purposes.
    </span>
  </div>
);

export const pkceT = () => (
  <span>
    The PKCE-enhanced Authorization Code Flow introduces a secret created by the calling application that can be
    <br />
    verified by the authorization server; this secret is called the Code Verifier.
    <br />
    <br />
    Additionally, the calling app creates a transform value of the Code Verifier called the Code Challenge and sends
    <br />
    this value over HTTPS to retrieve an Authorization Code. This way, a malicious attacker can only intercept the
    <br />
    Authorization Code, and they cannot exchange it for a token without the Code Verifier.
    <br />
    <br />
    OIDC OpenConext requires a RP to ne marked as <code>public</code> in Manage. In the PKCE flow the RP does not <br />
    authenticate with a client secret.
  </span>
);

export const codeChallengeT = () => (
  <span>
    The Authorization Code Flow with Proof Key for Code Exchange (PKCE) is the
    <br /> standard Code flow with an additional <code>code_challenge</code>
    <br />
    parameter and a verification at the end.
    <br />
    The Code Challenge is the base64 URL-encoded SHA-256 hash of the Code Verifier.
    <br />
    <br /> It is intended for public / native clients.
  </span>
);

export const codeVerifierT = () => (
  <span>
    The code verifier is a random URL-safe string with a minimum length of 43 characters and a maximum length of 128.
    <br />
    It is used to generate a code challenge which sent in the authorization code flow with Proof Key for Code Exchange
    (PKCE).
  </span>
);

export const codeChallengeMethodT = () => (
  <span>The code challenge method is the method used to derive an authorization code challenge.</span>
);
