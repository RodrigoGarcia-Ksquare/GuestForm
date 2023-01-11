import { LightningElement, wire, track } from 'lwc';
import getFields from '@salesforce/apex/FormBuilderController.getFields';

var createResponse = function(questionResponse, responseObj) {
    console.log('PROBANDO')
}

export default class Form extends LightningElement {

    @wire(getFields,{formId:'$formId'}) formFields;
    @track responseList = [];

    formId = 'a00Dn0000049t0WIAQ';
    checked = false;
    
    handleChange(e){
        
        let getQuestionName = e.target.name;
        let response = {'sobjectType':'Form_Field__c'};

        if(e.target.checked != this.checked){
            this.checked = e.target.checked;
            let questionQuery = getQuestionName;
            let question = this.template.querySelector(`[class*='${questionQuery}']`);

            response.Label__c = question.label;
            response.FieldType__c = question.type;
            response.isRadio__c = question.checked;
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

        else{
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

    handleSubmit(e){
        console.log('FORM ID',this.formId);
        console.log('REPONSE LIST',JSON.stringify(this.responseList));
        
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