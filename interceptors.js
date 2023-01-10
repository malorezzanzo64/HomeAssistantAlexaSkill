const Alexa = require('ask-sdk-core');
const i18n = require('i18next');
const logic = require('./logic');
const languageStrings = require('./localization');
const constants = require('./constants');

// This request interceptor will log all incoming requests to this lambda
const LoggingRequestInterceptor = {
    process(handlerInput) {
        console.log(`Incoming request: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        console.log(`HA Launch Request: ${handlerInput.attributesManager.getSessionAttributes().launchedByHA}, ${Alexa.isNewSession(handlerInput.requestEnvelope)}, ${Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'}`);
    }
};

// This response interceptor will log all outgoing responses of this lambda
const LoggingResponseInterceptor = {
    process(handlerInput, response) {
        console.log(`Outgoing response: ${JSON.stringify(response)}`);
        console.log(`HA Launch Request: ${handlerInput.attributesManager.getSessionAttributes().launchedByHA}, ${Alexa.isNewSession(handlerInput.requestEnvelope)}, ${Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest'}`);
    }
};

// This request interceptor will bind a translation function 't' to the handlerInput
const LocalisationRequestInterceptor = {
    process(handlerInput) {
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
        if (Alexa.isNewSession(handlerInput.requestEnvelope)) {
            var haEntity = await logic.getHaEntity();
            logic.SaveHaEntityInSessionAttributes(handlerInput, haEntity);
            // set ha entity to the default state
            logic.setHaEntity();
        }
    }
}

// This request handler set the session attribute launchedByHa true or false
const CheckOriginRequestInterceptor = {
    async process(handlerInput) {
        logic.isLaunchedByHa(handlerInput);
    }
}

const EditHandlerInputRequestInterceptor = {
    async process(handlerInput) {
        if (!(Alexa.isNewSession(handlerInput.requestEnvelope)) && logic.isLaunchedByHa(handlerInput)) {
            logic.EditHandlerInput(handlerInput);
        }
    }
}

/*
const PostHaEventResponseInterceptor = {
    process(handlerInput) {
        if (handlerInput.request.dialogState === "COMPLETED") {
            logic.postHaEvent();
        }
    }
}

const PostHaIntentResponseInterceptor = {
    
}
*/

module.exports = {
    LoggingRequestInterceptor,
    LoggingResponseInterceptor,
    LocalisationRequestInterceptor,
    CheckOriginRequestInterceptor,
    HaEntityRequestInterceptor,
    EditHandlerInputRequestInterceptor
}
