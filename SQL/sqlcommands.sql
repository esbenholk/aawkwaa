DROP TABLE IF EXISTS userdata;

CREATE TABLE userdata(

    id BIGINT primary key,
    username VARCHAR,
    isInTreatment VARCHAR,
    isConnecting VARCHAR,
    isUpdating VARCHAR,
    isHacking VARCHAR,
    isRefreshing VARCHAR,
    isReleasing VARCHAR,
    isReflecting VARCHAR,
    isActivating VARCHAR,

    hasConnected  VARCHAR,
    hasUpdated VARCHAR,
    hasHacked VARCHAR,
    hasRefreshed VARCHAR,
    hasReleased VARCHAR,
    hasReflected VARCHAR,
    hasActivated VARCHAR,

    isHelping VARCHAR,
    isExiting VARCHAR,
    isOnBreak VARCHAR,
    isAbleToSendTheirCustomResponse VARCHAR

);