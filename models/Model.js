/**
 * Created by kevin on 2017/7/28.
 */

let modelMaker = require('../util/database').modelMaker;

function createModel(schema,name,options,schemaAction) {
    let Schema = modelMaker.Schema;
    let schemaObj = new Schema(schema,options);
    let obj = modelMaker.model(name,schemaObj);
    if (schemaAction) {
        schemaAction(schemaObj);
    }
    return obj;
}

let objId = modelMaker.Schema.Types.ObjectId;

function defaultTimeInterval() {
    return new Date().getTime()
}

module.exports={objId:objId,createModel:createModel,DTI:defaultTimeInterval};