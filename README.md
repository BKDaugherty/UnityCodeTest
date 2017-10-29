# UnityCodeTest
The actual REST API I was supposed to build for my Unity Code Test!
Thank you all for being so understanding!

## Launching the Service and its Tests
Before doing anything, first you need to install the node_modules
included in the package.json. Do this by running 'npm install' in the
root directory of the project.

To start the service simply run 'npm run start', and to run tests, simply run 'npm run test' while the service is live! After running the tests, the test report is generated at 'reports/UnityCodeTestReport.html'

## Dependencies
This project requires the following node_modules to function correctly.
* fs (File System)
* Express (Server side framework for routing)
* Mocha (Unit testing framework)
* Mochawesome (Formatting of test report)
* Request-promise (client api for HTTP requests)
* Request (dependency of request-promise)
