export const initialFeatureFlags = [
  {
    id: "user-auth-service",
    name: "user-auth-service",
    icon: "package",
    version: "v1.12.4",
    expanded: true,
    endpoints: [
      {
        id: "ENABLE_SAML_SSO",
        name: "ENABLE_SAML_SSO",
        description: "Activates SAML 2.0 integration paths for enterprise tenents.",
        dependencies: ["core-db"],
        enabled: true,
      },
      {
        id: "ENABLE_PASSKEY_LOGIN",
        name: "ENABLE_PASSKEY_LOGIN",
        description: "Experimental: WebAuthn passkey registration and login flows.",
        dependencies: ["crypto-svc", "user-auth-db"],
        enabled: false,
      },
    ],
  },
  {
    id: "payment-gateway-service",
    name: "payment-gateway-service",
    icon: "payment",
    version: "v3.0.1",
    expanded: false,
    endpoints: [
      {
        id: "ENABLE_REFUNDS",
        name: "ENABLE_REFUNDS",
        description: "Controls issuing refunds from the payment console.",
        dependencies: ["ledger-db", "risk-svc"],
        enabled: false,
      },
      {
        id: "ENABLE_FRAUD_SCREENING",
        name: "ENABLE_FRAUD_SCREENING",
        description: "Routes card checks through the fraud screening pipeline.",
        dependencies: ["fraud-svc"],
        enabled: false,
      },
    ],
  },
  {
    id: "notification-dispatcher",
    name: "notification-dispatcher",
    icon: "mail",
    version: "",
    expanded: false,
    endpoints: [
      {
        id: "ENABLE_SMS",
        name: "ENABLE_SMS",
        description: "Dispatches transactional SMS notifications.",
        dependencies: ["sms-gateway"],
        enabled: true,
      },
      {
        id: "ENABLE_EMAIL",
        name: "ENABLE_EMAIL",
        description: "Dispatches transactional email notifications.",
        dependencies: ["mailer-svc"],
        enabled: true,
      },
    ],
  },
];
