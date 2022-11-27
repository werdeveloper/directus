"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Article = void 0;

const env_1 = require("./../../node_modules/directus/dist/env");
const exceptions_1 = require("./../../node_modules/directus/dist/exceptions");
const path_1 = __importDefault(require("path"));
const database_1 = require("./../../node_modules/directus/dist/database");
const services_1 = require("./../../node_modules/directus/dist/services");
const { ItemsService } = services_1;

class Article {
  constructor(options) {
    this.knex = options.knex || database_1.default();
    this.accountability = options.accountability || null;
    this.schema = options.schema || null;
    this.next = options.next || null;
  }


  // Get the Articles Info
  async getArticlesInfo(fields, filter, deepFilter, sort, limit, req){
    try{
      const service = new ItemsService(
        'articles',
        { schema: req.schema }
      );
      const data = await service.readByQuery({
        filter: filter || {},
        deep: deepFilter || {},
        fields: fields || ['*'],
        sort: sort || [],
        limit: limit || -1
      });
      return data;
    } catch(err){
      console.log(err);
    }
  }


}
exports.Article = Article;
