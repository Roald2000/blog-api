const moment = require("moment");
const { v4 } = require("uuid");

const currentDtime = moment(new Date()).format("YYYY-MM-DD hh:mm:ss A");

module.exports = {
  uniq_id: v4(),
  logger: function (...data) {
    console.log(currentDtime, "---", [...data].join(" --- "));
  },
  createResponse: function (
    responseObject,
    status,
    options = {} | null | undefined
  ) {
    if (!options) {
      responseObject.sendStatus(status);
    } else {
      responseObject.status(status).send(options);
    }
  },
};
