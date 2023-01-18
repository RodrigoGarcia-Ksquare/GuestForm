public class InvitationTriggerHandler extends TriggerHandler{
    
    public override void afterInsert() {

        List<Form_invitation__c> toUpdate = new List<Form_invitation__c>();
        List<String> encrypList = new List<String>();
        Blob key = Crypto.generateAesKey(256);

        for(Form_Invitation__c inv : (List<Form_Invitation__c>) Trigger.new) {

            Form_Invitation__c formInv = new Form_Invitation__c();
            formInv.Id = inv.Id;

            String encryptedId = '\'' +inv.Id + ' ' + inv.Form__c + ' ' + inv.Account__c + '\'';
            system.debug(encryptedId);

            Blob source = Blob.valueOf(encryptedId);
            Blob encrypted = Crypto.encryptWithManagedIV('AES256', key, source);
            String encrypted64 = EncodingUtil.base64Encode(encrypted);
            system.debug(encrypted64);

            if (String.isBlank(inv.EncryptedId__c)) {
                formInv.EncryptedId__c = encrypted64;
                formInv.URL__c = 'https://codey4-dev-ed.develop.my.site.com/s/form' + encrypted64;
                toUpdate.add(formInv);
                encrypList.add(encrypted64);
            }
            
            // system.debug(toUpdate);
            system.debug(formInv);
            
        }

        //EmailUtility.emailGuest(encrypList, key);

        update toUpdate;
    }

}