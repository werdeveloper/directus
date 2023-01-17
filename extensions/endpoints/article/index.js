const async_handler_1 = require("./../../../node_modules/directus/dist/utils/async-handler");
const middleware_respond = require("./../../../node_modules/directus/dist/middleware/respond");
const article = require("./ArticleController.js");
const validation = require('./../../helpers/validation_middleware');

// For File Upload
const services_1 = require("../../../node_modules/directus/dist/services");
const busboy_1 = __importDefault(require("busboy"));

module.exports = {
  id: "article",  // Route 
  handler: (router, { database, exceptions, services }) => {
    const { AuthenticationService, ItemsService } = services;
    const { InvalidCredentialsException, ForbiddenException, ServiceUnavailableException, InvalidPayloadException } = exceptions;   
    const artObj = new article({ services, exceptions, database });

    const multipartHandler = async_handler_1.default(async (req, res, next) => {
      if (req.is("multipart/form-data") === false) return next();
      const busboy = busboy_1.default({ headers: req.headers });
      const savedFiles = [];
      const service = new services_1.FilesService({ accountability: req.accountability, schema: req.schema });
      const existingPrimaryKey = undefined;
  
      let disk = "local"; //utils_1.toArray(env_1.default.STORAGE_LOCATIONS)[0];
      let payload = {};
      let fileCount = 0;
      busboy.on("field", (fieldname, val) => {
        if (typeof val === "string" && val.trim() === "null") val = null;
        if (typeof val === "string" && val.trim() === "false") val = false;
        if (typeof val === "string" && val.trim() === "true") val = true;
        if (fieldname === "storage") {
          disk = val;
        }
        payload[fieldname] = val;
      });
      var inputfields = {};
      busboy.on("file", async (fieldname, fileStream, filename, encoding, mimetype) => {
        var _a;
        // if (filename && !["image/jpg", "image/jpeg", "image/png"].includes(mimetype.toLowerCase())) {
        if (filename && !["image/jpg", "image/jpeg", "image/png"].includes(filename.mimeType.toLowerCase())) {
          return next(new InvalidPayloadException("Image must be jpeg or png"));
        }
        if (!payload.title) {
          // payload.title = format_title_1.default(path_1.default.parse(filename).name);
          payload.title = filename.filename;
        }
        if ((_a = req.accountability) === null || _a === void 0 ? void 0 : _a.user) {
          payload.uploaded_by = req.accountability.user;
        }
        const payloadWithRequiredFields = {
          ...payload,
          // filename_download: filename,
          filename_download: filename.filename,
          // type: mimetype,
          type: filename.mimeType,
          storage: payload.storage || disk,
        };
        // Clear the payload for the next to-be-uploaded file
        payload = {};
        try {
          if (filename) {
            fileCount++;
            const primaryKey = await service.uploadOne(fileStream, payloadWithRequiredFields, existingPrimaryKey);
            savedFiles.push(primaryKey);
          }
          tryDone();
        } catch (error) {
          busboy.emit("error", error);
        }
      });
  
      busboy.on("field", function (fieldname, val, fieldnameTruncated, valTruncated, encoding, mimetype) {
        inputfields[fieldname] = val;
      });
  
      busboy.on("error", (error) => {
        next(error);
      });
      busboy.on("finish", () => {
        tryDone();
      });
      req.pipe(busboy);
      function tryDone() {
        res.locals.inputfields = inputfields;
        if (savedFiles.length === fileCount) {
          res.locals.savedFiles = savedFiles;
          return next();
        }
      }
    });

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

    router.post(
      "/file_upload",
      multipartHandler,
      async_handler_1.default(async (req, res, next) => {
        try{          
            let data = res.locals.inputfields;
            let { email, avatar } = data;
            console.log("data", data);
            console.log("Uploaded Files", res.locals.savedFiles);

            //=========  Validation =================
            if (!email) return next(new InvalidPayloadException("Email must be provided."));    
            res.locals.payload = { data: {
                "input_data": data,
                "uploaded_files": res.locals.savedFiles
              }
            };
            return next();
          } catch (error) {
            console.log(error);
          }
      }),
      middleware_respond.respond
    );
    
  }
};
