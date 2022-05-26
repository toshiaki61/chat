# chat-ex

This project was generated using [Nx](https://nx.dev).

The most powerful chat system i've ever come up with.

## features

- eslint import order
- tailwind
- scss
  - nx stylelint
  - typed scss modules
- pubsub
  - redis
- react
  - mfe
- nestjs
  - hot reload
- bunyan
- mongoose
- redux toolkit

## directory structure

```zsh
apps/
  admin/
    frontend/
      shell/ # project(mfe)
      account/ # project(mfe-remote)
      ...
    backend/ # project

  chat/
    ...
    frontend/ # project
    backend/ # project

  services/
    account/ # project
    chat/ # project
    ...

libs/
  admin/
    frontend/
      components/
        {feature} # project
      state/ # project
      shared/ # project
    backend/
      modules/ # nest module
        {feature} # project
      shared/ # project
  chat/
    ...
  shared/
    api/ # project
    data/ # project
    state/ # project
    utils/ # project

```

```mermaid
sequenceDiagram
    autonumber
    actor user
    participant stream as stream server
    participant chat as chat server
    participant pubsub
    participant bot as bot service
    participant integration as integration service
    participant db
    stream->>pubsub: subscribe
    user->>+stream: sse
    bot->>pubsub: subscribe
    integration->>pubsub: subscribe
    user->>chat: message
    chat->>db: save
    chat->>pubsub: publish
    Note left of pubsub: message_received
    pubsub->>+bot: publish
    pubsub->>+integration: publish
    bot->>bot: brain
    bot->>db: save
    bot->>-pubsub: publish
    Note right of pubsub: bot reply
    integration->>integration: reply
    integration->>db: save
    integration->>-pubsub: publish
    Note right of pubsub: reply from operator
    pubsub->>stream: publish
    stream->>-user: sse

```
