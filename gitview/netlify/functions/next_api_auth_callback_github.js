// This function handles GitHub OAuth callbacks for Next.js on Netlify
exports.handler = async (event, context) => {
  const redirectUrl = '/api/auth/callback/github' + event.rawUrl.split('/api/auth/callback/github')[1];
  
  return {
    statusCode: 302,
    headers: {
      Location: redirectUrl,
      'Cache-Control': 'no-cache'
    }
  };
};
