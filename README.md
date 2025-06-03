# EKA Healthcare Auth Proxy - Next.js

repo to be used if participants decide to use eka care's SDK on FE directly
obtain your client ID, client secret and API key and paste them in the below URL and click on the `deploy` button. that makes a repo in your vercel account, and will clone this repo and deploy, and then when initing the SDK on a FE client side app you can use this domain and api route. (more on that, link)

## 🚀 One-Click Deploy

- obtain your client ID, client
  [![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https://github.com/govind-eka/eka-vercel-nextjs&env=EKA_CLIENT_ID,EKA_CLIENT_SECRET,EKA_API_KEY&envDescription=Your%20EKA%20Healthcare%20API%20credentials%20from%20the%20hackathon&envLink=http://developer.eka.care/api-reference/)

**During deployment, you'll be prompted to enter:**

- `EKA_CLIENT_ID` - Your client ID
- `EKA_CLIENT_SECRET` - Your client secret
- `EKA_API_KEY` - Your API key

## 📋 Usage

After deployment, use your Vercel URL in the EKA SDK, on Frontend:

```js
const eka = createEkaInstance({
  source: "FE",
  auth_token: "initial-token",
  refresh_token: "initial-refresh",
  refreshTokenFN: myRefreshFn, // this is provided, in the NPM docs, you may copy it and use it on your FE apps
  backendAuthEndpointURL: "https://URL-that-vercel-gives-you/api/manage-auth",
});
```
