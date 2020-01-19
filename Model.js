
const ObjectId = require('./ObjectId');

const pg = require('pg');

const connectionConfig = {
    user : 'postgres',
    password: '12345678',
    database : 'postgres',
    port: 5432
};

let client = null;

async function getClient() {
    if(!client) {
        client = new pg.Client(connectionConfig);
        await client.connect();
    }

    return client;
}

class Mapping {}

class Model {

    get collectionName(){
        //set by Model.map
        return this._collectionName;
    }

    static get collectionName(){
        //set by Model.
        return this._collectionName;
    }

    get mapping() {
        if(!this._mapping){
            this._mapping = new Mapping();
        }
        return this._mapping;
    }

    static map(obj, Model, model) {
        const name = Model.collectionName;
        const { schema } = Model._model;
        if(!schema) {
            throw new Error(`model "${name}" missing schema object`);
        }
        model._collectionName = name;
        model._schema = schema;
        Object.keys(schema).map(key => {
            let { type, required } = schema[key];
            let val = obj[key];
            if(!val) {
                if(required) {
                    throw new Error(`Required key missing: "${key}"`);
                }
            }
            if(typeof val !== type) {
                throw new Error(`Type of key "${key}" must be "${type}"`);
            }
            model.mapping[key] = obj[key];
        });

        model.mapping.objectId = model.objectId;

        return model;
    }

    constructor(obj) {
        this.objectId = ObjectId.default();
        Model.map(obj, this.constructor, this);
    }

    static init(name, model) {
        this._collectionName = name;
        this._model = model;
    }

    async insert () {
        //INSERT INTO users (data) VALUES('{"name": "yaki", "address": "ramat gan"}');
        const client = await getClient();
        const {objectId, mapping, collectionName} = this;
        const query = `INSERT INTO ${collectionName} (objectId, data) VALUES ($1, $2) ;`;
        const params = [objectId, mapping];
        await client.query(query, params);
        return this;
    }

    static async findById(id) {
        const client = await getClient();
        const { collectionName } = this;
        const Self = this;
        const query = `SELECT * FROM ${collectionName} WHERE objectId = $1`;
        const params = [id];
        const {rows: [o]} = await client.query(query, params);
        if(!o) {
            return null;
        }
        const {data} = o;
        return new Self(data);
    }

    static async find(queryObj, Model) {
        const client = pg.Client(connectionConfig);
        await client.connect();
        const {name} = this;
        let whereStatement = '';
        Object.keys(queryObj).map(key => {
            whereStatement += key
        });
        const query = `SELECT * FROM  ${name} WHERE id = $1`;
        const params = [id];
        const result = await client.query(query, params);
        return new Model(result);
    }
}

module.exports = Model;
