const Alexa = require('ask-sdk-core');
const constants = require('./constants'); // constants such as specific service permissions go here
const axios = require('axios');


// send the intent to Home Assistant using the Alexa API
async function postHaIntent(handlerInput) {
    const url = `https://${constants.HOME_ASSISTANT_URL}/api/alexa`;
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    /*
    let data;
    if (sessionAttributes.launchedByHA) {
        data = JSON.stringify(sessionAttributes.haIntent, null, 2);
    } else {
        data = JSON.stringify(handlerInput.requestEnvelope, null, 2);
    }
    */
    let data = JSON.stringify(handlerInput.requestEnvelope, null, 2);
    console.log("DATA\n" + data);
    const config = {
        timeout : 4000,
        headers : {
                    'Authorization': `Bearer ${constants.TOKEN}`,
                    'Content-Type': 'application/json'
                  }
            };
    //  Updates the Home Assistant server state with alexa_event id.
    try {
        const dataSent = await axios.post(url, data, config);
        console.log("DATA SENT\n" + JSON.stringify(dataSent.data));
        return dataSent.data;
    } catch (error) {
    console.error(error);
    }
}


// send the intent to Home Assistant as an event
async function postHaEvent(handlerInput, responseSlot = constants.INTENT.RESPONSE_SLOT.DEFAULT, responseType = constants.INTENT.RESPONSE_TYPE.DEFAULT) {
    let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
    let requestEnvelope = handlerInput.requestEnvelope;
    
    const url = `https://${constants.HOME_ASSISTANT_URL}/api/events/${sessionAttributes.haEntity.event}`;

    let data = {
            "id": sessionAttributes.haEntity.id,
        }
    // If request comes from Home Assistant, add response and response_type
    if (sessionAttributes.launchedByHA) {
        if (responseSlot !== undefined && responseSlot !== null) {
            console.log("RESPONSE SLOT: " + responseSlot);
            data.response = getSlotValue(requestEnvelope, responseSlot);
            data.response_id = getSlotId(requestEnvelope, responseSlot);
        }
        if (responseType !== undefined) {
            data.response_type = responseType;
        }
    }
    // Add person_id
    if (requestEnvelope.context.System.person) {
        let personId = requestEnvelope.context.System.person.personId;
        data['person_id'] = personId;
    }
    
    // If it is an intent request (and not a session ended request)
    if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') {
        
        // Add slots and slot ids
        let handlerInputSlots = handlerInput.requestEnvelope.request.intent.slots;
        data.slot = {};
        data.slot_id = {};
        // Add slots and slots id
        for (var slot in handlerInputSlots) {
            // data[slot] = handlerInputSlots[slot].value;
            data.slot[slot] = getSlotValue(handlerInput.requestEnvelope, slot); //handlerInputSlots[slot].value
            data.slot_id[slot] = getSlotId(handlerInput.requestEnvelope, slot);
        }
        // data.slots = JSON.stringify(data.slots);
        
        // Add intent
        data.intent = Alexa.getIntentName(handlerInput.requestEnvelope);
    }

    const config = {
        timeout : 4000,
        headers : {
                    'Authorization': `Bearer ${constants.TOKEN}`,
                    'Content-Type': 'application/json'
                  }
            };
    try {
        const res = await axios.post(url, data, config);
        console.log("DATA SENT\n" + JSON.stringify(res.data));
        return res.data;
    } catch (error) {
    console.error(error);
    }
}


/*
function postHaIntent(handlerInput) {
    const data = JSON.stringify(handlerInput.requestEnvelope, null, 2)

    var http = require('https');
    
    var options = {
      host: `${constants.HOME_ASSISTANT_URL}`,
      path: '/api/alexa',
      //port: '443',
      method: 'POST',
      headers: {
                'Authorization': `Bearer ${constants.TOKEN}`,
                'Content-Type': 'application/json',
                }
    };
    
    var callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
    }
    
    var req = http.request(options, callback);
    req.write(data);
    req.end();
}
/*
function postHaIntent2(handlerInput) {
    const data = JSON.stringify(handlerInput.requestEnvelope, null, 2)

    var http = require('https');
    
    var options = {
      host: `${constants.HOME_ASSISTANT_URL}`,
      path: '/api/alexa',
      //port: '443',
      method: 'POST',
      headers: {
                'Authorization': `Bearer ${constants.TOKEN}`,
                'Content-Type': 'application/json',
                }
    };
    
    var callback = function(response) {
      var str = ''
      response.on('data', function (chunk) {
        str += chunk;
      });
    
      response.on('end', function () {
        console.log(str);
      });
    }
    
    var req = http.request(options, callback);
    req.write(data);
    req.end();
}

async function getResponse(url, config) {
        const res = await axios.get(url, config);
        return res.data;
}
*/

async function getHaEntity(entity){
    
    const endpoint = `https://${constants.HOME_ASSISTANT_URL}/api`;
    const url = `${endpoint}/states/${entity}`
    
    const config = {
        timeout : 4000,
        headers : {
                    'Authorization': `Bearer ${constants.TOKEN}`,
                    'Content-Type': 'application/json'
                  }
    };
    try {
        var haEntity = await axios.get(url, config);
        console.log("HA ENTITY\n" + JSON.stringify(haEntity.data));
    } catch (error) {
    console.error("HA ENTITY ERROR\n" + error);
    }
    if (entity === constants.HA_ENTITY.SLOTS) {
        haEntity.data.state = JSON.parse(haEntity.data.state);
    }
    return haEntity.data.state;
}

async function setHaEntity(entity, entity_default) {
    const url = `https://${constants.HOME_ASSISTANT_URL}/api/states/${entity}`;
    const data = {
            "state": entity_default
            };
    const config = {
        timeout : 4000,
        headers : {
                    'Authorization': `Bearer ${constants.TOKEN}`,
                    'Content-Type': 'application/json'
                  }
            };
    //  Updates the Home Assistant server state with alexa_event id.
    try {
        await axios.post(url, data, config);
    } catch (error) {
    console.error(error);
    }
}




function getSlotId(requestEnvelope, slotName) {
    let slot = Alexa.getSlot(requestEnvelope, slotName);
    console.log("SLOT: "+ JSON.stringify(slot));
    if (slot && slot.resolutions && slot.resolutions.resolutionsPerAuthority) {
        let resolutionsPerAuthority = slot.resolutions.resolutionsPerAuthority;
        for (let i = 0; i < resolutionsPerAuthority.length; i++) {
            if (resolutionsPerAuthority[i].status.code === "ER_SUCCESS_MATCH") {
                let value = resolutionsPerAuthority[i].values[0];
                if (value.value && value.value.id) {
                    return value.value.id;
                }
            }
        }
    }
}


// Retrieves the slot value real name, not the slot Alexa heard
function getSlotValue(requestEnvelope, slotName) {
    let slot = Alexa.getSlot(requestEnvelope, slotName);
    console.log("SLOT: "+ JSON.stringify(slot));
    if (slot.resolutions) {
        if (slot.resolutions.resolutionsPerAuthority) {
            let resolutionsPerAuthority = slot.resolutions.resolutionsPerAuthority;
            for (let i = 0; i < resolutionsPerAuthority.length; i++) {
                if (resolutionsPerAuthority[i].status.code === "ER_SUCCESS_MATCH") {
                    let value = resolutionsPerAuthority[i].values[0];
                    if (value.value && value.value.name) {
                        return value.value.name;
                    }
                }
            }
        }
    } else {
        return Alexa.getSlotValue(requestEnvelope, slotName);
    }
}

function isLaunchedByHa(handlerInput) {
    let {attributesManager, requestEnvelope} = handlerInput;
    let sessionAttributes = attributesManager.getSessionAttributes();
    if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
        try {
                if ((requestEnvelope.request.metadata.referrer === 'amzn1.alexa-speechlet-client.SequencedSimpleIntentHandler')
                    && (JSON.stringify(sessionAttributes.haEntity.text) !== JSON.stringify(constants.HA_ENTITY.TEXT_DEFAULT))
                ){
                    sessionAttributes.launchedByHA = true;
                    attributesManager.setSessionAttributes(sessionAttributes);
                    return true;
                }
            }
        catch(err){
            sessionAttributes.launchedByHA = false;
            attributesManager.setSessionAttributes(sessionAttributes);
            return false;
        }
    } else {
        return sessionAttributes.launchedByHA;
    }
}

function SaveHaEntityInSessionAttributes(handlerInput, haEntity) {
    let {attributesManager, requestEnvelope} = handlerInput;
    let sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.haEntity = haEntity;
    // I don't know why setSessionAttributes method doesn't work
    attributesManager.setSessionAttributes(sessionAttributes);
    // requestEnvelope.session.attributes = sessionAttributes;
    console.log("Session Attributes in Session Manager" + JSON.stringify(attributesManager.getSessionAttributes()));
    console.log("SESSION ATTRIBUTES\n" + JSON.stringify(sessionAttributes));
    console.log("HANDLER INPUT\n" + JSON.stringify(handlerInput));
    console.log("REQUEST ENVELOPE\n" + JSON.stringify(requestEnvelope));
    console.log("HA ENTITY IN SESSION ATTRIBUTES\n" + JSON.stringify(sessionAttributes.haEntity));
    return sessionAttributes.haEntity;
}

/*
    Save a handler input equal to the one Alexa would have received if the request had been made from a user and not from home Assistant.
    It is neeeded to send to Home Assistant an HTTP request it can comprehend like an intent
*/

function EditHandlerInput(handlerInput){
    var {attributesManager, requestEnvelope} = handlerInput;
    var sessionAttributes = attributesManager.getSessionAttributes();
/*
    sessionAttributes.haIntent = JSON.parse(JSON.stringify(requestEnvelope));
    // Change request type to Intent request
    sessionAttributes.haIntent.request.type = "IntentRequest";
    // add intent
    sessionAttributes.haIntent.request.intent = {};
    // add intent name
    sessionAttributes.haIntent.request.intent.name = sessionAttributes.haEntity.attributes.intent;
    // add intent confirmation status
    sessionAttributes.haIntent.request.intent.confirmationStatus = "NONE";
    // add intent slots
*/
    let handlerInputSlots = requestEnvelope.request.intent.slots;
    // Initialize slots in handler input if undefined (in order to prevent errors)
    if (handlerInputSlots === undefined) {
        handlerInputSlots = {};
    }
    
    let haEntitySlots = JSON.parse(JSON.stringify(sessionAttributes.haEntity.slots));
    
    // format haEntitySlots to be compatible with handlerInputSlots
    for (var slot in sessionAttributes.haEntity.slots) {
        haEntitySlots[slot] = {};
        haEntitySlots[slot].name = slot;
        haEntitySlots[slot].value = sessionAttributes.haEntity.slots[slot];
        haEntitySlots[slot].confirmationStatus = "NONE";
        haEntitySlots[slot].resolutions = {
						"resolutionsPerAuthority": [
							{
								"authority": "HomeAssistant",
								"status": {
									"code": "ER_SUCCESS_MATCH"
								},
								"values": [
									{
										"value": {
											"name": "",
											"id": ""
										}
									}
								]
							}
						]
					};
		haEntitySlots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.name = sessionAttributes.haEntity.slots[slot];
		haEntitySlots[slot].resolutions.resolutionsPerAuthority[0].values[0].value.id = sessionAttributes.haEntity.slots[slot];
    }
    try {
        // Add slots in Home Assistant entity
        requestEnvelope.request.intent.slots = Object.assign(handlerInputSlots, haEntitySlots);
        console.log("handlerInputSlots: " + JSON.stringify(handlerInputSlots));
    } catch (error) {
        console.error("Home Assistant entity slots attribute error: " + error);
    }
}

function SaveHaIntentInSessionAttributes(handlerInput){
    var {attributesManager, requestEnvelope} = handlerInput;
    var sessionAttributes = attributesManager.getSessionAttributes();
    sessionAttributes.haIntent = JSON.parse(JSON.stringify(requestEnvelope));
/*
    // Change request type to Intent request
    sessionAttributes.haIntent.request.type = "IntentRequest";
    // add intent
    sessionAttributes.haIntent.request.intent = {};
    // add intent name
    sessionAttributes.haIntent.request.intent.name = sessionAttributes.haEntity.attributes.intent;
    // add intent confirmation status
    sessionAttributes.haIntent.request.intent.confirmationStatus = "NONE";
    // add intent slots
*/
    try {
        sessionAttributes.haIntent.request.intent.slots = sessionAttributes.haEntity.slots;
    } catch (error) {
        console.error("Home Assistant entity slots attribute error: " + error);
    }
/*
    // add intent dialogstate
    requestEnvelope.request.dialogState = "STARTED";
    // delete session attributes
    delete sessionAttributes.haIntent.session.attributes;
    // delete request target
    delete sessionAttributes.haIntent.request.target;
    // delete request metadata
    delete sessionAttributes.haIntent.request.metadata;
    // delete request body
    delete sessionAttributes.haIntent.request.body;
    // delete request payload
    delete sessionAttributes.haIntent.request.payload;
    // delete request targetURI
    delete sessionAttributes.haIntent.request.targetURI;
    // delete request launchRequestType
    delete sessionAttributes.haIntent.request.launchRequestType;
    // delete request shouldLinkResultBeReturned
    delete sessionAttributes.haIntent.request.shouldLinkResultBeReturned;
    
    //sessionAttributes.haIntent = requestEnvelope;
    //attributesManager.setSessionAttributes(sessionAttributes);
    // console.log(requestEnvelope);
    //return sessionAttributes.haIntent;
*/
}



module.exports = {
    postHaIntent,
    postHaEvent,
    getHaEntity,
    setHaEntity,
    isLaunchedByHa,
    SaveHaEntityInSessionAttributes,
    SaveHaIntentInSessionAttributes,
    EditHandlerInput
}
