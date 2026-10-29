/* Optional preceptor application service configuration.
   Render Static Site cannot receive form submissions on its own.
   1. Create a form in a secure form service such as Formspree (or a compatible HTTPS endpoint).
   2. Set the endpoint to the service's URL, e.g. 'https://formspree.io/f/XXXXYYYY'.
   3. Test the form with sample details after verifying consent, privacy notice and spam protection.
   IMPORTANT: Do not put API secrets, tokens, or passwords in this public JavaScript file.
   If empty, the UI stays in preview/copy-only mode and does not transmit contact data.
*/
window.PP_PRECEPTOR_ENDPOINT = '';
