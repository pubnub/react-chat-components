import React from "react";
import { PubNubContext } from "../pubnub-provider";
import { PresenceEvent } from "pubnub";
import "./members-list.scss";

export interface MembersListProps {
  /* Select one of predefined themes */
  theme?: "light" | "dark";
  /* Provide custom member renderer if themes and CSS variables aren't enough */
  memberRenderer?: (props: MemberRendererProps) => JSX.Element;
  /* A callback run on presence status changes */
  onPresence?: (event: PresenceEvent) => unknown;
}

export interface MembersListMember {
  custom: {
    title: string;
    [key: string]: unknown;
  };
  eTag?: string;
  email?: string;
  externalId?: string;
  id: string;
  name: string;
  profileUrl: string;
  updated: string;
}

export interface MemberRendererProps {
  member: MembersListMember;
  memberPresent: boolean;
}

interface MembersListState {
  members: MembersListMember[];
  presentMembers: string[];
}

export class MembersList extends React.Component<MembersListProps, MembersListState> {
  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  static defaultProps = {
    theme: "light",
  };

  constructor(props: MembersListProps) {
    super(props);
    this.state = {
      members: [],
      presentMembers: [],
    };
  }

  /*
  /* Helper functions
  */

  private isOwnMember(uuid: string) {
    return this.context.pubnub?.getUUID() === uuid;
  }

  private memberSorter(a, b) {
    const pres = this.state?.presentMembers;

    if (this.isOwnMember(a.id)) return -1;
    if (this.isOwnMember(b.id)) return 1;

    if (pres.includes(a.id) && !pres.includes(b.id)) return -1;
    if (pres.includes(b.id) && !pres.includes(a.id)) return 1;

    return a.name.localeCompare(b.name, "en", { sensitivity: "base" });
  }

  /*
  /* Commands
  */

  private async fetchMembers(pagination?: string) {
    try {
      const { channel } = this.context;
      const response = await this.context.pubnub.objects.getChannelMembers({
        channel,
        sort: { "uuid.name": "asc" },
        page: { next: pagination },
        include: { totalCount: true, UUIDFields: true, customUUIDFields: true },
      });
      const fetchedMembers = response.data.map((user) => user.uuid);
      this.setState({ members: [...this.state.members, ...fetchedMembers] });

      if (this.state.members.length < response.totalCount) {
        this.fetchMembers(response.next);
      }
    } catch (e) {
      console.error(e);
    }
  }

  private async fetchPresence() {
    try {
      const { channel } = this.context;
      const response = await this.context.pubnub.hereNow({ channels: [channel] });
      const presentMembers = response.channels[channel].occupants.map((u) => u.uuid);
      this.setState({ presentMembers });
    } catch (e) {
      console.error(e);
    }
  }

  private setupPresenceEvents() {
    this.context.pubnub.addListener({
      presence: (e) => this.handlePresenceEvent(e),
    });

    this.context.pubnub.subscribe({
      channels: [`${this.context.channel}-pnpres`],
    });
  }

  /*
  /* Event handlers
  */

  private handlePresenceEvent(event: PresenceEvent) {
    if (this.props.onPresence) this.props.onPresence(event);
    if (event.channel !== this.context.channel) return;
    const currentlyPresent = this.state.presentMembers;

    if (event.action === "join") {
      if (currentlyPresent.includes(event.uuid)) return;
      this.setState({ presentMembers: [...currentlyPresent, event.uuid] });
    }

    if (["leave", "timeout"].includes(event.action)) {
      if (!currentlyPresent.includes(event.uuid)) return;
      this.setState({ presentMembers: currentlyPresent.filter((member) => member !== event.uuid) });
    }
  }

  /*
  /* Lifecycle
  */

  componentDidMount(): void {
    try {
      if (!this.context.pubnub)
        throw "Members List has no access to context. Please make sure to wrap the components around with PubNubProvider.";
      if (!this.context.channel.length)
        throw "PubNubProvider was initialized with an empty channel name.";

      this.fetchMembers();
      this.fetchPresence();
      this.setupPresenceEvents();
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Renderers
  */

  render(): JSX.Element {
    if (!this.context.pubnub || !this.context.channel.length) return null;
    const { members } = this.state;
    const { theme } = this.props;

    return (
      <div className={`pn-member-list pn-member-list--${theme}`}>
        {members.sort((a, b) => this.memberSorter(a, b)).map((m) => this.renderMember(m))}
      </div>
    );
  }

  private renderMember(member) {
    const youString = this.isOwnMember(member.id) ? "(You)" : "";
    const memberPresent = this.state.presentMembers.includes(member.id);

    if (this.props.memberRenderer) return this.props.memberRenderer({ member, memberPresent });

    return (
      <div key={member.id} className="pn-member">
        {member.profileUrl && (
          <div className="pn-member__avatar">
            <img src={member.profileUrl} alt="User avatar " />
          </div>
        )}
        {memberPresent && <span className="pn-member__presence" />}
        <div className="pn-member__main">
          <p className="pn-member__name">
            {member.name} {youString}
          </p>
          <p className="pn-member__title">{member?.custom?.title}</p>
        </div>
      </div>
    );
  }
}
