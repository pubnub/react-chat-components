import React, { useState, useEffect } from "react";
import {
  Image,
  ImageStyle,
  Text,
  TextStyle,
  View,
  ViewStyle,
  TouchableOpacity,
  Platform,
  Animated,
  Easing,
  Dimensions,
  ActivityIndicator,
} from "react-native";
import DownloadIcon from "../icons/download.png";
import { FileAttachment } from "@pubnub/common-chat-components";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Sharing from "expo-sharing";

type RemoteImageProps = {
  style: {
    imageFile?: ImageStyle;
    fileDownloadContainer?: ViewStyle;
    fileNameText?: TextStyle;
    downloadIconStyle?: ImageStyle;
    downloadingInProgressIconContainer?: ViewStyle;
  };
  file: FileAttachment;
  onError: (error: Error) => unknown;
  sheetPosition: Animated.Value;
};

const SHEET_POSITION_ANIMATION_IN_TIME = 625;
const SHEET_POSITION_ANIMATION_OUT_TIME = 595;
const EASING_OUT = Easing.bezier(0.25, 0.46, 0.45, 0.94);
const EASING_IN = Easing.out(EASING_OUT);

export const RemoteFile = ({ style, file, onError, sheetPosition }: RemoteImageProps) => {
  const [loadError, setLoadError] = useState<null | boolean>(null);
  const [imageHeight, setImageHeight] = useState(0);
  const [isDownloading, setIsDownloading] = useState(false);

  const [, requestMediaLibraryPermission] = MediaLibrary.usePermissions();
  const isImage = /\.(svg|gif|jpe?g|tiff?|png|webp|bmp)$/i.test(file.name);

  useEffect(() => {
    if (!isImage) {
      return;
    }

    Image.getSize(
      file.url,
      (_, height) => {
        if (height < 300) {
          setImageHeight(height);
        } else {
          setImageHeight(300);
        }
      },
      (e) => {
        setLoadError(true);
        onError(e);
      }
    );
  }, [file.url, isImage, onError]);

  const downloadResumable = FileSystem.createDownloadResumable(
    file.url,
    FileSystem.documentDirectory + file.name,
    {}
  );

  const playDownloadSuccessfulAnimation = () => {
    Animated.sequence([
      Animated.timing(sheetPosition, {
        toValue: -300 - Dimensions.get("window").height / 2 + 80,
        easing: EASING_IN,
        duration: SHEET_POSITION_ANIMATION_IN_TIME,
        useNativeDriver: true,
      }),
      Animated.delay(500),
      Animated.timing(sheetPosition, {
        toValue: 0,
        easing: EASING_OUT,
        duration: SHEET_POSITION_ANIMATION_OUT_TIME,
        useNativeDriver: true,
      }),
    ]).start();
  };

  const downloadFile = async () => {
    try {
      setIsDownloading(true);

      const { uri, status, headers } = await downloadResumable.downloadAsync();

      if (status !== 200) {
        onError({ name: "FileNoLongerExists", message: "The file you're looking for is expired" });
        return;
      }

      if (isImage) {
        const mediaLibraryPermission = await requestMediaLibraryPermission();

        if (!mediaLibraryPermission.granted) {
          onError({
            name: "MediaLibraryPermission",
            message: "MediaLibraryPermission is not granted",
          });
          return;
        }

        const asset = await MediaLibrary.createAssetAsync(uri);
        const album = await MediaLibrary.getAlbumAsync("Download");
        if (album == null) {
          await MediaLibrary.createAlbumAsync("Download", asset, false);
        } else {
          await MediaLibrary.addAssetsToAlbumAsync([asset], album, false);
        }
        playDownloadSuccessfulAnimation();
        return;
      }
      if (Platform.OS === "ios") {
        await Sharing.shareAsync(uri, { UTI: "public.item" });
      }
      if (Platform.OS === "android") {
        const storageAccessFrameworkPermission =
          await FileSystem.StorageAccessFramework.requestDirectoryPermissionsAsync();
        if (!storageAccessFrameworkPermission.granted) {
          onError({
            name: "StorageAccessFrameworkPermission",
            message: "StorageAccessFrameworkPermission is not granted",
          });
          return;
        }

        const fileString = await FileSystem.readAsStringAsync(uri, {
          encoding: FileSystem.EncodingType.Base64,
        });
        const storageFileUri = await FileSystem.StorageAccessFramework.createFileAsync(
          storageAccessFrameworkPermission.directoryUri,
          file.name,
          headers["content-type"]
        );
        await FileSystem.writeAsStringAsync(storageFileUri, fileString, {
          encoding: FileSystem.EncodingType.Base64,
        });
      }

      playDownloadSuccessfulAnimation();
    } catch (e) {
      onError(e);
    } finally {
      setIsDownloading(false);
    }
  };

  return (
    <View>
      {isImage && imageHeight > 0 && (
        <Image
          source={{ uri: file.url }}
          style={[{ height: imageHeight }, style.imageFile]}
          resizeMode="cover"
          testID={`message-list-image-${file.id}`}
        />
      )}
      {loadError && <Text>Unable to load file from the server</Text>}
      {!loadError && !isDownloading && (
        <TouchableOpacity
          style={style.fileDownloadContainer}
          testID="message-list-file-download-button"
          onPress={downloadFile}
        >
          <Text style={style.fileNameText} numberOfLines={1} ellipsizeMode="middle">
            {file.name}
          </Text>
          <Image source={{ uri: DownloadIcon }} style={style.downloadIconStyle} />
        </TouchableOpacity>
      )}
      {isDownloading && (
        <View style={style.downloadingInProgressIconContainer}>
          <ActivityIndicator size="small" />
        </View>
      )}
    </View>
  );
};
