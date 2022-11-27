const async_handler_1 = require("./../../../node_modules/directus/dist/utils/async-handler");
const middleware_respond = require("./../../../node_modules/directus/dist/middleware/respond");
const article = require("./ArticleController.js");
const validation = require('./../../helpers/validation_middleware');

module.exports = {
  id: "article",  // Route 
  handler: (router, { database, exceptions, services }) => {
    const { AuthenticationService, ItemsService } = services;
    const { InvalidCredentialsException, ForbiddenException, ServiceUnavailableException, InvalidPayloadException } = exceptions;   
    const artObj = new article({ services, exceptions, database });

    router.get(
      "/get_articles",
      async_handler_1.default(async (req, res, next) => {
        await artObj.getArticles(req, res, next);
      }),
      middleware_respond.respond
    );

    router.post(
      "/create_article",
      async_handler_1.default(async (req, res, next) => {
        // Validation
        let validationRes = await validation.articleValodation(req, res, next);
        console.log(validationRes);
        if(Object.keys(validationRes).length>0)
          return next(new InvalidPayloadException(validationRes));

        // await artObj.createArticle(req, res, next);
      }),
      middleware_respond.respond
    );

  },
};
