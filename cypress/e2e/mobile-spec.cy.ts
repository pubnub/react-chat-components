describe("empty spec", () => {
  it("passes", () => {
    cy.visit("http://localhost:19006/", {
      onBeforeLoad(win) {
        win.appConfig = {
          MessageInput: {
            // disabled: true,
            // onSend: () => {
            //   alert("Message Sent");
            // },
          },
        };
      },
    });
  });
});
