trigger ResponseTrigger on Form_Response__c (after insert) {
    new ResponseTriggerHandler().run();
}