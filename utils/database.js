var spicedPg = require("spiced-pg");
var database = spicedPg(
  process.env.DATABASE_URL  ||
    "postgres://ddbaqjlmdkingu:cc78c8659fc23cb78af3388f664c2a3bc48a74c450b805751b695cc2eeed6b7e@ec2-3-208-79-113.compute-1.amazonaws.com:5432/d1hdqh49jpfcq3"
);

/////get userdata from ID. 
module.exports.getUser= function getUser(id) {
  return database.query(`SELECT * FROM userdata WHERE id=$1`, [id]);
};
module.exports.getEveryone = function getEveryone() {
  return database.query(`SELECT * FROM userdata`);
};




/////CREATING USERNAME AND ID
module.exports.createUser = function createUser( id, username) {
  return database.query(
    `INSERT INTO userdata (id, username) VALUES ($1, $2) RETURNING *`,
    [ id, username]
  );
};

module.exports.setIsInTreatment = function setIsInTreatment(isInTreatment, id) {
  return database.query(
    `UPDATE userdata SET isInTreatment = $1 WHERE id =$2 RETURNING *`,
    [isInTreatment, id]  
  );
};

module.exports.setIsConnecting = function setIsConnecting(level, id) {
    return database.query(
      `UPDATE userdata SET isConnecting = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };

module.exports.setIsUpdating = function setIsUpdating(level, id) {
    return database.query(
      `UPDATE userdata SET isUpdating = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  }; 

module.exports.setIsReleasing = function setIsReleasing(level, id) {
    return database.query(
      `UPDATE userdata SET isReleasing = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  }; 
module.exports.setIsRefreshing = function setIsRefreshing(level, id) {
    return database.query(
      `UPDATE userdata SET isRefreshing = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  }; 

module.exports.setIsReflecting = function setIsReflecting(level, id) {
    return database.query(
      `UPDATE userdata SET isReflecting = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  }; 
module.exports.setIsHacking= function setIsHacking(level, id) {
    return database.query(
      `UPDATE userdata SET isHacking = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
module.exports.setIsActivating= function setIsActivating(level, id) {
    return database.query(
      `UPDATE userdata SET isActivating = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };


  module.exports.hasActivated = function hasActivated(level, id) {
    return database.query(
      `UPDATE userdata SET hasActivated = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };

  
  module.exports.hasConnected = function hasConnected(level, id) {
    return database.query(
      `UPDATE userdata SET hasConnected = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.hasRefreshed  = function hasRefreshed (level, id) {
    return database.query(
      `UPDATE userdata SET hasRefreshed = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.hasReleased  = function hasReleased (level, id) {
    return database.query(
      `UPDATE userdata SET hasReleased = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.hasReflected  = function hasReflected (level, id) {
    return database.query(
      `UPDATE userdata SET hasReflected = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.hasUpdated  = function hasUpdated (level, id) {
    return database.query(
      `UPDATE userdata SET hasUpdated = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.hasHacked  = function hasHacked (level, id) {
    return database.query(
      `UPDATE userdata SET hasHacked = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };


  module.exports.isHelping  = function isHelping (level, id) {
    return database.query(
      `UPDATE userdata SET isHelping = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.isExiting  = function isExiting (level, id) {
    return database.query(
      `UPDATE userdata SET isExiting = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };
  module.exports.isAbleToSendTheirCustomResponse  = function isAbleToSendTheirCustomResponse (level, id) {
    return database.query(
      `UPDATE userdata SET isAbleToSendTheirCustomResponse = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };

  module.exports.isOnBreak  = function isOnBreak (level, id) {
    return database.query(
      `UPDATE userdata SET isOnBreak = $1 WHERE id =$2 RETURNING *`,
      [level, id]  
    );
  };