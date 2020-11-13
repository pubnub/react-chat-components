import React from "react";
import PubNub, { UserData } from "pubnub";

type Themes = "light" | "dark" | "support" | "support-dark" | "event" | "event-dark";

export type PubNubContextProps = {
  pubnub?: PubNub;
  channel: string;
  theme?: Themes;
  users: UserData[];
  updateUsers: (users: UserData[]) => void;
};

const defaultContext = {
  pubnub: undefined,
  channel: "",
  theme: "light" as const,
  users: [],
} as PubNubContextProps;

export const PubNubContext = React.createContext<PubNubContextProps>(defaultContext);

export interface PubNubProviderProps {
  publishKey: string;
  subscribeKey: string;
  uuid: string;
  channel: string;
  theme?: Themes;
  children: React.ReactNode;
}

interface PubNubProviderState {
  pubnub?: PubNub;
  users: UserData[];
}

export class PubNubProvider extends React.Component<PubNubProviderProps, PubNubProviderState> {
  constructor(props: PubNubProviderProps) {
    super(props);
    const { publishKey, subscribeKey, uuid } = props;
    const pubnub = new PubNub({
      publishKey,
      subscribeKey,
      uuid,
    });
    this.state = { pubnub, users: [] };
    this.updateUsers = this.updateUsers.bind(this);
  }

  updateUsers(users: unknown[]): void {
    this.setState({ users });
  }

  componentDidMount(): void {
    window.addEventListener("beforeunload", () => {
      this.state.pubnub.stop();
    });
  }

  componentDidUpdate(prevProps: PubNubProviderProps): void {
    const { publishKey, subscribeKey, uuid } = this.props;

    if (
      prevProps.publishKey !== publishKey ||
      prevProps.subscribeKey !== subscribeKey ||
      prevProps.uuid !== uuid
    ) {
      this.state.pubnub.stop();
      const pubnub = new PubNub({
        publishKey,
        subscribeKey,
        uuid,
      });
      this.setState({ pubnub });
    }
  }

  componentWillUnmount(): void {
    this.state.pubnub.stop();
  }

  render(): JSX.Element {
    const { updateUsers } = this;
    const { pubnub, users } = this.state;
    const { channel, theme, children } = this.props;

    return (
      <PubNubContext.Provider value={{ pubnub, channel, theme, users, updateUsers }}>
        {children}
      </PubNubContext.Provider>
    );
  }
}
