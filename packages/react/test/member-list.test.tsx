import React from "react";
import { MemberList } from "../src/member-list/member-list";
import members from "../../../data/users/users.json";
import { render, screen } from "../mock/custom-renderer";

describe("Member List", () => {
  test("renders members from objects", () => {
    render(<MemberList members={members} />);

    expect(screen.getByText("Anna Gordon")).toBeVisible();
    expect(screen.getByText("VP Marketing")).toBeVisible();
  });

  test("renders members from strings", () => {
    render(<MemberList members={["Moby Dick", "Peter Pan"]} />);

    expect(screen.getByText("Moby Dick")).toBeVisible();
  });

  test("renders current user as first and with a suffix", () => {
    const { container } = render(<MemberList members={members} />);

    expect(container.firstChild.firstChild).toHaveTextContent("Mark Kelley (You)");
  });

  test("renders passed in children", () => {
    const { container } = render(
      <MemberList members={members}>
        <p>Test String</p>
      </MemberList>
    );

    expect(container.firstChild.lastChild).toMatchInlineSnapshot(`
      <p>
        Test String
      </p>
    `);
  });

  test("renders with custom renderer", () => {
    const customRenderer = (user) => <p key={user.name}>Custom {user.name}</p>;
    render(<MemberList members={members} memberRenderer={customRenderer} />);

    expect(screen.getByText("Custom Anna Gordon")).toBeVisible();
    expect(screen.queryByText("Anna Gordon")).not.toBeInTheDocument();
  });

  test("renders extra actions", () => {
    const customRenderer = (user) => <p key={user.name}>Custom {user.name}</p>;
    render(<MemberList members={members} extraActionsRenderer={customRenderer} />);

    expect(screen.queryByText("Anna Gordon")).toBeVisible();
  });

  test("sorts members with custom function", () => {
    const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
    const { container } = render(<MemberList members={members} sort={customSorter} />);

    expect(container.firstChild.firstChild).toHaveTextContent("Victoria Torres");
    expect(container.firstChild.lastChild).toHaveTextContent("Anna Gordon");
  });
});
