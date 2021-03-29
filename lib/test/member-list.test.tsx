import React from "react";

import { MemberList } from "../src/member-list/member-list";
import members from "../../data/users.json";
import { render, screen } from "../mock/custom-renderer";

describe("Member List", () => {
  test("renders members from objects", () => {
    render(<MemberList memberList={members} />);

    expect(screen.getByText("Anna Gordon")).toBeVisible();
    expect(screen.getByText("VP Marketing")).toBeVisible();
  });

  test("renders members from strings", () => {
    render(<MemberList memberList={["Moby Dick", "Peter Pan"]} />);

    expect(screen.getByText("Moby Dick")).toBeVisible();
  });

  test("renders current user as first and with a suffix", () => {
    const { container } = render(<MemberList memberList={members} />);

    expect(container.firstChild.firstChild).toHaveTextContent("Mark Kelley (You)");
  });

  test("renders passed in children", () => {
    const { container } = render(
      <MemberList memberList={members}>
        <p>Test String</p>
      </MemberList>
    );

    expect(container.firstChild.lastChild).toMatchInlineSnapshot(`
      <p>
        Test String
      </p>
    `);
  });

  /** Properties */

  test("renders with custom renderer", () => {
    const customRenderer = (user) => <p key={user.name}>Custom {user.name}</p>;
    render(<MemberList memberList={members} memberRenderer={customRenderer} />);

    expect(screen.getByText("Custom Anna Gordon")).toBeVisible();
    expect(screen.queryByText("Anna Gordon")).not.toBeInTheDocument();
  });

  test("filters members with custom function", () => {
    const customFilter = (user) => user.name !== "Anna Gordon";
    render(<MemberList memberList={members} filter={customFilter} />);

    expect(screen.getByText("Luis Griffin")).toBeVisible();
    expect(screen.queryByText("Anna Gordon")).not.toBeInTheDocument();
  });

  test("sorts members with custom function", () => {
    const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
    const { container } = render(<MemberList memberList={members} sort={customSorter} />);

    expect(container.firstChild.firstChild).toHaveTextContent("Victoria Torres");
    expect(container.firstChild.lastChild).toHaveTextContent("Anna Gordon");
  });
});
