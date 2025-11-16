describe('Flujo de Vendedor - E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3001');
    cy.wait(1000);
  });

  it('Debería mostrar enlaces de navegación', () => {
    cy.contains(/iniciar sesión|login/i).should('exist');
    cy.contains(/registrarse|register/i).should('exist');
  });
});
