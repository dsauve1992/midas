class CloudFunctionApi {
   private static readonly BASE_URL =
      'https://us-central1-minerve-8238d.cloudfunctions.net'

   protected static buildUrl(path: string) {
      return `${this.BASE_URL}/${path}`
   }
}

export default CloudFunctionApi
