import React from "react";
import { PubNubContext } from "../pubnub-provider";

export interface MembersListProps {
  /* Select one of predefined themes */
  theme?: "light" | "dark";
  // /* Disable fetching of the users data */
  // disableUserFetch?: boolean;
  // /* Provide user data for message display */
  // users: MessageListUser[];
  /* Disable fetching of messages stored in the history */
  // disableHistoryFetch?: boolean;
  /* Provide custom member renderer if themes and CSS variables aren't enough */
  // messageRenderer?: (props: MessageRendererProps) => JSX.Element;
  /* A callback run on new messages */
  // onMessage?: (message: MessageListMessage) => unknown;
}

interface MembersListState {
  members: any[];
}

export class MembersList extends React.Component<MembersListProps, MembersListState> {
  // private someRef: React.RefObject<HTMLDivElement>;

  static contextType = PubNubContext;
  // This is needed to have context correctly typed
  // https://github.com/facebook/create-react-app/issues/8918
  context!: React.ContextType<typeof PubNubContext>;

  constructor(props: MembersListProps) {
    super(props);
    this.state = {
      members: [],
    };
  }

  /*
  /* Commands
  */
  private async fetchMembers(pagination?: string) {
    try {
      const channel = this.context.channel;
      const response = await this.context.pubnub.objects.getChannelMembers({
        channel,
        limit: 50,
        page: { prev: pagination },
        include: { totalCount: true, UUIDFields: true, customUUIDFields: true },
      });
      const fetchedMembers = response.data.map((u) => u.uuid);
      this.setState({ members: [...this.state.members, ...fetchedMembers] });
      console.log(fetchedMembers);

      if (this.state.members.length < response.totalCount) {
        this.fetchMembers(response.next);
      }
    } catch (e) {
      console.error(e);
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
    } catch (e) {
      console.error(e);
    }
  }

  /*
  /* Renderers
  */

  render(): JSX.Element {
    const { members } = this.state;
    return <div>{members.map((m) => this.renderMember(m))}</div>;
  }

  private renderMember(member) {
    return <div key={member.uuid}>{member.name}</div>;
  }
}
