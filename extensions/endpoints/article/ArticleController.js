const services_2 = require("../../services");

class Article {
  constructor(options) {
    let { services, exceptions, database } = options;
    this.services = services;
    this.exceptions = exceptions;
    this.database = database;
  }

  async getArticles(req, res, next) {
      const { InvalidCredentialsException, ForbiddenException, ServiceUnavailableException, InvalidPayloadException } = this.exceptions;      
      try{
        const database = this.database;
        const { AuthenticationService, ItemsService } = this.services;      
        const ArticleService = new services_2.Article({ knex: database, schema: req.schema, accountability: req.accountability });

        // Get Article Info
        const masterArticleFilter = {
          status: {
            _eq: 'published'
          }
        };
        const masterArticleRes = await ArticleService.getArticlesInfo(['*'], masterArticleFilter, {}, ['id'], -1, req);
        
        if(masterArticleRes.length == 0)
          return next(new InvalidPayloadException("Invalid Article Id"));

        res.locals.payload = { data: masterArticleRes };
        return next();
      } catch(err){
        console.error(err);
        throw new InvalidPayloadException("Something went wrong");
      }
  }

  async createArticle(req, res, next) {
    const { InvalidCredentialsException, ForbiddenException, ServiceUnavailableException, InvalidPayloadException } = this.exceptions;      
    try{
      const database = this.database;
      const { AuthenticationService, ItemsService } = this.services;
      // Create Article
      let payload = {
        title: "Test",
        short_description: "Short Description",
        description: "Description"
      };
      const userServices = new ItemsService("articles", { schema: req.schema });
      const currentUserDetails = await userServices.createOne(payload);

      res.locals.payload = { data: currentUserDetails };
      return next();
    } catch(err){
      console.error(err);
      throw new InvalidPayloadException("Something went wrong");
    }
}

}

module.exports = Article;
