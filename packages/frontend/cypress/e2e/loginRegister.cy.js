describe('Login y Registro - E2E', () => {
  beforeEach(() => {
    cy.clearLocalStorage();
    cy.visit('http://localhost:3001');
    cy.wait(1000);
  });

  it('Debería navegar a la página de registro', () => {
    cy.contains(/registrarse/i).click();
    cy.url().should('include', '/register');
  });

  it('Debería navegar a la página de login', () => {
    cy.contains(/iniciar sesión/i).click();
    cy.url().should('include', '/login');
  });

  it('Debería mostrar el formulario de login', () => {
    cy.contains(/iniciar sesión/i).click();
    cy.get('input[type="email"]').should('exist');
    cy.get('input[type="password"]').should('exist');
    cy.get('button[type="submit"]').should('exist');
  });
});
