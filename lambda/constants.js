module.exports = {
    /* UPDATE THESE VARIABLES WITH YOUR CONFIG */
    HOME_ASSISTANT_URL : 'ha.malorezzanzo.com',  // REPLACE WITH THE URL FOR YOUR HOME ASSISTANT
    VERIFY_SSL : true,  // SET TO FALSE IF YOU DO NOT HAVE VALID CERTS
    TOKEN : 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3NTYzZjlhNzFmNmE0OTBhOTZkOWNhMWQ3YzY5NzFmYyIsImlhdCI6MTY3MjE4ODQ2MywiZXhwIjoxOTg3NTQ4NDYzfQ.-keI9UwvrZSIpLK2bi5-bC0flF1oQ1rO2dX_nKrt10I',  // ADD YOUR LONG LIVED TOKEN IF NEEDED OTHERWISE LEAVE BLANK
    DEBUG : true,  // SET TO TRUE IF YOU WANT TO SEE MORE DETAILS IN THE LOGS
    
    
    // the Home Assistant entities that this skill queries
    HA_ENTITY : {
        EVENT : 'input_text.alexa_event',
        EVENT_DEFAULT : 'alexa_event',
        TEXT : 'input_text.alexa_event_text',
        TEXT_DEFAULT : '',
        ID : 'input_text.alexa_event_id',
        ID_DEFAULT : 'voice_request',
        SLOTS : 'input_text.alexa_event_slots',
        SLOTS_DEFAULT : {},
        DATE : 'input_text.alexa_date'
    },
    
    INTENT : {
        // the respose type to sendo to Home Assistant
        RESPONSE_TYPE : {
            DEFAULT : "ResponseOther",
            NONE : "ResponseNone",
            YES : "ResponseYes",
            NO : "ResponseNo",
            SELECT : "ResponseSelect",
            SELECTION : "ResponseSelection",
            NUMBER : "ResponseNumeric",
            DURATION : "ResponseDuration",
        },
        
        RESPONSE_SLOT : {
            DEFAULT : undefined,
            NONE : undefined,
            YES : undefined,
            NO : undefined,
            SELECT : "selection",
            SELECTION : "selection",
            NUMBER : "number",
            DURATION : "duration"
        },
        
        // if the selected intent response should come from Home Assistant
        RESPONSE_FROM_HA : {
            DEFAULT : false,
            NONE : true,
            YES : true,
            NO : true,
            SELECT : true,
            SELECTION : true,
            NUMBER : true,
            DURATION : true,
        },
    }
}
