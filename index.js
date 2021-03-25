const db = require('./db.json');
const config = require('./config.json');
const got = require('got');
const fs = require('fs');

const apiUrlWithAddress = config.apiUrl.replace('ADDRESS', config.ethAddress);

async function doRequest() {
    return new Promise(async(resolve, reject) => {
        let res = await got(apiUrlWithAddress);
        let resBody = JSON.parse(res.body);
        console.log("Old database length: " + db.length);
        for (let a = 0; a < resBody.data.statistics.length; a++) {
            let alreadyAccounted = false;
            for (let b = 0; b < db.length; b++) {
                let timeItem = db[b];
                if (timeItem.time == resBody.data.statistics[a].time) alreadyAccounted = true;
            }
            if (!alreadyAccounted) {
                db.push(resBody.data.statistics[a])
            }
        }
        fs.writeFileSync('./db.json', JSON.stringify(db));
        console.log("New database length: " + db.length);
    });
}

doRequest();
