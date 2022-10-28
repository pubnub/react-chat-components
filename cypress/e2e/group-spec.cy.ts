describe("empty spec", () => {
  it("passes", () => {
    cy.visit("http://127.0.0.1:5173/", {
      onBeforeLoad(win) {
        win.appConfig = {
          State: {
            // theme: "dark",
          },
          Chat: {
            // currentChannel: "space.a204f87d215a40985d35cf84bf5",
          },
          MessageInput: {
            // fileUpload: "all",
            // emojiPicker: false,
          },
          MessageList: {
            // fetchMessages: 0,
          },
        };
      },
    });

    cy.wait(2000);

    // cy.get(".theme-switcher button").click();

    // cy.get(".pn-msg-input__textarea").type("Testing Message");

    // cy.get(".pn-msg-input__send").click();

    cy.get(".pn-msg-list").contains("Testing Message");
  });
});
