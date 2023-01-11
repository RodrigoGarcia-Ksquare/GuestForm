public with sharing class FormBuilderController {
    // @AuraEnabled(cacheable=true)
    // public static List<Form_Field__c> getFields(){
    //     try {
    //         return [SELECT Id, Label__c, FieldType__c FROM Form_Field__c ORDER BY Id];
    //     } catch (Exception e) {
    //         throw new AuraHandledException(e.getMessage());
    //     }
    // }

    @AuraEnabled(cacheable=true)
    public static List<Form_Field__c> getFields(String formId){
        try {
            return [SELECT Id, Name, Label__c, FieldType__c, Form_Field_Group_ID__r.Name, Form_Field_Group_ID__r.Form_ID__r.Name, isRadio__c 
            FROM Form_Field__c 
            WHERE Form_Field_Group_ID__r.Form_ID__r.Id =:formId];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
