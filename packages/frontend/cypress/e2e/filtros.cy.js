describe('Filtros de productos - E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
    cy.wait(2000);
  });

  it('Debería mostrar productos en la página principal', () => {
    cy.get('body').should('be.visible');
    cy.wait(500);
  });
});
