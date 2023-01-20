public without sharing class FormBuilderController {

    //Method to get Fields from an specific Form
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

    //Method to obtain the Invitation Id given by the URL encription
    @AuraEnabled(cacheable=true)
    public static List<Form_Invitation__c> getInv(String Encryption){
        try {
            return [SELECT Id, Name, Form__c, Account__c, isActive__c
            FROM Form_Invitation__c 
            WHERE EncryptedId__c =:Encryption];
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

    //Create Response Form and Field records
    @AuraEnabled
    public static void saveFormResponse(String formId, List<Form_Field__c> responseList, Id invitationId){
        // public static void saveFormResponse(String formId, Id invitationId){
        try {
            //Necessary to create the Form Response Record from where the Response Fields are going to be linked with
            Form_Response__c formResponse = new Form_Response__c();
            formResponse.Form_ID__c = formId;
            formResponse.Form_Invitation__c = invitationId;
            insert formResponse;
            system.debug(formResponse.Id);

            //Creation of the Response Fields records
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

            //STARTS EMAIL PROCESS
            EmailUtility.emailManager(formResponse.Id);
            //ENDS EMAIL PROCESS
            
        } catch (Exception e) {
            throw new AuraHandledException(e.getMessage());
        }
    }

}