import { LightningElement, wire, track } from 'lwc';
import getFields from '@salesforce/apex/FormBuilderController.getFields';
import saveFormResponse from '@salesforce/apex/FormBuilderController.saveFormResponse';
import getInv from '@salesforce/apex/FormBuilderController.getInv';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import { CurrentPageReference } from 'lightning/navigation';

import CODEY2_LOGO from '@salesforce/resourceUrl/Codey2'

document.documentElement.style.overflow = 'hidden';


export default class Form extends LightningElement {

    codey2_logo = CODEY2_LOGO;

    //Obtain the fields according to an specific Form
    //When getting the invitation Id it will be related to an specific form
    //Fields will be retrived into the HTML to be rendered
    @wire(getFields,{formId:'$formId'}) formFields;
    //@wire(getInv,{Encryption:'$urlEnc'}) invitation;
    @track responseList = [];                                       //List to store responses in a given Form

    invitation = {'sobjectType':'Form_Invitation__c'};              //Invitation object to store values
    @track urlEnc;                                                  //URL variable
    @track formId;                                                  //Form Id information
    @track isActive = null;                                         //To check if the form is aviable
    checked = false;

    //URL information process
    //Navigation API its necessary
    @wire(CurrentPageReference)
    getStateParameters(currentPageReference){
        if (currentPageReference) {
            this.urlEnc = currentPageReference.state?.EncryptedId__c;   //currentPageReference.state?.ParameterName to get the value of the parameter
            this.urlEnc = this.urlEnc.replace(/\s/g, '+');              //URL correction to its original value

            //Method to fetch Invitation Id
            getInv({Encryption: this.urlEnc}).then(response =>{
                this.invitation.Id = response[0].Id;
                this.invitation.Account__c = response[0].Account__c;
                this.invitation.Form__c = response[0].Form__c;
                this.invitation.isActive__c = response[0].isActive__c;

                this.isActive = this.invitation.isActive__c;
                this.formId = this.invitation.Form__c;
                // console.log(this.invitation);
                // console.log(this.isActive);
            })
         }
    }

    handleChange(e){
        
        let getQuestionName = e.target.name;                        //Getting question information
        let response = {'sobjectType':'Form_Field__c'};             //Create an object to store data

        //Checking wether a text or checkbox event was activated
        //Checkbox event was activated
        if(e.target.checked != this.checked){         

            this.checked = e.target.checked;                        //update checkbox value
            let questionQuery = getQuestionName;            
            
            //Since question name its unique
            //Fetch the information related to that specific question
            let question = this.template.querySelector(`[class*='${questionQuery}']`);

            //Set values into the object which will be pushed into the list
            response.Label__c = question.label;
            response.FieldType__c = question.type;
            response.isRadio__c = question.checked;
            response.Name = question.name;

            if(this.responseList.length > 0){                       //If it's not the first value in the list
                //Check where the question is inside the list
                const index = this.responseList.map(object => object.Name).indexOf(response.Name);
                if(index != -1){                                    //If exist
                    if(this.responseList[index] != response)        //Check where is within the list
                    {this.responseList.splice(index, 1, response);} //Update the values
                }
            else{this.responseList.push(response);}                 //If doesnt exist, push it into the list
            } else {this.responseList.push(response);}              //If it's the first value in the list push it into the list
        }

        //Text event was activated
        else{
            //Same logic as above
            let questionQuery = getQuestionName;
            let question = this.template.querySelector(`[class*='${questionQuery}']`);

            response.Label__c = question.label;
            response.FieldType__c = question.type;
            response.Value__c = question.value;
            response.Name = question.name;
            
            if(this.responseList.length > 0){
                const index = this.responseList.map(object => object.Name).indexOf(response.Name);
                if(index != -1){
                    if(this.responseList[index] != response)
                    {this.responseList.splice(index, 1, response);}
                }
                else{this.responseList.push(response);}
            } else {this.responseList.push(response);}
        }
    }

    handleSubmit(){
        
        //Event activated by pressing the submit button
        //Setting values
        let id = this.formId;
        let responseList = this.responseList;
        let invitationId = this.invitation.Id;

        saveFormResponse({formId: id, responseList: responseList, invitationId: invitationId});     //Calling the method to create the records
        // console.log('FORM ID',this.formId);
        // console.log('REPONSE LIST',JSON.stringify(this.responseList));
        this.showSuccess();
        window.location.reload();
    }

    showSuccess(){
        const evt = new ShowToastEvent({
            title: 'Success',
            message: 'Saved Responses',
            variant: 'success'
        })

        //console.log('success');

        this.dispatchEvent(evt);
    }
}