# Kobo E-Reader Omnivore to Pocket Proxy

This project aims to convert the Pocket App on the Kobo E-Reader, specifically the Kobo Clara model, into an [Omnivore](https://github.com/omnivore-app/omnivore/) reading device using Typescript, Node, and Express. The device utilizes the modified host file on the Kobo Clara, accessible via ssh on the Clara. It can be achieved by following the tutorial available at [https://yingtongli.me/blog/2018/07/30/kobo-telnet.html](https://yingtongli.me/blog/2018/07/30/kobo-telnet.html).

## How it works

This currently runs  within my local network, on a Raspberry Pi. By making changes to the Kobo Clara's host file, it acts as a proxy server that can redirect and intercept network requests from the e-reader. This allows us to intercept Pocket traffic, redirect it to Omnivore, and intercepts the archive. Other functionality is not yet enabled. 

## Demo 

[!VideoOfKobo](./docs/result1687943216.webm)

## Technology Used

- **Typescript:** The project is developed using Typescript, a typed superset of JavaScript, which offers improved tooling and code maintainability.
- **Node:** The project utilizes Node.js, a JavaScript runtime, to run the server-side code.
- **Express:** Express is a minimal and flexible web application framework for Node.js. It provides a robust set of features for building web applications and APIs.

## Getting Started

To get started with the Kobo E-Reader Omnivore to Pocket Proxy, follow these steps:

1. Ensure that you have this hosted somewhere, either locally, or on the cloud with a static ip.
2. Modify the host file on your Kobo Clara using the tutorial mentioned above.
3. Clone this repository to your Raspberry Pi or similar networked device.
4. Install the required dependencies by running the following command:
```
npm install

```
5. Start the server by running:
```
npm start
```

lease note that this project is open to contributions and improvements. If you have any suggestions or ideas to enhance the functionality or features, feel free to submit a pull request.

## License

This project is licensed under the [MIT License](LICENSE).