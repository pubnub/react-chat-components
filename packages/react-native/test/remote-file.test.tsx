import React from "react";
import { Animated, Image, Platform } from "react-native";

import { RemoteFile } from "../src/message-list/remote-file";
import { render, screen, fireEvent, waitFor } from "../mock/custom-renderer";
import {
  EXPO_FILE_SYSTEM_MOCK,
  requestMediaLibraryPermissionMock,
  EXPO_SHARING_MOCK,
  EXPO_MEDIA_LIBRARY_MOCK,
} from "../mock/file-mocks";

Animated.sequence = () => {
  return {
    start: () => null,
    stop: () => null,
    reset: () => null,
  };
};

const getSizeMock = jest.spyOn(Image, "getSize");
getSizeMock.mockImplementation((url, cb) => {
  cb(300, 300);
});

jest.mock("expo-media-library", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../mock/file-mocks").EXPO_MEDIA_LIBRARY_MOCK;
});

jest.mock("expo-sharing", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../mock/file-mocks").EXPO_SHARING_MOCK;
});

jest.mock("expo-file-system", () => {
  // eslint-disable-next-line @typescript-eslint/no-var-requires
  return require("../mock/file-mocks").EXPO_FILE_SYSTEM_MOCK;
});

const commonProps = {
  style: {},
  onError: jest.fn(() => null),
  sheetPosition: new Animated.Value(0),
};

const imageFile = {
  id: "SomeImageId",
  name: "SomeImageName.jpg",
  url: "https://cdn.britannica.com/02/152302-050-1A984FCB/African-savanna-elephant.jpg",
};

const pdfFile = {
  id: "SomePdfId",
  name: "SomePdfName.pdf",
  url: "https://www.africau.edu/images/default/sample.pdf",
};

describe("Remote File", () => {
  beforeEach(() => {
    requestMediaLibraryPermissionMock.mockClear();
    [
      "usePermissions",
      "createAssetAsync",
      "getAlbumAsync",
      "createAlbumAsync",
      "addAssetsToAlbumAsync",
    ].forEach((key) => {
      EXPO_MEDIA_LIBRARY_MOCK[key].mockClear();
    });

    EXPO_SHARING_MOCK.shareAsync.mockClear();

    EXPO_FILE_SYSTEM_MOCK.StorageAccessFramework.requestDirectoryPermissionsAsync.mockClear();
    EXPO_FILE_SYSTEM_MOCK.StorageAccessFramework.createFileAsync.mockClear();
    EXPO_FILE_SYSTEM_MOCK.readAsStringAsync.mockClear();
    EXPO_FILE_SYSTEM_MOCK.writeAsStringAsync.mockClear();
    EXPO_FILE_SYSTEM_MOCK.createDownloadResumable.mockClear();
  });

  test("accepts an image url and renders it", async () => {
    render(<RemoteFile {...commonProps} file={imageFile} />);

    expect(await screen.findByText(imageFile.name)).not.toBeNull();
    await waitFor(async () => {
      expect(await screen.findByTestId(`message-list-image-${imageFile.id}`)).not.toBeNull();
    });
  });

  test("accepts a pdf url and shows name only", async () => {
    render(<RemoteFile {...commonProps} file={pdfFile} />);

    expect(await screen.findByText(pdfFile.name)).not.toBeNull();
    await waitFor(async () => {
      expect(await screen.queryByTestId(`message-list-image-${pdfFile.id}`)).toBeNull();
    });
  });

  test("successfuly downloads an image and plays an animation", async () => {
    render(<RemoteFile {...commonProps} file={imageFile} />);

    await fireEvent.press(await screen.findByTestId("message-list-file-download-button"));
    expect(EXPO_FILE_SYSTEM_MOCK.createDownloadResumable).toHaveBeenCalled();
    expect(commonProps.onError).not.toHaveBeenCalled();
    expect(requestMediaLibraryPermissionMock).toHaveBeenCalledTimes(1);
    expect(EXPO_MEDIA_LIBRARY_MOCK.createAssetAsync).toHaveBeenCalledTimes(1);
    expect(EXPO_MEDIA_LIBRARY_MOCK.getAlbumAsync).toHaveBeenCalledTimes(1);
    expect(EXPO_MEDIA_LIBRARY_MOCK.createAlbumAsync).toHaveBeenCalledTimes(1);
    expect(EXPO_MEDIA_LIBRARY_MOCK.addAssetsToAlbumAsync).not.toHaveBeenCalled();
  });

  test("downloads a file other than an image (iOS)", async () => {
    Platform.OS = "ios";
    render(<RemoteFile {...commonProps} file={pdfFile} />);

    await fireEvent.press(await screen.findByTestId("message-list-file-download-button"));

    expect(EXPO_SHARING_MOCK.shareAsync).toHaveBeenCalledTimes(1);
    expect(
      EXPO_FILE_SYSTEM_MOCK.StorageAccessFramework.requestDirectoryPermissionsAsync
    ).not.toHaveBeenCalled();
  });

  test("downloads a file other than an image (Android)", async () => {
    Platform.OS = "android";
    render(<RemoteFile {...commonProps} file={pdfFile} />);

    await fireEvent.press(await screen.findByTestId("message-list-file-download-button"));

    expect(EXPO_SHARING_MOCK.shareAsync).not.toHaveBeenCalled();

    expect(
      EXPO_FILE_SYSTEM_MOCK.StorageAccessFramework.requestDirectoryPermissionsAsync
    ).toHaveBeenCalled();
    expect(EXPO_FILE_SYSTEM_MOCK.writeAsStringAsync).toHaveBeenCalled();
  });
});
