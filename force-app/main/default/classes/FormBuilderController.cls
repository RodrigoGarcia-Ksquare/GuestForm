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

    @AuraEnabled
    public static void saveFormResponse(String formId, List<Form_Field__c> responseList){
        try {

            Form_Response__c formResponse = new Form_Response__c();
            formResponse.Form_ID__c = formId;
            insert formResponse;
            system.debug(formResponse.Id);

            List<Field_Response__c> respList = new List<Field_Response__c>();

            for (Form_Field__c f : responseList) {
                Field_Response__c resp = new Field_Response__c();
                resp.Form_Response__c = formResponse.Id;
                resp.FieldType__c = f.FieldType__c;
                if(f.FieldType__c == 'checkbox'){
                    if (f.isRadio__c) {resp.Answer__c = 'Yes';}
                    else {resp.Answer__c = 'No';}
                }
                else{resp.Answer__c = f.Value__c;}
                respList.add(resp);
            }

            
            insert respList;
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}
