/**
 * Copyright (c) Facebook, Inc. and its affiliates.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 *
 */
import { Device } from '../../types';
/**
 * Parses the output of the `xcrun instruments -s` command and returns metadata
 * about available iOS simulators and physical devices, as well as host Mac for
 * Catalyst purposes.
 *
 * Expected text looks roughly like this:
 *
 * ```
 * Known Devices:
 * this-mac-device [UDID]
 * A Physical Device (OS Version) [UDID]
 * A Simulator Device (OS Version) [UDID] (Simulator)
 * ```
 */
declare function parseIOSDevicesList(text: string): Array<Device>;
export default parseIOSDevicesList;
//# sourceMappingURL=parseIOSDevicesList.d.ts.map