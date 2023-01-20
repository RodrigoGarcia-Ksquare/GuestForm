public with sharing class EncryptationHandler {

    public static String Encryptation(String unEncrypted) {
        Blob key = Crypto.generateAesKey(256);
        Blob source = Blob.valueOf(unEncrypted);
        Blob encrypted = Crypto.encryptWithManagedIV('AES256', key, source);
        String encrypted64 = EncodingUtil.base64Encode(encrypted);

        return encrypted64;
    }

    @AuraEnabled(cacheable=true)
    public static String Desencryptation(String Encrypted) {
        Blob key = Crypto.generateAesKey(256);
        Blob dest = EncodingUtil.base64Decode(Encrypted);
        Blob decrypted = Crypto.decryptWithManagedIv('AES256', key, dest);
        String decryptedText = decrypted.toString();
        system.debug('DECRI'+decryptedText);
        return decryptedText;
    }
    
}