import { FormControl, ValidationErrors } from "@angular/forms";

export class Love2ShopValidators {
    static notOnlyWhitespace(control: FormControl) : ValidationErrors | null{
        if ((control.value != null) && (control.value.trim().length === 0)){
            return {'notOnlyWhitspace': true};
        }
        else{
            return null;
        }
    }
}
