import React, { FC } from "react";
import { Text, View, Image, FlatList, Pressable, ListRenderItem } from "react-native";
import {
  ChannelEntity,
  CommonChannelListProps,
  useChannelListCore,
} from "@pubnub/common-chat-components";
import { useStyle } from "../helpers";
import createDefaultStyle, { ChannelListStyle } from "./channel-list.style";

export type ChannelListProps = CommonChannelListProps & {
  /** Callback run when a user long pressed one of the channels. Can be used for extra actions menu. */
  onChannelLongPressed?: (channel: ChannelEntity) => unknown;
  /** Options to provide custom StyleSheet for the component. It will be merged with the default styles. */
  style?: ChannelListStyle;
};

/**
 * Renders an interactive list of channels.
 *
 * It can represent all channels of the application, only
 * channels joined by the current user, all channels available to be joined, or whatever else is
 * passed into it. A common pattern in chat applications is to render two instances of the
 * component - one visible all the time to show joined channels, and another one hidden inside a
 * modal with channels available to join. Make sure to handle the onChannelSwitched event to switch
 * the current channel passed to the Chat provider.
 */
export const ChannelList: FC<ChannelListProps> = (props: ChannelListProps) => {
  const { channelFromString, channelSorter, isChannelActive, switchChannel, theme } =
    useChannelListCore(props);
  const style = useStyle<ChannelListStyle>({
    theme,
    createDefaultStyle,
    customStyle: props.style,
  });

  const renderChannel: ListRenderItem<ChannelEntity> = ({ item }) => {
    const channel = item;
    if (props.channelRenderer) return props.channelRenderer(channel);

    return (
      <Pressable
        onPress={() => switchChannel(channel)}
        onLongPress={() => props.onChannelLongPressed && props.onChannelLongPressed(channel)}
        style={({ pressed }) => pressed && style.channelPressed}
      >
        <View style={[style.channel, isChannelActive(channel) && style.channelActive]}>
          {channel.custom?.profileUrl && (
            <Image
              style={style.channelThumb}
              source={{ uri: channel.custom?.profileUrl as string }}
            />
          )}
          <View style={style.channelTitle}>
            <Text style={style.channelName}>{channel.name || channel.id}</Text>
            {channel.description && (
              <Text style={style.channelDescription}>{channel.description}</Text>
            )}
          </View>
          <View style={style.channelActions}>
            {props.extraActionsRenderer && props.extraActionsRenderer(channel)}
          </View>
        </View>
      </Pressable>
    );
  };

  return (
    <View style={style.channelListWrapper} testID="channel-list-wrapper">
      <FlatList
        testID="channel-list"
        style={style.channelList}
        data={(props.channels as string[]).map(channelFromString).sort(channelSorter)}
        renderItem={renderChannel}
        keyExtractor={(channel) => channel.id}
      />
      <>{props.children}</>
    </View>
  );
};
