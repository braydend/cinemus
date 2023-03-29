/// <reference types="cypress" />
/// <reference types="@testing-library/cypress" />

import "@testing-library/cypress/add-commands";

Cypress.Commands.add(
  "login",
  (username: string, password: string, host: string, authUrl: string) => {
    // Pass in dependencies via args option
    const args = { username, password };
    cy.origin(authUrl, { args }, ({ username, password }) => {
      cy.findByRole("input", { name: "Email address" }).type(username);
      cy.get("input").eq(2).type(password);
      cy.get("button").last().click();
      // This should be conditional
      if (cy.get("button").contains("Accept").should("exist")) {
        cy.get("button").first().click();
      }
    });
    cy.url().should("contain", host);
  }
);

// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//
// declare global {
//   namespace Cypress {
//     interface Chainable {
//       login(email: string, password: string): Chainable<void>
//       drag(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       dismiss(subject: string, options?: Partial<TypeOptions>): Chainable<Element>
//       visit(originalFn: CommandOriginalFn, url: string, options: Partial<VisitOptions>): Chainable<Element>
//     }
//   }
// }
