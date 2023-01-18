trigger InvitationTrigger on Form_invitation__c (after insert, before insert, after update ) {
    new InvitationTriggerHandler().run();
}