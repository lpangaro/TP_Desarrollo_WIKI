describe('Flujo de compra - E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
    cy.wait(2000);
  });

  it('Debería permitir agregar productos al carrito', () => {
    cy.get('.boton-agregar-carrito').first().click();
    cy.wait(700);
    cy.get('a[href="/carrito"], .fa-bag-shopping').first().click();
    cy.wait(500);
    cy.url().should('include', '/carrito');
  });
});
