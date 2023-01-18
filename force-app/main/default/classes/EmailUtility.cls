public with sharing class EmailUtility {
    public static void emailManager(String formRespId) {
        List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
        List<String> address = new List<String>{'rodrigo.garcia@itksquare.edu.mx'};
            
       	Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
        mail.setSubject('Codey Solutions - Feedback Answer');
        mail.setplaintextbody('Dear Manager\n\n'
                                + 'Codey solutions appreciate and takes in consideration what the customer thinks, '
                                + 'taking that in mind. '
                                + 'Please in the following link '
                                + 'https://codey4-dev-ed.develop.lightning.force.com/lightning/r/Form_Response__c/'+formRespId+'/view, '
                                + 'information provided by the customer its shwon. \n\n'
                                + 'Best regards,\n'
                                + 'Codey solutions.');
        mail.setToAddresses(address);
        emailList.add(mail);
        
        if(!emailList.isEmpty()){
            Messaging.sendEmail(emailList);
        }
    }

    public static void emailGuest(List<String> enURLString, Blob key) {
        
        system.debug('ENTROOOOOO');
        List<Messaging.SingleEmailMessage> emailList = new List<Messaging.SingleEmailMessage>();
        Map<Id, String> mapAccount = new Map<Id, String>();
        List<Id> accId = new List<Id>();

        for (String enURL : enURLString) {
            Blob dest = EncodingUtil.base64Decode(enURL);
            Blob decrypted = Crypto.decryptWithManagedIv('AES256', key, dest);
            String decryptedText = decrypted.toString();
            system.debug(decryptedText);

            String[] decrypInfo = decryptedText.split(' ');
                system.debug('decrypInfo');
                system.debug(decrypInfo);
            String URL = 'https://codey4-dev-ed.develop.my.site.com/s/form' + enURL;
            mapAccount.put(Id.valueOf(decrypInfo[0]), URL);
                system.debug('mapAccount');
                system.debug(mapAccount);
            accId.add(Id.valueOf(decrypInfo[2]));
        }

        for (Account a : [SELECT Id, Email__c FROM Account WHERE Id IN :accId]) {
            if (mapAccount.containsKey(a.Id)) {

                Messaging.SingleEmailMessage mail = new Messaging.SingleEmailMessage();
                List<String> address = new List<String>{String.valueOf(a.Email__c)};
                system.debug(address);

                mail.setSubject('Codey Solutions - Feedback Request');
                mail.setplaintextbody('Dear' + a.Name + '\n\n'
                + 'Codey solutions appreciate and takes in consideration what the customer thinks, '
                + 'taking that in mind. '
                +  mapAccount.get(a.Id) + '\n\n'
                + 'Best regards,\n'
                + 'Codey solutions.');

                mail.setToAddresses(address);
                emailList.add(mail);
            }
        }
            
        if(!emailList.isEmpty()){
            Messaging.sendEmail(emailList);
        }

    }

}