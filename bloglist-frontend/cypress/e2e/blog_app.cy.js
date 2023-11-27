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

    describe('When logged in', function() {
        beforeEach(function() {
            cy.contains('login').click()
            cy.get('#username').type('Testataan')
            cy.get('#password').type('salainen')
            cy.get('#login-button').click()
        })

        it('A blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('testiblogi')
            cy.get('#author').type('testiblogaaja')
            cy.get('#url').type('testiblogi.fi')
            cy.get('#create-button').click()
            cy.contains('testiblogi')
        })

        it('A blog can be liked', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('testiblogi')
            cy.get('#author').type('testiblogaaja')
            cy.get('#url').type('testiblogi.fi')
            cy.get('#create-button').click()
            cy.contains('testiblogi')
            cy.contains('view').click()
            cy.contains('like').click()
            cy.contains('Likes 1')
        })
        it('A blog can be deleted', function() {
            cy.contains('create new blog').click()
            cy.get('#title').type('testiblogi')
            cy.get('#author').type('testiblogaaja')
            cy.get('#url').type('testiblogi.fi')
            cy.get('#create-button').click()
            cy.contains('testiblogi')
            cy.contains('view').click()
            cy.contains('remove').click()
            cy.wait(100)
            cy.on('window:confirm', (str) => {
                expect(str).to.equal('Remove blog testiblogi by testiblogaaja')
                cy.contains('OK').click()
            })
            cy.wait(100)
            cy.reload()
            cy.contains('testiblogi').should('not.exist')
            cy.contains('logout').click()
        })
        it('Blogs are ordered by likes', function() {

            cy.contains('create new blog').click()
            cy.get('#title').type('testiblogi')
            cy.get('#author').type('testiblogaaja')
            cy.get('#url').type('testiblogi.fi')
            cy.get('#create-button').click()
            cy.contains('testiblogi').contains('view').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.contains('hide').click()
            cy.wait(1000)

            cy.get('#title').type('testiblogi2')
            cy.get('#author').type('testiblogaaja2')
            cy.get('#url').type('testiblogi.fi2')
            cy.get('#create-button').click()
            cy.contains('testiblogi2').contains('view').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.contains('hide').click()
            cy.wait(1000)


            cy.get('#title').type('testiblogi3')
            cy.get('#author').type('testiblogaaja3')
            cy.get('#url').type('testiblogi.fi3')
            cy.get('#create-button').click()
            cy.contains('testiblogi3').contains('view').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.contains('like').click()
            cy.wait(1000)

            cy.reload()
            cy.wait(1000)

            cy.get('.blog').eq(0).should('contain', 'testiblogi2')
            cy.get('.blog').eq(1).should('contain', 'testiblogi3')
            cy.get('.blog').eq(2).should('contain', 'testiblogi')
        })

    })

})