
const { randomBytes } = require('crypto');

/**
 * @link https://docs.mongodb.com/manual/reference/method/ObjectId/#description
 * Returns a new ObjectId value. The 12-byte ObjectId value consists of:
 *  * a 4-byte timestamp value, representing the ObjectId’s creation, measured in seconds since the Unix epoch
 *  * a 5-byte random value
 *  * a 3-byte incrementing counter, initialized to a random value
 * While the BSON format itself is little-endian, the timestamp and counter values are big-endian, with the most significant bytes appearing first in the byte sequence.
 */
class ObjectId {

    static incrementalValue() {
        if(!ObjectId._startValue) {
            let random = randomBytes(3);
            ObjectId._startValue =
                Math.pow(2, 0) * random[0] +
                Math.pow(2, 7) * random[0] +
                Math.pow(2, 15) * random[0];
        }

        return (ObjectId._startValue++).toString(16);
    }

    static default() {
        let timestamp = (Date.now() / 1000 | 0).toString(16);
        let random = randomBytes(5).toString('hex');
        let incremental = ObjectId.incrementalValue();
        return new ObjectId(timestamp + random + incremental);
    }

    constructor(objectId) {
        this.objectId = objectId;
    }
}

module.exports = ObjectId;
