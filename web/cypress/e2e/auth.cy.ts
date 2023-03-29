describe("Auth", () => {
  it("logs in correctly", () => {
    cy.visit("localhost:5173");

    cy.findByRole("button", { name: "Log In" }).click();

    cy.login(
      "test@email.com",
      "testpass",
      "localhost:5173",
      "https://dev-pt5nxvvf.au.auth0.com/"
    );
  });
});
