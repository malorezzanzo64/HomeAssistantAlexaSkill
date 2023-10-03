const Alexa = require('ask-sdk-core');
//var persistenceAdapter = getPersistenceAdapter();

const util = require('./util'); // utility functions
const interceptors = require('./interceptors');
const logic = require('./logic'); // this file encapsulates all "business" logic
const constants = require('./constants'); // constants such as specific service permissions go here



// handle the requests from Home Assistant
const HALaunchRequestHandler = {
    canHandle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return (sessionAttributes.launchedByHA && Alexa.isNewSession(handlerInput.requestEnvelope) && Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest');
    },
    handle(handlerInput) {
        console.log("Handler: HALaunchRequestHandler");
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        const speakOutput = sessionAttributes.haEntity.text;
        return handlerInput.responseBuilder
            .speak(speakOutput)
            // .ask("")
            .reprompt(speakOutput)
            .getResponse();
    }
}

const HAIntentHandler = {
    canHandle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return sessionAttributes.launchedByHA
            && !(Alexa.isNewSession(handlerInput.requestEnvelope))
            && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
        },
    async handle(handlerInput) {
        console.log("Handler: HAIntentHandler");
        let intentName = (Alexa.getIntentName(handlerInput.requestEnvelope)).replace("AMAZON.","").replace("Intent","").replace("Response","").toUpperCase();
        let responseFromHA;
        if (constants.INTENT.RESPONSE_FROM_HA[intentName] === undefined) {
            responseFromHA = constants.INTENT.RESPONSE_FROM_HA.DEFAULT;
        } else {
            responseFromHA = constants.INTENT.RESPONSE_FROM_HA[intentName];
        }
        if (responseFromHA) {
          let data = await logic.postHaIntent(handlerInput);
          console.log("RESPONSE: " + JSON.stringify(data.response));
          return data.response;
        } else {
            let speakOutput;
            // intent response is not set in localization.js
            if(handlerInput.t(intentName) === intentName) {
                speakOutput = handlerInput.t('OTHER_INTENT_RESPONSE');
            } else {
                speakOutput = handlerInput.t(intentName + '_INTENT_RESPONSE');
            }
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        }
    }
}

const LaunchRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
    },
    handle(handlerInput) {
        console.log("Handler: LaunchRequestHandler");
        
        const speakOutput = handlerInput.t('WELCOME_MSG');
                            
        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();

        
        
        
    }
};

const IntentHandler = {
    canHandle(handlerInput) {
        let sessionAttributes = handlerInput.attributesManager.getSessionAttributes();
        return !(sessionAttributes.launchedByHA)
            && Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
        },
    async handle(handlerInput) {
        console.log("Handler: IntentHandler");
        let intentName = (Alexa.getIntentName(handlerInput.requestEnvelope)).replace("AMAZON.","").replace("Intent","").replace("Response","").toUpperCase();
        // set responseFromHA to constants.INTENT.RESPONSE_FROM_HA[intentName] if it is defined, otherwise set it to constants.INTENT.RESPONSE_FROM_HA.DEFAULT
        let responseFromHA;
        if (constants.INTENT.RESPONSE_FROM_HA[intentName] === undefined) {
            responseFromHA = constants.INTENT.RESPONSE_FROM_HA.DEFAULT;
        } else {
            responseFromHA = constants.INTENT.RESPONSE_FROM_HA[intentName];
        }
        if (responseFromHA) {
          let data = await logic.postHaIntent(handlerInput);
          console.log("RESPONSE" + JSON.stringify(data.response));
          return data.response;
        } else {
            let speakOutput;
            // intent response is not set in localization.js
            if(handlerInput.t(intentName) === intentName) {
                speakOutput = handlerInput.t('OTHER_INTENT_RESPONSE');
            } else {
                speakOutput = handlerInput.t(intentName + '_INTENT_RESPONSE');
            }
          return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
        }
    }
}

const HelpIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent';
    },
    handle(handlerInput) {
        console.log("Handler: HelpIntentHandler");
        const speakOutput = handlerInput.t('HELP_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

const CancelAndStopIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && (Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.CancelIntent'
                || Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
        console.log("Handler: CancelAndStopIntentHandler");
        const speakOutput = handlerInput.t('GOODBYE_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .getResponse();
    }
};
/* *
 * FallbackIntent triggers when a customer says something that doesn’t map to any intents in your skill
 * It must also be defined in the language model (if the locale supports it)
 * This handler can be safely added but will be ingnored in locales that do not support it yet 
 * */
const FallbackIntentHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest'
            && Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
        console.log("Handler: FallbackIntentHandler");
        const speakOutput = handlerInput.t('FALLBACK_MSG');

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};
/* *
 * SessionEndedRequest notifies that a session was ended. This handler will be triggered when a currently open 
 * session is closed for one of the following reasons: 1) The user says "exit" or "quit". 2) The user does not 
 * respond or says something that does not match an intent defined in your voice model. 3) An error occurs 
 * */
const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
    },
    handle(handlerInput) {
        console.log(`~~~~ Session ended: ${JSON.stringify(handlerInput.requestEnvelope)}`);
        // Any cleanup logic goes here.
        return handlerInput.responseBuilder.getResponse(); // notice we send an empty response
    }
};
/* *
 * The intent reflector is used for interaction model testing and debugging.
 * It will simply repeat the intent the user said. You can create custom handlers for your intents 
 * by defining them above, then also adding them to the request handler chain below 
 * */
const IntentReflectorHandler = {
    canHandle(handlerInput) {
        return Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest';
    },
    handle(handlerInput) {
        console.log("Handler: IntentReflectorHandler");
        const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
        const speakOutput = handlerInput.t('REFLECTOR_MSG', {intent: intentName});

        return handlerInput.responseBuilder
            .speak(speakOutput)
            //.reprompt('add a reprompt if you want to keep the session open for the user to respond')
            .getResponse();
    }
};
/**
 * Generic error handling to capture any syntax or routing errors. If you receive an error
 * stating the request handler chain is not found, you have not implemented a handler for
 * the intent being invoked or included it in the skill builder below 
 * */
const ErrorHandler = {
    canHandle() {
        return true;
    },
    handle(handlerInput, error) {
        const speakOutput = handlerInput.t('ERROR_MSG');
        console.log(`~~~~ Error handled: ${JSON.stringify(error)}`);

        return handlerInput.responseBuilder
            .speak(speakOutput)
            .reprompt(speakOutput)
            .getResponse();
    }
};

module.exports = {
    HALaunchRequestHandler,
    HAIntentHandler,
    IntentHandler,
    LaunchRequestHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    FallbackIntentHandler,
    SessionEndedRequestHandler,
    IntentReflectorHandler,
    ErrorHandler
}
