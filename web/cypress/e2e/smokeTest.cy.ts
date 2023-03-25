describe("smoke test", () => {
  it("passes", () => {
    // cy.visit(Cypress.env("CYPRESS_REACT_URL"));
    cy.visit("http://127.0.0.1:5173/");

    cy.findByRole("heading", { name: "Cinemus" }).should("exist");
  });
});
