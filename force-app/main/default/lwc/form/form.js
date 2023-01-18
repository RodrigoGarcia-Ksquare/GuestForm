import { LightningElement, wire, track } from 'lwc';
import getFields from '@salesforce/apex/FormBuilderController.getFields';
import saveFormResponse from '@salesforce/apex/FormBuilderController.saveFormResponse';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

document.documentElement.style.overflow = 'hidden';

//Function to clean the code later on
//Create the list of answers
var createResponse = function(questionResponse, responseObj) {
    console.log('PROBANDO')
}

export default class Form extends LightningElement {

    //Obtain the fields according to an specific Form
    //When getting the invitation Id it will be related to an specific form
    //Fields will be retrived into the HTML to be rendered
    @wire(getFields,{formId:'$formId'}) formFields;
    @track responseList = [];                                       //List to store responses in a given Form

    formId = 'a00Dn0000049t0WIAQ';
    checked = false;
    
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

        saveFormResponse({formId: id, responseList: responseList});     //Calling the method to create the records
        this.showSuccess();
        
        console.log('FORM ID',this.formId);
        console.log('REPONSE LIST',JSON.stringify(this.responseList));
        
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


    //MARKUP ONLY
    // value = [];

    // get options() {
    //     return [
    //         { label: 'Yes', value: 'option1' },
    //         { label: 'No', value: 'option2' },
    //     ];
    // }
}