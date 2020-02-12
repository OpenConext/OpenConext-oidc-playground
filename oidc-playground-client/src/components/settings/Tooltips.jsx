import React from "react";

export const authorizationProtocolT = () => (
    <span>
    The Open ID Connect server also is
    <br/>a regular OAuth2 Authorization Server.
    <br/>
    <br/>
    Select the OAuth2 option to use only the
    <br/>
    OAUth2 subset of the OpenID Connect standard.
    <br/>
  </span>
);

export const grantTypesT = () => (
    <span>
    Grant types are a way to specify how a Relying Party wants to interact with the OIDC Server.
    <br/>
  </span>
);

export const responseTypesT = () => (
    <div>
    <span>
      The type of response returned to the client when retrieving tokens. The set of response types supported:
      <br/>
      <br/>
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
        <br/>
        <span>
      The three can be combined in any way possible and the RP is requesting <br/>
      all of the details for the combination specified. For example:
    </span>
        <br/>
        <br/>
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
        <br/>
        <span>
      Note that in the last example the <code>code</code> can be used to exchange the
      <br/>
      Authorization Code for yet another Access Token and ID Token pair.
    </span>
    </div>
);

export const responseModeT = () => (<div>
  <span>Informs the Authorization Server of the mechanism to be used for returning <br/>
  Authorization Response parameters from the Authorization Endpoint.
    <br/>
    <br/>
  </span>
    <ul>
        <li>
            <code>query</code> - Authorization Response parameters are encoded in the <br/>
            query string added to the redirect_uri when redirecting back to the Client.
        </li>
        <br/>
        <li>
            <code>fragment</code> - Authorization Response parameters are encoded in the <br/>
            fragment added to the redirect_uri when redirecting back to the Client.
        </li>
        <br/>
        <li><code>form_post</code> - Authorization Response parameters are encoded <br/>
            as HTML form values that are auto-submitted in the browser.
        </li>
    </ul>
    <br/>
    <span>
    The default Response Mode for the <code>code</code> Response Type is the <br/>
    <code>query</code> encoding. The default Response Mode for the <code>token</code> Response<br/>Type is the <code>fragment</code> encoding.
  </span>
</div>);

export const scopesT = () => (
    <div>
    <span>
      Scope is a mechanism in OAuth 2.0 to specify what access privileges
      <br/>
      are being requested for Access Tokens. The scopes associated with Access Tokens determine what
      <br/>
      resources will be available when they are used to access OAuth 2.0 protected endpoints.
      <br/>
      <br/>
    </span>
        <span>
      OpenID Connect extends on the <code>scope</code> concept to determine the specific sets
      <br/>
      of information made available as Claim Values in the UserInfo endpoint.
    </span>
        <br/>
        <br/>
        <span>
      OIDC OpenConext does not use scopes for determining the Claim Values as this is dictated
      <br/>
      by the Attribute Release Policy configured in Manage.
    </span>
    </div>
);

export const tokenEndpointAuthenticationT = () => (
    <span>
    The client authentication method used to obtain the token
    <br/>
     in the Authorization Code and Client Credentials flow.
    <br/>
  </span>
);

export const requestedClaimsT = () => (
    <div>
    <span>
      The <code>claims</code> Authorization Request parameter is used to request for individual
      <br/>
      and specific Claims to be returned from the UserInfo Endpoint and/or in the ID Token.
    </span>
        <br/>
        <br/>
        <span>
      The <code>claims</code> parameter value is represented in an OAuth 2.0 request as UTF-8
      <br/>
      encoded JSON (which ends up being form-urlencoded when passed as an OAuth parameter).
    </span>
        <br/>
        <br/>
        <span>
      OIDC OpenConext only supports claims request for the ID Token and the Attribute Release Policy
      <br/>
      decides if the claim requests are granted.
    </span>
    </div>
);

export const stateT = () => (
    <div>
    <span>
      Opaque value used to maintain state between the request and the callback.
      <br/>
      <br/>
      Typically, Cross-Site Request Forgery (CSRF, XSRF) mitigation is done by cryptographically
      <br/>
      binding the value of this parameter with a browser cookie.
    </span>
    </div>
);

export const nonceT = () => (
    <div>
    <span>
      String value used to associate a Client session with an ID Token, and to mitigate
      <br/>
      replay attacks. The value is passed through unmodified from the Authentication Request to
      <br/>
      the ID Token.
      <br/>
      <br/>
      Sufficient entropy must be present in the nonce values used to prevent attackers from guessing values.
    </span>
    </div>
);

export const loginHintT = () => (
    <div>
    <span>Defined by the spec as a hint to the Authorization Server about the login<br/>identifier the End-User might use to log in.
      <br/>
      <br/>
      OIDC OpenConext passes the <code>login_hint</code> authorization parameter to the<br/>
      SAML Proxy to scope the WAYF. <br/>
      <br/>The <code>login_hint</code> is a comma-separated string of entity ID's<br/>
      which will be added to the IDPList element in the SAML authn request.
        <br/>

    </span>
    </div>);

export const acrValuesT = () => (
    <div>
    <span>
      Requested Authentication Context Class Reference values. Space-separated string that specifies
      <br/>
      the acr values that the Authorization Server is being requested to use for processing this
      <br/>
      Authentication Request, with the values appearing in order of preference.
      <br/>
      <br/>
      The Authentication Context Class satisfied by the authentication performed is returned as the acr Claim Value.
      <br/>
      <br/>
      OIDC OpenConext passes the <code>acr_values</code> to the SAML Proxy for step-up authentication purposes.
    </span>
    </div>
);

export const pkceT = () => (
    <span>
    The PKCE-enhanced Authorization Code Flow introduces a secret created by the calling application that can be
    <br/>
    verified by the authorization server; this secret is called the Code Verifier.
    <br/>
    <br/>
    Additionally, the calling app creates a transform value of the Code Verifier called the Code Challenge and sends
    <br/>
    this value over HTTPS to retrieve an Authorization Code. This way, a malicious attacker can only intercept the
    <br/>
    Authorization Code, and they cannot exchange it for a token without the Code Verifier.
    <br/>
    <br/>
    OIDC OpenConext requires a RP to be marked as <code>public</code> in Manage when the RP wants to use the PKCE flow <br/>
    without authenticating with a client secret.
  </span>
);

export const omitAuthenticationT = () => (
    <span>
    The PKCE flow is mainly intented to use for clients marked as <code>public</code> in Manage.
    <br/>
    <br/>
    However non-public clients are of course also allowed to use this flow, but non-public clients are required to
    <br/>
    authenticate with <code>client-id</code> and <code>secret</code>
    <br/>
    <br/>
    Toggle this checkbox to respectively omit or include the client credentials in the <code>token</code> endpoint.
  </span>
);

export const codeChallengeT = () => (
    <span>
    The Authorization Code Flow with Proof Key for Code Exchange (PKCE) is the
    <br/> standard Code flow with an additional <code>code_challenge</code>
    <br/>
    parameter and a verification at the end.
    <br/>
    The Code Challenge is the base64 URL-encoded SHA-256 hash of the Code Verifier.
    <br/>
    <br/> It is intended for public / native clients, but can also be used by regular RP's.
  </span>
);

export const codeVerifierT = () => (
    <span>
    The code verifier is a random URL-safe string with a minimum length of 43 characters and a maximum length of 128.
    <br/>
    It is used to generate a code challenge which sent in the authorization code flow with Proof Key for Code Exchange
    (PKCE).
  </span>
);

export const codeChallengeMethodT = () => (
    <span>The code challenge method is the method used to derive an authorization code challenge.
    <br/><br/>
    The <code>plain</code> method is supported, but not recommended.</span>
);

export const forceAuthenticationT = () => (
    <span>
    The 'Force authentication' option adds the <code>prompt</code> parameter with the value <code>login</code> to the<br/>
    authorization request. This will be 'translated' to <code>ForceAuthn="true"</code> as an attribute for the SAML <code>AuthnRequest</code>.
    <br/><br/>
    The Identity Provider must support this option in order to force the user to re-authenticate.
  </span>
);

export const signedJWTT = () => (
    <span>
    Open ID Connect has support for sealing all authorization parameters in a signed JWT. This ensures that OpenID <br/>
    authentication requests cannot be modified or tampered with.
    <br/><br/>
    Relying Parties that want to use SURF SecureID are encouraged to use this option for requesting the LOA-level in the<br/>
    <code>acr_values</code> request parameter. Note that the OIDC server will need to verify the JWT and therefore<br/>
    it reads the <code>coin:certificate</code> information in Manage for the RP.
  </span>
);

export const clientIdT = () => (
    <span>
    Identifier for the OIDC 1.0 Relying Party in Manage. If the Client ID is not known you will be redirected to an<br/>
    error page during authorization.
  </span>
);

export const clientSecretT = () => (
    <span>
    Secret for the OIDC 1.0 Relying Party in Manage. If the secret is not valid you will be redirected to an<br/>
    error page during authorization.
  </span>
);

export const authorizationRequestT = () => (
    <span>The request for Authorization Endpoint is a redirect requesting Authentication of the End-User.<br/>
  The browser sends the user to the OIDC Server's Authorization Endpoint for Authentication and Authorization,<br/>
  using request parameters defined by OAuth 2.0 and additional parameters and parameter values<br/>defined by OpenID Connect.</span>
);

export const tokenRequestT = () => (
    <span>The request for a token is performed through a back-channel - e.g. not the browser - by the Relying Party.<br/>
    The authorization code is exchanged for a access token and optional refresh token. The token endpoint is used<br/>
  with every authorization grant except for the implicit grant type (since an access token is issued directly).</span>
);

export const userInfoT = () => (
    <span>The UserInfo endpoint is an <code>access_token</code> protected resource of the OpenConext OIDC server<br/>
  where Relying Parties can retrieve consented claims about the logged in end-user.<br/></span>
);

export const discoveryT = () => (
    <span>The discovery endpoint defines a mechanism for an OpenID Connect Relying Party to discover the<br/>
    End-User's OpenID Provider and obtain information needed to interact with it, including its<br/>
    OAuth 2.0 endpoint locations.</span>
);

export const introspectT = () => (
    <span>The Token Introspection extension defines a mechanism for resource servers to obtain information about<br/>
  access tokens. Resource server can check the validity of access tokens with the result and other<br/>
  information such as which scopes are associated with the token.</span>
);

export const accessTokenT = () => (
    <span>The Access Token is a credential that can be used by a Relying Party to access an API. The OpenConext<br/>
  OIDC Server is a JSON Web Token (JWT) with the user claims encrypted for caching purposes.</span>
);

export const idTokenT = () => (
    <span>The ID Token, usually referred to as <code>id_token</code> in code samples, is a JSON Web Token (JWT)<br/>
    that contains the user profile attributes represented in the form of claims. The ID Token is<br/>
    consumed and validated by the Relying Party. Additional user information like the user's name<br/>
    and / or emailcan be requested by the <code>claims</code> request parameter.</span>
);
