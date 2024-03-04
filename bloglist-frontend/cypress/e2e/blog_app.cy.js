describe('Blog app', function() {
  beforeEach(function() {
    const user = {
      name: 'Niilo Ikonen',
      username: 'NIkonen',
      password: 'salainen'
    }
    cy.request('POST', `${Cypress.env('BACKEND')}/testing/reset`)
    cy.request('POST', `${Cypress.env('BACKEND')}/users`, user)
    cy.visit('')
  })

  it('Login form is shown', function() {
    cy.get('#username')
    cy.get('#password')
  })

  describe('Login',function() {
    it('succeeds with correct credentials', function() {
      cy.get('#username').type('NIkonen')
      cy.get('#password').type('salainen')
      cy.get('#loginButton').click()

      cy.contains('Niilo Ikonen logged in')
    })

    it('fails with wrong credentials', function() {
      cy.get('#username').type('nimi-joka-ei-ole-olemassa')
      cy.get('#password').type('salainen!!!')
      cy.get('#loginButton').click()

      cy.contains('wrong username or password')
    })

    describe('When logged in', function() {
      beforeEach(function() {
        cy.login({ username: 'NIkonen', password: 'salainen' })
      })

      it('A blog can be created', function() {
        cy.get('#newBlogButton').click()
        cy.get('#title').type('New blog post')
        cy.get('#author').type('Jaska Jokunen')
        cy.get('#url').type('https://fullstackopen.com/')
        cy.get('#submitBlogButton').click()

        cy.get('.blog').contains('New blog post')
      })

      describe('There is already one blog', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'Interesting blog title',
            author: 'Jaska Jokunen',
            url: 'https://fullstackopen.com/'
          })
        })

        it('A blog can be liked', function() {
          cy.get('.blog')
            .contains('Interesting blog title')
            .contains('show').click()

          cy.get('.blog')
            .contains('Interesting blog title')
            .parent()
            .find('.likes button').click()

          cy.get('.blog')
            .contains('Interesting blog title')
            .parent()
            .find('.likes').should('contain', '1')
        })

        it('A blog can be deleted', function() {
          cy.get('.blog')
            .contains('Interesting blog title')
            .contains('show').click()

          cy.get('.blog')
            .contains('Interesting blog title')
            .parent()
            .find('.removeButton').click()
        })

        it('Only the creator of a blog can delete it', function() {
          // The user that has created the blog can delete them
          cy.get('.blog')
            .contains('Interesting blog title')
            .contains('show').click()

          cy.get('.blog')
            .contains('Interesting blog title')
            .parent()
            .find('.removeButton')

          // creating another user
          const newUser = {
            name: 'Matti Luukkainen',
            username: 'mluukkai',
            password: 'salainen'
          }

          cy.request('POST', `${Cypress.env('BACKEND')}/users`, newUser)
          cy.login({ username: 'mluukkai', password: 'salainen' })

          // Testing that the other user cannot delete the blog
          cy.get('.blog')
            .contains('Interesting blog title')
            .contains('show').click()

          cy.get('.blog')
            .contains('Interesting blog title')
            .parent()
            .should('not.contain', '.removeButton')
        })
      })

      describe('There are multiple blogs', function() {
        beforeEach(function() {
          cy.createBlog({
            title: 'Interesting blog title',
            author: 'Jaska Jokunen',
            url: 'https://fullstackopen.com/'
          })
          cy.createBlog({
            title: 'Introduction to Functional Programming: JavaScript Paradigms',
            author: 'Avi Aryan',
            url: 'https://www.toptal.com/javascript/functional-programming-javascript'
          })
          cy.createBlog({
            title: 'Tutorial: Intro to React',
            author: 'React development team',
            url: 'https://legacy.reactjs.org/tutorial/tutorial.html'
          })
        })

        it('checking that blogs that are uploaded are in the correct order', function() {
          cy.get('.blog')
            .contains('Interesting blog title')
            .contains('show').click()

          cy.get('.blog')
            .contains('Introduction to Functional Programming: JavaScript Paradigms')
            .contains('show').click()

          cy.get('.blog')
            .contains('Tutorial: Intro to React')
            .contains('show').click()

          cy.like({ blogTitle: 'Interesting blog title' })
          cy.like({ blogTitle: 'Introduction to Functional Programming: JavaScript Paradigms', times: 3 })
          cy.like({ blogTitle: 'Tutorial: Intro to React', times: 2 })

          cy.get('.blog').eq(0).should('contain', 'Introduction to Functional Programming: JavaScript Paradigms')
          cy.get('.blog').eq(1).should('contain', 'Tutorial: Intro to React')
          cy.get('.blog').eq(2).should('contain', 'Interesting blog title')
        })
      })
    })
  })
})