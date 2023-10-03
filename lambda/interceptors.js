const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const logic = require('./logic');
const languageStrings = require('./localization');
const constants = require('./constants');

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log("~~~~ Interceptor: LoggingRequestInterceptor");
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        console.log(`Incoming Request Info:
            Launched by HA: ${handlerInput.attributesManager.getSessionAttributes().launchedByHA};
            New Session: ${Alexa.isNewSession(handlerInput.requestEnvelope)};
            Launch Request: ${Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log("~~~~ Interceptor: LoggingResponseInterceptor");
        console.log(`Outgoing Response: ${JSON.stringify(response)}`);
        console.log(`Outgoing Response Info:
            Launched by HA: ${handlerInput.attributesManager.getSessionAttributes().launchedByHA};
            New Session: ${Alexa.isNewSession(handlerInput.requestEnvelope)};
            Launch request: ${Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
        console.log("~~~~ Interceptor: LocalisationRequestInterceptor");
        i18n.init({
            lng: Alexa.getLocale(handlerInput.requestEnvelope),
            resources: languageStrings
        }).then((t) => {
            handlerInput.t = (...args) => t(...args);
        });
    }
};


// This request interceptors saves the Home Assistant entity in session attributes and then resets it to the default value in Home Assistant
const HaEntityRequestInterceptor = {
    async process(handlerInput) {
        console.log("~~~~ Interceptor: HaEntityRequestInterceptor");
        // if there's a date slot: it's needed to first check if it is an intent request otherwise it throws an error
        if(Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getSlot(handlerInput.requestEnvelope, 'date')
        ){
            logic.setHaEntity(constants.HA_ENTITY.DATE, Alexa.getSlotValue(handlerInput.requestEnvelope, 'date'));
        }
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        if (sessionAttributes.haEntity === undefined) {  // Alexa.isNewSession(handlerInput.requestEnvelope) doesn't work because if the dialog is delegated the skill will never receive a new session request
            var haEntity = {};
            haEntity.text = await logic.getHaEntity(constants.HA_ENTITY.TEXT);
            haEntity.id = await logic.getHaEntity(constants.HA_ENTITY.ID);
            haEntity.event = await logic.getHaEntity(constants.HA_ENTITY.EVENT);
            haEntity.slots = await logic.getHaEntity(constants.HA_ENTITY.SLOTS);
            logic.SaveHaEntityInSessionAttributes(handlerInput, haEntity);
            // set ha entity to the default state
            logic.setHaEntity(constants.HA_ENTITY.TEXT, constants.HA_ENTITY.TEXT_DEFAULT);
            logic.setHaEntity(constants.HA_ENTITY.EVENT, constants.HA_ENTITY.EVENT_DEFAULT);
            logic.setHaEntity(constants.HA_ENTITY.SLOTS, constants.HA_ENTITY.SLOTS_DEFAULT);
            logic.setHaEntity(constants.HA_ENTITY.ID, constants.HA_ENTITY.ID_DEFAULT);
        }
    }
}

// This request handler set the session attribute launchedByHa true or false
const CheckOriginRequestInterceptor = {
    async process(handlerInput) {
        console.log("~~~~ Interceptor: CheckOriginRequestInterceptor");
        logic.isLaunchedByHa(handlerInput);
    }
}

const EditHandlerInputRequestInterceptor = {
    async process(handlerInput) {
        if (!(Alexa.isNewSession(handlerInput.requestEnvelope))
            && logic.isLaunchedByHa(handlerInput)
            && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
        ) {
            console.log("~~~~ Interceptor: EditHandlerInputRequestInterceptor");
            logic.EditHandlerInput(handlerInput);
        }
    }
}


const PostHaEventResponseInterceptor = {
    process(handlerInput) {
        if (Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' || Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest') {
            console.log("~~~~ Interceptor: PostHaEventResponseInterceptor");
            var responseType;
            var responseSlot;
            if(Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest') {
                let intentName = (Alexa.getIntentName(handlerInput.requestEnvelope)).replace("AMAZON.","").replace("Response","").replace("Intent","").toUpperCase();
                console.log("INTENT NAME: " + intentName);
                // responseType = eval("constants." + intentName + "_INTENT_RESPONSE_TYPE");
                responseType = constants.INTENT.RESPONSE_TYPE[intentName];
                console.log("RESPONSE TYPE: " + responseType);
                responseSlot = constants.INTENT.RESPONSE_SLOT[intentName];
                console.log("RESPONSE SLOT: " + responseSlot);
                // let response = Alexa.getSlotValue(handlerInput.requestEnvelope, responseSlot);
            } else {
                responseType = constants.INTENT.RESPONSE_TYPE.NONE;
                responseSlot = constants.INTENT.RESPONSE_SLOT.NONE;
            }
            logic.postHaEvent(handlerInput, responseSlot, responseType);
        }
    }
}

module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    CheckOriginRequestInterceptor,
    HaEntityRequestInterceptor,
    EditHandlerInputRequestInterceptor,
    PostHaEventResponseInterceptor
    //LoadAttributesRequestInterceptor
    //SaveAttributesResponseInterceptor,
    //LoadNameRequestInterceptor,
    //LoadTimezoneRequestInterceptor
}
