import React from "react";

import { MemberList } from "../src/member-list/member-list";
import members from "../../data/users.json";
import { render } from "./helpers/custom-renderer";

test("renders members from objects", () => {
  const { getByText } = render(<MemberList memberList={members} />);

  expect(getByText("Adaline Appleberry")).toBeInTheDocument();
  expect(getByText("Office Assistant I")).toBeInTheDocument();
});

test("renders members from strings", () => {
  const { getByText } = render(<MemberList memberList={["Moby Dick", "Peter Pan"]} />);

  expect(getByText("Moby Dick")).toBeInTheDocument();
});

test("renders current user as first and with a suffix", () => {
  const { container } = render(<MemberList memberList={members} />);

  expect(container.firstChild.firstChild).toHaveTextContent("Gertie Gibbon (You)");
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
  const { getByText, queryByText } = render(
    <MemberList memberList={members} memberRenderer={customRenderer} />
  );

  expect(getByText("Custom Adaline Appleberry")).toBeInTheDocument();
  expect(queryByText("Adaline Appleberry")).not.toBeInTheDocument();
});

test("filters members with custom function", () => {
  const customFilter = (user) => user.name !== "Adaline Appleberry";
  const { getByText, queryByText } = render(
    <MemberList memberList={members} filter={customFilter} />
  );

  expect(getByText("Adelia Auten")).toBeInTheDocument();
  expect(queryByText("Adaline Appleberry")).not.toBeInTheDocument();
});

test("sorts members with custom function", () => {
  const customSorter = (a, b) => b.name.localeCompare(a.name, "en", { sensitivity: "base" });
  const { container } = render(<MemberList memberList={members} sort={customSorter} />);

  expect(container.firstChild.firstChild).toHaveTextContent("Zula Zufelt");
  expect(container.firstChild.lastChild).toHaveTextContent("Adaline Appleberry");
});
