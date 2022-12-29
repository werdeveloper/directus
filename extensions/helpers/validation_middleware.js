const validator = require('validatorjs');

const articleValodation = async (req, res, next) => {
    const rules = {
        title: 'required|string|min:3|max:5',
        short_description: 'required|string',
        description: 'required|string',
    };
    const customErrorMessage = {
        "required.title": "Title is required!",
        "string.title": "Title is must be string!",
        "min.title": "Title min 3 char",
        "max.title": "Title max 5 char",
        "required.short_description": "Short Description is required!",
        "string.title": "Short_description is must be string!",
        "required.description": "Discription is required!",
        "string.description": "Description is must be string!",
    };
    const validation = new validator(req.body, rules, customErrorMessage);
    const validatorPromise = new Promise((resolve) => { 
        validation.checkAsync(() => { 
                resolve(true); 
            }, () => { 
                resolve(false); 
            });
        });
    const result = await validatorPromise;
    // console.log(result);
    if (result === false) {
        const allErrors = validation.errors.all();
        /* const allErrorsJSONString = JSON.stringify(allErrors);
        return allErrorsJSONString; */
        return allErrors;
    }
}
module.exports = {
    articleValodation
};
