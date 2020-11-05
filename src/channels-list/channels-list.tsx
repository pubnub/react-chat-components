import React from "react";
import { PubNubContext } from "../pubnub-provider";
import { BaseObjectsEvent } from "pubnub";
import LeaveIcon from "./leave.svg";
import "./channels-list.scss";

export interface ChannelsListProps {
  /* Select one of predefined themes */
  theme?: "light" | "dark";
  /* Show all, joined or unjoined channels only */
  show?: "all" | "joined" | "unjoined";
  /* Provide custom channel renderer if themes and CSS variables aren't enough */
  channelRenderer?: (props: ChannelRendererProps) => JSX.Element;
  /* A callback run when user joined a channel */
  onChannelJoined?: (channel: ChannelsListChannel) => unknown;
  /* A callback run when user left a channel */
  onChannelLeft?: (channel: ChannelsListChannel) => unknown;
  /* A callback run when user switched to a channel */
  onChannelSwitched?: (channel: ChannelsListChannel) => unknown;
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
    show: "all",
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

  private isChannelActive(channel: ChannelsListChannel) {
    return this.context.channel === channel.id;
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

  private async joinChannel(channel: ChannelsListChannel) {
    try {
      await this.context.pubnub.objects.setMemberships({ channels: [channel.id] });
      this.setState({ joinedChannels: [...this.state.joinedChannels, channel.id] });
      this.props?.onChannelJoined(channel);
    } catch (e) {
      console.error(e);
    }
  }

  private async leaveChannel(channel: ChannelsListChannel) {
    try {
      await this.context.pubnub.objects.removeMemberships({ channels: [channel.id] });
      this.setState({
        joinedChannels: [...this.state.joinedChannels.filter((id) => id !== channel.id)],
      });
      this.props?.onChannelLeft(channel);
    } catch (e) {
      console.error(e);
    }
  }

  private switchChannel(channel: ChannelsListChannel) {
    this.props?.onChannelSwitched(channel);
  }

  private setupMembershipEvents() {
    this.context.pubnub.addListener({
      objects: (e) => this.handleMembershipEvent(e),
    });

    console.log("hooking up events for: ", this.context.pubnub.getUUID());
    this.context.pubnub.subscribe({
      channels: [this.context.pubnub.getUUID()],
    });
  }

  /*
  /* Event handlers
  */

  private handleMembershipEvent(event: BaseObjectsEvent) {
    const msg = event.message;
    const eventChannel = msg.data.channel.id;

    console.log("handling membership event: ", event);

    if (msg.type !== "membership") return;
    if (msg.data.uuid.id !== this.context.pubnub.getUUID()) return;

    if (msg.event === "set" && !this.state.joinedChannels.includes(eventChannel)) {
      this.setState({ joinedChannels: [...this.state.joinedChannels, eventChannel] });
    }
    if (msg.event === "delete" && this.state.joinedChannels.includes(eventChannel)) {
      this.setState({
        joinedChannels: [...this.state.joinedChannels.filter((id) => id !== eventChannel)],
      });
    }
  }

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
      this.setupMembershipEvents();
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
    if (this.props.show === "joined" && !this.isChannelJoined(channel)) return;
    if (this.props.show === "unjoined" && this.isChannelJoined(channel)) return;

    const channelJoined = this.isChannelJoined(channel);
    const channelActive = this.isChannelActive(channel);
    const joinedClass = channelJoined ? "joined" : "unjoined";
    const activeClass = channelActive ? "pn-channel--active" : "";

    if (this.props.channelRenderer) return this.props.channelRenderer({ channel });

    return (
      <div
        key={channel.id}
        className={`pn-channel pn-channel--${joinedClass} ${activeClass}`}
        onClick={() => {
          this.isChannelJoined(channel) ? this.switchChannel(channel) : this.joinChannel(channel);
        }}
      >
        {channelJoined && this.props.show !== "joined" && (
          <span className="pn-channel__membership" />
        )}

        <div className="pn-channel__title">
          <p className="pn-channel__name">{channel.name}</p>
          <p className="pn-channel__description">{channel?.description}</p>
        </div>

        {channelJoined && (
          <span
            className="pn-channel__leave"
            onClick={(e) => {
              this.leaveChannel(channel);
              e.stopPropagation();
            }}
          >
            <LeaveIcon />
          </span>
        )}
      </div>
    );
  }
}
