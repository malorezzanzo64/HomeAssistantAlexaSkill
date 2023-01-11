module.exports = {
    /* UPDATE THESE VARIABLES WITH YOUR CONFIG */
    HOME_ASSISTANT_URL : 'ha.malorezzanzo.com',  // REPLACE WITH THE URL FOR YOUR HOME ASSISTANT
    VERIFY_SSL : true,  // SET TO FALSE IF YOU DO NOT HAVE VALID CERTS
    TOKEN : '',  // ADD YOUR LONG LIVED TOKEN IF NEEDED OTHERWISE LEAVE BLANK
    DEBUG : true,  // SET TO TRUE IF YOU WANT TO SEE MORE DETAILS IN THE LOGS
    HA_ENTITY : 'sensor.alexa_event',
    HA_ENTITY_DEFAULT_DATA : {
                            "state": "alexa_event", // event to create
                            "attributes": {
                                "text": "",
                                "id": "",
                                "intent": "LaunchRequest",
                                "slots": {}
                                }
                            },
    DIALOGMODEL : false,
    
    YES_INTENT_RESPONSE_TYPE : "ResponseYes",
    YES_INTENT_RESPONSE_SLOT : undefined,
    YES_INTENT_RESPONSE_FROM_HA : true,
    
    NO_INTENT_RESPONSE_TYPE : "ResponseNo",
    NO_INTENT_RESPONSE_SLOT : undefined,
    NO_INTENT_RESPONSE_FROM_HA : true,

    NONE_INTENT_RESPONSE_TYPE : "ResponseNone",
    NONE_INTENT_RESPONSE_FROM_HA : true,

    SELECT_INTENT_RESPONSE_TYPE : "ResponseSelect",
    SELECT_INTENT_RESPONSE_SLOT : undefined,
    SELECT_INTENT_RESPONSE_FROM_HA : true,

    NUMBER_INTENT_RESPONSE_TYPE : "ResponseNumeric",
    NUMBER_INTENT_SLOT : "number",
    NUMBER_INTENT_RESPONSE_FROM_HA : true,

    DURATION_INTENT_RESPONSE_TYPE : "ResponseDuration",
    DURATION_INTENT_RESPONSE_SLOT : "duration",
    DURATION_INTENT_RESPONSE_FROM_HA : true,
    
    
    SELECTROOM_INTENT_RESPONSE_TYPE : "ResponseRoom",
    SELECTROOM_INTENT_RESPONSE_SLOT : "room",
    SELECTROOM_INTENT_RESPONSE_FROM_HA : true,
    
    SELECTTASK_INTENT_RESPONSE_TYPE : "ResponseTask",
    SELECTTASK_INTENT_RESPONSE_SLOT : "task",
    SELECTTASK_INTENT_RESPONSE_FROM_HA : true,

    SELECTPERSON_INTENT_RESPONSE_TYPE : "ResponsePerson",
    SELECTPERSON_INTENT_RESPONSE_SLOT : "person",
    SELECTPERSON_INTENT_RESPONSE_FROM_HA : true
}
