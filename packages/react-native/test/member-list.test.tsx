import React from "react";
import { Text } from "react-native";

import { MemberList } from "../src/member-list/member-list";
import members from "../../../data/users/users.json";
import { render, screen, fireEvent } from "../mock/custom-renderer";

describe("Member List", () => {
  test("renders members from objects", () => {
    render(<MemberList members={members} />);

    expect(screen.getByText("Anna Gordon")).not.toBeNull();
    expect(screen.getByText("VP Marketing")).not.toBeNull();
  });

  test("renders members from strings", () => {
    render(<MemberList members={["Moby Dick", "Peter Pan"]} />);

    expect(screen.getByText("Moby Dick")).not.toBeNull();
  });

  test("renders current user as first and with a suffix", () => {
    render(<MemberList members={members} />);

    expect(screen.getByText("Mark Kelley (You)")).not.toBeNull();
  });

  test("renders passed in children", () => {
    render(
      <MemberList members={members}>
        <Text>Test String</Text>
      </MemberList>
    );

    const child = screen.getByText("Test String");
    expect(screen.getByTestId("member-list-wrapper")).toContainElement(child);
  });

  test("renders with custom renderer", () => {
    const customRenderer = (user) => <Text>Custom {user.name}</Text>;
    render(<MemberList members={members} memberRenderer={customRenderer} />);

    expect(screen.getByText("Custom Anna Gordon")).not.toBeNull();
    expect(screen.queryByText("Anna Gordon")).toBeNull();
  });

  test("renders extra actions", () => {
    const customRenderer = (user) => <Text>Custom {user.name}</Text>;
    render(<MemberList members={members} extraActionsRenderer={customRenderer} />);

    expect(screen.queryByText("Anna Gordon")).not.toBeNull();
  });

  test("emits events on channel presses", () => {
    const handleClick = jest.fn();
    render(<MemberList members={members} onMemberClicked={handleClick} />);
    fireEvent.press(screen.getByText("Anna Gordon"));

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("emits events on channel long presses", () => {
    const handleClick = jest.fn();
    render(<MemberList members={members} onMemberLongPressed={handleClick} />);
    fireEvent(screen.getByText("Anna Gordon"), "onLongPress");

    expect(handleClick).toHaveBeenCalledTimes(1);
  });

  test("sorts members with custom function", () => {
    const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
    render(<MemberList members={members} sort={customSorter} />);

    expect(screen.getByTestId("member-list").props.data[0].name).toBe("Victoria Torres");
    expect(screen.getByTestId("member-list").props.data[members.length - 1].name).toBe(
      "Anna Gordon"
    );
  });
});
