import React, { FC } from "react";
import { Text, View, Image, FlatList, Pressable, ListRenderItem } from "react-native";
import {
  CommonMemberListProps,
  UserEntity,
  getNameInitials,
  getPredefinedColor,
  useMemberListCore,
} from "@pubnub/common-chat-components";
import { useStyle } from "../helpers";
import createDefaultStyle, { MemberListStyle } from "./member-list.style";

export type MemberListProps = CommonMemberListProps & {
  /** Callback run when a user long pressed one of the members. Can be used for extra actions menu. */
  onMemberLongPressed?: (member: UserEntity) => unknown;
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: MemberListStyle;
};

/**
 * Renders a list of members.
 *
 * It can represent all users of the application, only members of
 * the current channel, users currently subscribed/present on the channel, or whatever else is passed
 * into it. Custom memberRenderer can be used to modify how the users are rendered. For example
 * you can add presence indicators.
 */
export const MemberList: FC<MemberListProps> = (props: MemberListProps) => {
  const { clickMember, isOwnMember, isPresentMember, memberFromString, memberSorter, theme } =
    useMemberListCore(props);
  const style = useStyle<MemberListStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });

  const renderMember: ListRenderItem<UserEntity> = ({ item }) => {
    const member = item;
    if (props.memberRenderer) return props.memberRenderer(member);
    const youString = isOwnMember(member.id) ? props.selfText : "";

    return (
      <Pressable
        onPress={() => clickMember(member)}
        onLongPress={() => props.onMemberLongPressed && props.onMemberLongPressed(member)}
        style={({ pressed }) => pressed && style.memberPressed}
      >
        <View style={style.member}>
          {isPresentMember(member.id) && <View style={style.memberPresence} />}
          <View style={[style.memberThumb, { backgroundColor: getPredefinedColor(member.id) }]}>
            {member.profileUrl ? (
              <Image style={style.memberThumbImage} source={{ uri: member.profileUrl as string }} />
            ) : (
              <Text style={style.memberThumbText}>{getNameInitials(member.name || member.id)}</Text>
            )}
          </View>
          <View style={style.memberTitle}>
            <Text style={style.memberName}>
              {member.name} {youString}
            </Text>
            {member.custom?.title && (
              <Text style={style.memberDescription}>{member.custom?.title}</Text>
            )}
          </View>
          <View style={style.memberActions}>
            {props.extraActionsRenderer && props.extraActionsRenderer(member)}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={style.memberListWrapper} testID="member-list-wrapper">
      <FlatList
        testID="member-list"
        style={style.memberList}
        data={(props.members as string[]).map(memberFromString).sort(memberSorter)}
        renderItem={renderMember}
        keyExtractor={(member) => member.id}
      />
      <>{props.children}</>
    </View>
  );
};

MemberList.defaultProps = {
  members: [],
  presentMembers: [],
  onMemberClicked: null,
  selfText: "(You)",
};
