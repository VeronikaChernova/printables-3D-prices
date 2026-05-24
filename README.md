1. Domain & Scope
I built an app to calculate the price of 3D printed products based on parameters such as layer width, height, and product weight.
 The user can calculate the price of a product and save it to a list (not fully implemented due to time constraints).
Price calculation is within scop. Saving to the list is almost in scope, a few fixes are still needed. Intentionally out of scope: detailed product info, deletion, and product list search, as those would require significantly more time.

3. Architecture
I created a core folder for the NgXS store as the main data store for the app. In the future, separate stores could be created for each feature folder. The store holds actions, selectors, and state for price calculation and product saving. The feature folder contains the printables price calculator. In the future, each feature could be lazy loaded. The printables.service has a mocked method to calculate price (no real API) based on data from websites that sell 3D printables.
I chose NgXS store and CSS global variables for colors so the app can be easily scaled and themed in the future, and so the codebase remains testable. Angular Material was chosen for its prebuilt components (such as modals) and to support future app updates.
I considered using the OpenAI API to calculate prices, but that would require exposing my API key in a public repository, which is not acceptable. I could have used a service with BehaviorSubjects instead of the NgXS store, but for scalability I prefer a store, and it can save data to the localStorage via NgxsStoragePlugin.
If the app were to grow more complex, I would: separate stores per feature, extract the product list into its own feature, increase test coverage, and work on app performance.

4. Trade-offs and Cuts
I did not use the zoneless Angular configuration as I have not tested it yet and it could cause issues with change detection.
With one more day I would complete the product saving logic, clean up some interfaces, and add notifications and error states. With one more week I would add a product detail page, product list search, and fix and test layout responsiveness. With a back-end I would add authentication and real API requests for saving products and calculating prices.

5. AI Usage
I used claude.ai to create the design with the Figma MCP server, and to generate component layouts and logic. The basic app structure and the part where the NgXS store integrates with the API I wrote myself.
AI proposed a different approach to form creation, but I wanted reactive forms with per-field validators, so I rewrote that part. The NgXS store suggestions from AI were also more complex than needed,they included effects, but I used a simpler structure. Some interface suggestions were also over-engineered for the scope of this app.

6. What to Look at First
PrintablesPricingCalculator — to see reactive form usage and how the NgXS store dispatches an action to get a calculated price, and how the priceEstimate signal from the store is used in the template. calculatePrice service — to see the mocked API request. core.state — to see how state is updated in response to actions.
