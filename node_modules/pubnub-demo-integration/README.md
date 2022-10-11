*Please be aware that this application / sample is provided as-is for demonstration purposes without any guarantee of support*
=========================================================

# PubNub-Demo-Integration

> This is an **internal** PubNub tool.

NPM module designed to be used in JavaScript and TypeScript applications to facilitate communication between a demo app and the PubNub guided demo framework.

## Installation

`npm i pubnub-demo-integration`

## Interface

To send a message to the demo framework to indicate an action is completed:

Typescript:

```typescript
actionCompleted(
  {
    action:'Action Name', 
    blockDuplicateCalls:true, // only applicable when called from the clientside
    debug:false
  });
```

Javascript:

```javascript
actionCompleted(
{
  action: 'Action Name',
  debug: false,
  windowLocation: 'http://...',  // Optionally, pass in the URL of the current page so the identifier can be determined from the query string
  fetchClient: object // If run from the serverside, you can pass in an HTTP client for the module to use.  Clientside will use fetch()
});
```

You also need to define the action in the demo project's `features.json` file, at the root of the project:

```json
{
    "features": [
      "Action Name"
    ]
}
```

