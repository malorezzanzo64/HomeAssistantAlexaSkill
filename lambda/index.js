const Alexa = require('ask-sdk-core');
//var persistenceAdapter = getPersistenceAdapter();

const util = require('./util'); // utility functions
const interceptors = require('./interceptors');
const handlers = require('./handlers');


/**
 * This handler acts as the entry point for your skill, routing all request and response
 * payloads to the handlers above. Make sure any new handlers or interceptors you've
 * defined are included below. The order matters - they're processed top to bottom 
 * */
exports.handler = Alexa.SkillBuilders.custom()
    .addRequestHandlers(
        handlers.HALaunchRequestHandler,
        handlers.HAIntentHandler,
        handlers.LaunchRequestHandler,
        handlers.IntentHandler,
        handlers.HelpIntentHandler,
        handlers.CancelAndStopIntentHandler,
        handlers.FallbackIntentHandler,
        handlers.SessionEndedRequestHandler,
        handlers.IntentReflectorHandler
    )
    .addRequestInterceptors(
        interceptors.LoggingRequestInterceptor,
        interceptors.LocalisationRequestInterceptor,
        interceptors.HaEntityRequestInterceptor,
        interceptors.EditHandlerInputRequestInterceptor,
        interceptors.CheckOriginRequestInterceptor,
        interceptors.LoggingRequestInterceptor
    )
    .addResponseInterceptors(
        interceptors.LoggingResponseInterceptor,
        interceptors.PostHaEventResponseInterceptor
    )
    .addErrorHandlers(
        handlers.ErrorHandler
        //SaveAttributesResponseInterceptor
    )
    //.withPersistenceAdapter(persistenceAdapter)
    .withCustomUserAgent('HomeAssistant/NodeJS')
    .lambda();