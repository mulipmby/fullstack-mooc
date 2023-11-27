describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'TESTINAME',
            username: 'Testataan',
            password: 'salainen'
        }
        cy.request('POST', 'http://localhost:3003/api/users/', user)
        cy.visit('http://localhost:5173')
    })
    it('Login form is shown',  function() {
        cy.visit('http://localhost:5173')
        cy.contains('Log in to application')

    })

    describe('Login',function() {
        it('succeeds with correct credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('Testataan')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
        })

        it('fails with wrong credentials', function() {
            cy.contains('login').click()
            cy.get('#username').type('mulipmby')
            cy.get('#password').type('wrongpassword')
            cy.get('#login-button').click()

            cy.contains('wrong username or password')
        })
    })

})