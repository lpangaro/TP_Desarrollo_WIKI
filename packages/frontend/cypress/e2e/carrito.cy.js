describe('Carrito de compras - E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:3001');
    cy.wait(1500);
  });

  it('Debería agregar productos al carrito', () => {
    cy.get(".boton-agregar-carrito").first().click();
    cy.wait(700);
    // Buscar el link/botón del carrito de diferentes formas
    cy.get('a[href="/carrito"], button[aria-label*="Carrito"], .fa-bag-shopping').first().click();
    cy.wait(500);
    cy.get(".items").should("have.length.greaterThan", 0);
  });

  it('Debería agregar múltiples productos', () => {
    cy.get(".boton-agregar-carrito").eq(0).click();
    cy.wait(500);
    cy.get(".boton-agregar-carrito").eq(1).click();
    cy.wait(500);
    cy.get('a[href="/carrito"], button[aria-label*="Carrito"], .fa-bag-shopping').first().click();
    cy.wait(500);
    cy.get(".items").should("have.length.greaterThan", 1);
  });
});
