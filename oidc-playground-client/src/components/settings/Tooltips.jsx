import React from "react";

export const authorizationProtocol = () =>
  <span>The Open ID Connect server also is<br/>a regular OAuth2 Authorization Server.<br/><br/>
    Select the OAuth2 option to use only the<br/>OAUth2 subset of the OpenID Connect standard.<br/>
    </span>;

export const grantTypes = () =>
  <span>Grant types are a way to specify how a Relying Party wants to interact with the OIDC Server.<br/></span>;

export const tokenEndpointAuthentication = () =>
  <span>The client authentication method used<br/>to obtain the token in the Authorization Code flow.<br/></span>;
