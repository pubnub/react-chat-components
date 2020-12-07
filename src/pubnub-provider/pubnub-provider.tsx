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
  channel: string;
  children: React.ReactNode;
  pubnub: PubNub;
  theme?: Themes;
  users?: UserData[];
}

interface PubNubProviderState {
  users: UserData[];
}

export class PubNubProvider extends React.Component<PubNubProviderProps, PubNubProviderState> {
  static defaultProps = {
    users: [],
  };

  constructor(props: PubNubProviderProps) {
    super(props);
    const { users } = props;
    this.state = { users: users || [] };
    this.updateUsers = this.updateUsers.bind(this);
  }

  updateUsers(users: unknown[]): void {
    this.setState({ users });
  }

  componentDidMount(): void {
    window.addEventListener("beforeunload", () => {
      this.props.pubnub.stop();
    });
  }

  componentWillUnmount(): void {
    this.props.pubnub.stop();
  }

  render(): JSX.Element {
    const { updateUsers } = this;
    const { users } = this.state;
    const { pubnub, channel, theme, children } = this.props;

    return (
      <PubNubContext.Provider value={{ pubnub, channel, theme, users, updateUsers }}>
        {children}
      </PubNubContext.Provider>
    );
  }
}
