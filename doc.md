### backend

```json
 "scripts": {
    "start": "node dist/server.js", // start thet server with js coe for production
    "start-dev": "ts-node src/server.ts", // ts-node run ts node server
    "dev": "nodemon --exec ts-node src/server.ts", // run ts node server with nodemon
    "build": "tsc --outDir dist/" // compile ts code to js under dist directory
}
```

1. Rate Limiting
   To prevent abuse of the refresh token endpoint, implement rate limiting. You can use a middleware like express-rate-limit to restrict the number of requests from a single user or IP address.

Example:

```javascript
import rateLimit from "express-rate-limit";

const refreshTokenLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // Limit each IP to 5 requests per windowMs
  message: "Too many refresh token requests, please try again later.",
});

// Apply the rate limiter to the refresh token endpoint
app.post("/refresh", refreshTokenLimiter, getAccessToken);
```

Using HTTP-only cookies to store tokens can be an effective strategy to enhance the security of your web application, particularly against Cross-Site Scripting (XSS) attacks. Here’s an explanation of XSS attacks, how they work, and how using HTTP-only cookies can help mitigate the risks.

What is XSS?
Cross-Site Scripting (XSS) is a type of security vulnerability that allows an attacker to inject malicious scripts into web pages viewed by users. If a user's browser executes these scripts, the attacker can gain access to sensitive information, such as authentication tokens, session cookies, or any data the script can access from the user's context.

How XSS Works:

Injection: An attacker injects malicious JavaScript into a web page. This can happen through various means, such as submitting a form with JavaScript code, exploiting vulnerabilities in user input handling, or compromising third-party libraries.
Execution: When a user visits the affected page, the malicious script runs in their browser.
Data Theft: The script can read cookies, local storage, or other sensitive data and send it to the attacker’s server.
Why Use HTTP-only Cookies?
HTTP-only Cookies are cookies that have the HttpOnly flag set. This means that they cannot be accessed through JavaScript (e.g., document.cookie). If an attacker tries to read these cookies via an XSS attack, they will not be able to access them.

Benefits of Using HTTP-only Cookies:

Protection from XSS: Since JavaScript cannot access HTTP-only cookies, even if an attacker injects a script, they cannot steal the tokens stored in those cookies.
Automatic Handling by Browsers: Cookies with the HttpOnly flag are automatically included in HTTP requests by the browser, simplifying token management.
Implementation Steps
Here’s how to implement the use of HTTP-only cookies to store JWT tokens in your application.

1. Setting the Cookie
   When you generate and send the JWT tokens (usually after login), you can set them as HTTP-only cookies:

```javascript
import { Response } from 'express';

export const login = async (req: Request, res: Response): Promise<void> => {
  // ... your authentication logic

  // Generate tokens
  const accessToken = jwt.sign({ id: user.id }, process.env.ACCESS_JWT_SECRET!, { expiresIn: '15m' });
  const refreshToken = jwt.sign({ id: user.id }, process.env.REFRESH_JWT_SECRET!, { expiresIn: '7d' });

  // Set refresh token as an HTTP-only cookie
  res.cookie('refreshToken', refreshToken, {
    httpOnly: true, // Prevents JavaScript access
    secure: process.env.NODE_ENV === 'production', // Use secure cookies in production
    sameSite: 'Strict', // Helps prevent CSRF
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
  });

  // Respond with the access token (if needed)
  res.json({ accessToken });
};
```

1. Accessing the Token
   On subsequent requests, you can read the cookie from the server-side without exposing it to JavaScript:

```javascript
export const getAccessToken = async (req: Request, res: Response): Promise<void> => {
  const refreshToken = req.cookies.refreshToken; // Read the cookie

  if (!refreshToken) {
    return res.status(401).json({ message: "Refresh token is required." });
  }

  try {
    // Verify the refresh token
    const payload = jwt.verify(refreshToken, process.env.REFRESH_JWT_SECRET!);

    // Generate new tokens as needed
    const newAccessToken = jwt.sign({ id: payload.id }, process.env.ACCESS_JWT_SECRET!, { expiresIn: '15m' });

    res.json({ accessToken: newAccessToken });
  } catch (error) {
    console.error("Error verifying refresh token:", error);
    res.status(401).json({ message: "Invalid refresh token." });
  }
};
```

1. Clearing the Cookie on Logout
   When the user logs out, clear the cookie:

```js
export const logout = async (req: Request, res: Response): Promise<void> => {
  res.clearCookie("refreshToken"); // Clear the cookie
  res.status(204).send(); // No content
};
```

Conclusion
Using HTTP-only cookies for storing JWT tokens enhances the security of your web application by protecting sensitive data from XSS attacks. The key benefits include:

Protection from JavaScript Access: Tokens stored in HTTP-only cookies cannot be accessed by JavaScript, mitigating the risk of theft through XSS.
Automatic Browser Management: Cookies are automatically included in requests, simplifying the handling of authentication tokens.
By implementing this strategy, you can help secure your application against one of the common vulnerabilities in web applications. Always consider combining this approach with other security measures, such as input validation and proper content security policies (CSP), to further strengthen your application's defenses.
