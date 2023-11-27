import { defineConfig } from 'cypress'



export default defineConfig({

    e2e: {

        setupNodeEvents(on, config) {

            on('before:browser:launch', (browser, launchOptions) => {

                console.log('Käynnistetään selain:', browser.name)

            })

        },

    },

})

