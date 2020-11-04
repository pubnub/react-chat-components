import React from "react";
import { PubNubContext } from "../pubnub-provider";
import "./channels-list.scss";

/*
  TODO:
  - ability to join channels from the list
  - ability to leave channels from the list
  - ability to only show joined channels
  - ability to onyl show unjoined channels
  - theme or variable to hide descriptions
*/

export interface ChannelsListProps {
  /* Select one of predefined themes */
  theme?: "light" | "dark";
  /* Provide custom channel renderer if themes and CSS variables aren't enough */
  channelRenderer?: (props: ChannelRendererProps) => JSX.Element;
}

export interface ChannelsListChannel {
  custom: {
    [key: string]: unknown;
  };
  description?: string;
  eTag?: string;
  id: string;
  name: string;
  updated: string;
}

export interface ChannelRendererProps {
  channel: ChannelsListChannel;
}

interface ChannelsListState {
  channels: ChannelsListChannel[];
  joinedChannels: string[];
}

export class ChannelsList extends React.Component<ChannelsListProps, ChannelsListState> {
  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
    theme: "light",
  };

  constructor(props: ChannelsListProps) {
    super(props);
    this.state = {
      channels: [],
      joinedChannels: [],
    };
  }

  /*
  /* Helper functions
  */

  private isChannelJoined(channel: ChannelsListChannel) {
    return this.state.joinedChannels.includes(channel.id);
  }

  private channelSorter(a, b) {
    if (this.isChannelJoined(a) && !this.isChannelJoined(b)) return -1;
    if (!this.isChannelJoined(a) && this.isChannelJoined(b)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  }

  /*
  /* Commands
  */

  private async fetchChannels(pagination?: string) {
    try {
      const response = await this.context.pubnub.objects.getAllChannelMetadata({
        sort: { name: "asc" },
        page: { next: pagination },
        include: { totalCount: true, customFields: true },
      });

      this.setState({ channels: [...this.state.channels, ...response.data] });

      if (this.state.channels.length < response.totalCount) {
        this.fetchChannels(response.next);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async fetchMemberships(pagination?: string) {
    try {
      const response = await this.context.pubnub.objects.getMemberships({
        uuid: this.context.pubnub.getUUID(),
        page: { next: pagination },
        include: { totalCount: true },
      });

      const joinedChannels = response.data.map((c) => c.channel.id);
      this.setState({
        joinedChannels: [...this.state.joinedChannels, ...joinedChannels],
      });

      if (this.state.joinedChannels.length < response.totalCount) {
        this.fetchMemberships(response.next);
      }
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Event handlers
  */

  /*
  /* Lifecycle
  */

  componentDidMount(): void {
    try {
      if (!this.context.pubnub)
        throw "Channels List has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";

      this.fetchChannels();
      this.fetchMemberships();
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Renderers
  */

  render(): JSX.Element {
    if (!this.context.pubnub || !this.context.channel.length) return null;
    const { channels } = this.state;
    const { theme } = this.props;

    return (
      <div className={`pn-channel-list pn-channel-list--${theme}`}>
        {channels.sort((a, b) => this.channelSorter(a, b)).map((m) => this.renderChannel(m))}
      </div>
    );
  }

  private renderChannel(channel) {
    const channelJoined = this.state.joinedChannels.includes(channel.id) ? "(Joined)" : "";

    if (this.props.channelRenderer) return this.props.channelRenderer({ channel });

    return (
      <div key={channel.id} className="pn-channel">
        <div className="pn-channel__main">
          <p className="pn-channel__name">
            {channel.name} {channelJoined}
          </p>
          <p className="pn-channel__description">{channel?.description}</p>
        </div>
      </div>
    );
  }
}
