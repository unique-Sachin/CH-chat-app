import { Html, Head, Main, NextScript } from "next/document";

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <title>CH Chat</title>
        <meta name="title" content="CH Chat" />
        <meta
          name="description"
          content="CH-chat-app enables a seamless real-time communication experience with instant messaging and video calls"
        />
        {/* <!-- Open Graph / Facebook --> */}
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ch-chat-app.vercel.app/" />
        <meta property="og:title" content="CH Chat" />
        <meta
          property="og:description"
          content="CH-chat-app enables a seamless real-time communication experience with instant messaging and video calls"
        />
        <meta property="og:image" content="/android-chrome-512x512.png" />

        {/* <!-- Twitter --> */}
        <meta property="twitter:card" content="summary_large_image" />
        <meta
          property="twitter:url"
          content="https://ch-chat-app.vercel.app/"
        />
        <meta property="twitter:title" content="CH Chat" />
        <meta
          property="twitter:description"
          content="CH-chat-app enables a seamless real-time communication experience with instant messaging and video calls"
        />
        <meta property="twitter:image" content="/android-chrome-512x512.png" />
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
