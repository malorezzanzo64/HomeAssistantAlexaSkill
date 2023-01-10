module.exports = {
    /* UPDATE THESE VARIABLES WITH YOUR CONFIG */
    HOME_ASSISTANT_URL : '',  // REPLACE WITH THE URL FOR YOUR HOME ASSISTANT WITHOUT THE INITIAL HTTPS://
    VERIFY_SSL : true,  // SET TO FALSE IF YOU DO NOT HAVE VALID CERTS
    TOKEN : '',  // ADD YOUR LONG LIVED TOKEN IF NEEDED OTHERWISE LEAVE BLANK
    DEBUG : true,  // SET TO TRUE IF YOU WANT TO SEE MORE DETAILS IN THE LOGS
    HA_ENTITY : 'var.alexa_event',
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
    
    NO_INTENT_RESPONSE_TYPE : "ResponseNo",
    NO_INTENT_RESPONSE_SLOT : undefined,
    
    NONE_INTENT_RESPONSE_TYPE : "ResponseNone",
    
    SELECT_INTENT_RESPONSE_TYPE : "ResponseSelect",
    SELECT_INTENT_RESPONSE_SLOT : undefined,
    
    NUMBER_INTENT_RESPONSE_TYPE : "ResponseNumeric",
    NUMBER_INTENT_SLOT : "number",
    
    DURATION_INTENT_RESPONSE_TYPE : "ResponseDuration",
    DURATION_INTENT_RESPONSE_SLOT : "duration"
    
}
