public class ResponseTriggerHandler extends TriggerHandler{

    public override void afterInsert(){

        List<Form_Invitation__c> toUpdate = new List<Form_Invitation__c>();

        for (Form_Response__c formResp : (List<Form_Response__c>) Trigger.new) {
            Form_Invitation__c formInv = new Form_invitation__c();
            formInv.Id = formResp.Form_Invitation__c;
            formInv.isActive__c = false;
            toUpdate.add(formInv);
        }
        update toUpdate;
    }

}